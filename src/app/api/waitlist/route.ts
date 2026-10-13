import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { joinWaitlist, listWaitlist, readAdminAccount, removeWaitlist } from "@/lib/backend-store";
import { cleanWaitlistInput } from "@/lib/waitlist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const hits = new Map<string, number[]>();

function limited(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  const key = forwarded?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < 60_000);
  if (recent.length >= 8) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  return false;
}

async function requireAdmin() {
  const jar = await cookies();
  return readAdminAccount(jar.get("pvl_admin")?.value);
}

export async function POST(request: NextRequest) {
  if (limited(request)) {
    return Response.json(
      { ok: false, error: "Too many attempts. Wait a minute and try again." },
      { status: 429 },
    );
  }

  const body = (await request.json().catch(() => null)) as { name?: unknown; email?: unknown } | null;
  const cleaned = cleanWaitlistInput({ name: body?.name, email: body?.email });
  if ("error" in cleaned) {
    return Response.json({ ok: false, error: cleaned.error }, { status: 400 });
  }

  try {
    await joinWaitlist(cleaned);
    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { ok: false, error: "The waitlist did not save. Try again." },
      { status: 500 },
    );
  }
}

export async function GET() {
  if (!(await requireAdmin())) {
    return Response.json({ ok: false, error: "Sign in to the admin portal." }, { status: 401 });
  }

  try {
    return Response.json({ ok: true, entries: await listWaitlist() });
  } catch {
    return Response.json({ ok: false, error: "The waitlist could not be loaded." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await requireAdmin())) {
    return Response.json({ ok: false, error: "Sign in to the admin portal." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { id?: unknown } | null;
  const id = typeof body?.id === "string" ? body.id : "";
  if (!id.startsWith("waitlist-")) {
    return Response.json({ ok: false, error: "Missing waitlist signup." }, { status: 400 });
  }

  try {
    await removeWaitlist(id);
    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { ok: false, error: "Could not remove this waitlist signup." },
      { status: 500 },
    );
  }
}
