import { courses, internshipPostings, site } from "@/data/content";

export type PaymentProvider = "paystack" | "accrue";
export type PaymentKind = "internship" | "course";

export type CheckoutResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

export type VerifyResult =
  | { ok: true; joinUrl: string; title: string }
  | { ok: false; error: string };

const PAYSTACK_API = "https://api.paystack.co";

function accrueEndpoint() {
  return process.env.ACCRUE_API_URL || "https://api.useaccrue.com/cashramp/api/graphql";
}

function accrueKey() {
  return process.env.ACCRUE_SECRET_KEY || process.env.CSHRMP_SECRET_KEY || "";
}

function defaultJoinUrl(title: string) {
  const text = encodeURIComponent(`I paid for ${title}`);
  return `https://wa.me/${site.whatsapp.replace(/\D/g, "")}?text=${text}`;
}

function product(kind: PaymentKind, slug: string) {
  if (kind === "internship") {
    const posting = internshipPostings.find(
      (item) => item.slug === slug && item.status === "open",
    );
    if (!posting?.joinUrl) return null;
    return {
      slug: posting.slug,
      title: posting.title,
      fee: posting.fee,
      joinUrl: posting.joinUrl,
      returnPath: "/internship",
    };
  }

  const course = courses.find((item) => item.slug === slug);
  if (!course) return null;
  return {
    slug: course.slug,
    title: course.title,
    fee: course.fee,
    joinUrl: course.joinUrl ?? defaultJoinUrl(course.title),
    returnPath: "/courses",
  };
}

export function feeDollars(fee: string) {
  const amount = Number(fee.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return amount;
}

function quote(value: string) {
  return JSON.stringify(value);
}

function splitName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? "Student";
  const lastName = parts.slice(1).join(" ") || firstName;
  return { firstName, lastName };
}

export async function startCheckout(input: {
  kind: PaymentKind;
  slug: string;
  name: string;
  email: string;
  provider: PaymentProvider;
  origin: string;
}): Promise<CheckoutResult> {
  const item = product(input.kind, input.slug);
  if (!item) return { ok: false, error: "That program is not open for payment." };

  const dollars = feeDollars(item.fee);
  if (dollars == null) return { ok: false, error: "This fee is not set." };

  const reference = `pvl-${input.kind}-${item.slug}-${crypto.randomUUID()}`;
  const redirectUrl = new URL(item.returnPath, input.origin);
  redirectUrl.searchParams.set("paid", "1");
  redirectUrl.searchParams.set("kind", input.kind);
  redirectUrl.searchParams.set("provider", input.provider);
  redirectUrl.searchParams.set("reference", reference);
  redirectUrl.searchParams.set("slug", item.slug);

  if (input.provider === "paystack") {
    return startPaystack({
      email: input.email,
      name: input.name,
      dollars,
      reference,
      callbackUrl: redirectUrl.toString(),
      slug: item.slug,
    });
  }

  return startAccrue({
    email: input.email,
    name: input.name,
    dollars,
    reference,
    redirectUrl: redirectUrl.toString(),
    slug: item.slug,
  });
}

async function startPaystack(input: {
  email: string;
  name: string;
  dollars: number;
  reference: string;
  callbackUrl: string;
  slug: string;
}): Promise<CheckoutResult> {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return { ok: false, error: "Paystack is not set up yet. Add PAYSTACK_SECRET_KEY on the server." };
  }

  const currency = (process.env.PAYSTACK_CURRENCY || "USD").toUpperCase();
  const response = await fetch(`${PAYSTACK_API}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      amount: Math.round(input.dollars * 100),
      currency,
      reference: input.reference,
      callback_url: input.callbackUrl,
      metadata: {
        slug: input.slug,
        name: input.name,
        cancel_action: input.callbackUrl,
      },
    }),
    signal: AbortSignal.timeout(20000),
  });

  const payload = (await response.json().catch(() => null)) as {
    status?: boolean;
    message?: string;
    data?: { authorization_url?: string };
  } | null;

  const url = payload?.data?.authorization_url;
  if (!response.ok || !payload?.status || !url) {
    return { ok: false, error: payload?.message || "Paystack could not start this payment." };
  }

  return { ok: true, url };
}

async function startAccrue(input: {
  email: string;
  name: string;
  dollars: number;
  reference: string;
  redirectUrl: string;
  slug: string;
}): Promise<CheckoutResult> {
  const secret = accrueKey();
  if (!secret) {
    return { ok: false, error: "Accrue is not set up yet. Add ACCRUE_SECRET_KEY on the server." };
  }

  const { firstName, lastName } = splitName(input.name);
  const query = `mutation {
    initiateHostedPayment(
      paymentType: deposit
      amount: ${input.dollars}
      currency: usd
      countryCode: "GH"
      reference: ${quote(input.reference)}
      redirectUrl: ${quote(input.redirectUrl)}
      firstName: ${quote(firstName)}
      lastName: ${quote(lastName)}
      email: ${quote(input.email)}
      metadata: { slug: ${quote(input.slug)} }
    ) {
      hostedLink
      id
      status
    }
  }`;

  const payload = await accrueQuery(secret, query);
  const hostedLink = payload?.data?.initiateHostedPayment?.hostedLink;
  if (!hostedLink || typeof hostedLink !== "string") {
    return { ok: false, error: accrueError(payload) || "Accrue could not start this payment." };
  }

  return { ok: true, url: hostedLink };
}

export async function verifyCheckout(input: {
  kind: PaymentKind;
  slug: string;
  provider: PaymentProvider;
  reference: string;
}): Promise<VerifyResult> {
  const item = product(input.kind, input.slug);
  if (!item) return { ok: false, error: "That program is not open for payment." };
  if (!input.reference.startsWith(`pvl-${input.kind}-${item.slug}-`)) {
    return { ok: false, error: "This payment reference does not match the program." };
  }

  const dollars = feeDollars(item.fee);
  if (dollars == null) return { ok: false, error: "This fee is not set." };

  if (input.provider === "paystack") {
    const paid = await verifyPaystack(input.reference, dollars, item.slug);
    if (!paid.ok) return paid;
  } else {
    const paid = await verifyAccrue(input.reference);
    if (!paid.ok) return paid;
  }

  return { ok: true, joinUrl: item.joinUrl, title: item.title };
}

async function verifyPaystack(
  reference: string,
  dollars: number,
  slug: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return { ok: false, error: "Paystack is not set up yet. Add PAYSTACK_SECRET_KEY on the server." };
  }

  const response = await fetch(
    `${PAYSTACK_API}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${secret}` },
      signal: AbortSignal.timeout(20000),
    },
  );
  const payload = (await response.json().catch(() => null)) as {
    status?: boolean;
    message?: string;
    data?: { status?: string; amount?: number; metadata?: { slug?: string } | string };
  } | null;

  const data = payload?.data;
  const expected = Math.round(dollars * 100);
  let metadataSlug: string | undefined;
  if (typeof data?.metadata === "string") {
    try {
      metadataSlug = (JSON.parse(data.metadata) as { slug?: string }).slug;
    } catch {
      metadataSlug = undefined;
    }
  } else {
    metadataSlug = data?.metadata?.slug;
  }

  if (!response.ok || !payload?.status || data?.status !== "success" || data.amount !== expected) {
    return { ok: false, error: payload?.message || "Paystack has not confirmed this payment yet." };
  }
  if (metadataSlug && metadataSlug !== slug) {
    return { ok: false, error: "This payment is for a different program." };
  }

  return { ok: true };
}

async function verifyAccrue(
  reference: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const secret = accrueKey();
  if (!secret) {
    return { ok: false, error: "Accrue is not set up yet. Add ACCRUE_SECRET_KEY on the server." };
  }

  const query = `query {
    merchantPaymentRequest(reference: ${quote(reference)}) {
      status
      reference
    }
  }`;
  const payload = await accrueQuery(secret, query);
  const status = payload?.data?.merchantPaymentRequest?.status;
  if (status !== "completed") {
    return {
      ok: false,
      error:
        status === "canceled"
          ? "This Accrue payment was canceled."
          : accrueError(payload) || "Accrue has not confirmed this payment yet.",
    };
  }

  return { ok: true };
}

async function accrueQuery(secret: string, query: string) {
  const response = await fetch(accrueEndpoint(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
    signal: AbortSignal.timeout(20000),
  });
  return (await response.json().catch(() => null)) as {
    data?: {
      initiateHostedPayment?: { hostedLink?: string };
      merchantPaymentRequest?: { status?: string };
    };
    errors?: { message?: string }[];
  } | null;
}

function accrueError(payload: { errors?: { message?: string }[] } | null) {
  return payload?.errors?.[0]?.message;
}
