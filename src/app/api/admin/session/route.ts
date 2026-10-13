import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import {
  adminStatus,
  createAdminAccount,
  endAdminSession,
  loginAdminAccount,
  readAdminAccount,
} from "@/lib/backend-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE = "pvl_admin";
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

async function tokenFromCookie() {
  const jar = await cookies();
  return jar.get(COOKIE)?.value;
}

export async function GET() {
  const [status, session] = await Promise.all([adminStatus(), readAdminAccount(await tokenFromCookie())]);
  return Response.json({
    ok: true,
    configured: status.configured,
    authenticated: session !== null,
    session,
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    mode?: unknown;
    name?: unknown;
    email?: unknown;
    password?: unknown;
  } | null;

  const mode = body?.mode === "setup" || body?.mode === "login" ? body.mode : null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const name = typeof body?.name === "string" ? body.name.trim() : "Admin";

  if (!mode || name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8) {
    return Response.json(
      { ok: false, error: "Enter a valid email and a password of at least 8 characters." },
      { status: 400 },
    );
  }

  const result =
    mode === "setup"
      ? await createAdminAccount({ name, email, password })
      : await loginAdminAccount({ email, password });

  if ("error" in result) {
    return Response.json({ ok: false, error: result.error }, { status: mode === "setup" ? 409 : 401 });
  }

  const jar = await cookies();
  jar.set(COOKIE, result.token, cookieOptions());
  return Response.json({ ok: true, session: result.session });
}

export async function DELETE() {
  await endAdminSession(await tokenFromCookie());
  const jar = await cookies();
  jar.set(COOKIE, "", { ...cookieOptions(), maxAge: 0 });
  return Response.json({ ok: true });
}
