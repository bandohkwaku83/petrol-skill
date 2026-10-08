import type { NextRequest } from "next/server";
import {
  startCheckout,
  verifyCheckout,
  type PaymentKind,
  type PaymentProvider,
} from "@/lib/internship-payment";

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

  const kind = kindOf(body?.kind);
  const slug = typeof body?.slug === "string" ? body.slug : "";
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const provider = providerOf(body?.provider);

  if (!kind || !slug || name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !provider) {
    return Response.json(
      { ok: false, error: "Enter your name, a valid email, and a payment method." },
      { status: 400 },
    );
  }

  try {
    const result = await startCheckout({
      kind,
      slug,
      name,
      email,
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
