import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { createUserAccount, endUserSession, loginUserAccount, openUserSession, readUserSession } from "@/lib/site-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE = "pvl_account";
const MAX_AGE = 60 * 60 * 24 * 14;

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  };
}

export async function GET() {
  const jar = await cookies();
  const session = await readUserSession(jar.get(COOKIE)?.value);
  if (!session) return Response.json({ ok: false }, { status: 401 });
  return Response.json({ ok: true, session });
}

export async function DELETE() {
  const jar = await cookies();
  await endUserSession(jar.get(COOKIE)?.value);
  jar.set(COOKIE, "", { ...cookieOptions(), maxAge: 0 });
  return Response.json({ ok: true });
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    mode?: unknown;
    name?: unknown;
    email?: unknown;
    password?: unknown;
  } | null;

  const mode = body?.mode === "create" || body?.mode === "login" ? body.mode : null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const name = typeof body?.name === "string" ? body.name.trim() : "";

  if (!mode || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8) {
    return Response.json(
      { ok: false, error: "Enter a valid email and a password of at least 8 characters." },
      { status: 400 },
    );
  }
  if (mode === "create" && name.length < 2) {
    return Response.json({ ok: false, error: "Enter your full name." }, { status: 400 });
  }

  try {
    const result =
      mode === "create"
        ? await createUserAccount({ name, email, password })
        : await loginUserAccount({ email, password });
    if ("error" in result) {
      return Response.json({ ok: false, error: result.error }, { status: 400 });
    }
    const token = await openUserSession(result.session);
    const jar = await cookies();
    jar.set(COOKIE, token, cookieOptions());
    return Response.json({ ok: true, session: result.session });
  } catch {
    return Response.json({ ok: false, error: "The account service did not respond. Try again." }, { status: 502 });
  }
}
