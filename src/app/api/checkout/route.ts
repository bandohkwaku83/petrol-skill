import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import {
  startCheckout,
  verifyCheckout,
  type PaymentKind,
  type PaymentProvider,
} from "@/lib/internship-payment";
import { readPaymentEmail, readUserSession } from "@/lib/site-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function signedInUser() {
  const jar = await cookies();
  return readUserSession(jar.get("pvl_account")?.value);
}

function providerOf(value: unknown): PaymentProvider | null {
  return value === "paystack" || value === "accrue" ? value : null;
}

function kindOf(value: unknown): PaymentKind | null {
  return value === "internship" || value === "course" ? value : null;
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    kind?: unknown;
    slug?: unknown;
    name?: unknown;
    email?: unknown;
    provider?: unknown;
  } | null;

  const account = await signedInUser();
  if (!account) {
    return Response.json(
      { ok: false, error: "Log in or create an account before paying." },
      { status: 401 },
    );
  }

  const kind = kindOf(body?.kind);
  const slug = typeof body?.slug === "string" ? body.slug : "";
  const provider = providerOf(body?.provider);

  if (!kind || !slug || !provider) {
    return Response.json({ ok: false, error: "Choose a payment method." }, { status: 400 });
  }

  try {
    const result = await startCheckout({
      kind,
      slug,
      name: account.name,
      email: account.email,
      provider,
      origin: request.nextUrl.origin,
    });
    return Response.json(result, { status: result.ok ? 200 : 400 });
  } catch {
    return Response.json(
      { ok: false, error: "The payment service did not respond. Try again." },
      { status: 502 },
    );
  }
}

export async function GET(request: NextRequest) {
  const kind = kindOf(request.nextUrl.searchParams.get("kind"));
  const provider = providerOf(request.nextUrl.searchParams.get("provider"));
  const reference = request.nextUrl.searchParams.get("reference") ?? "";
  const slug = request.nextUrl.searchParams.get("slug") ?? "";

  if (!kind || !provider || !reference || !slug) {
    return Response.json({ ok: false, error: "Missing payment details." }, { status: 400 });
  }

  const account = await signedInUser();
  if (!account) {
    return Response.json(
      { ok: false, error: "Log in with the account that started this payment." },
      { status: 401 },
    );
  }
  const owner = await readPaymentEmail(reference);
  if (!owner || owner !== account.email) {
    return Response.json(
      { ok: false, error: "Log in with the account that started this payment." },
      { status: 403 },
    );
  }

  try {
    const result = await verifyCheckout({ kind, slug, provider, reference });
    return Response.json(result, { status: result.ok ? 200 : 400 });
  } catch {
    return Response.json(
      { ok: false, error: "The payment service did not respond. Try again." },
      { status: 502 },
    );
  }
}
