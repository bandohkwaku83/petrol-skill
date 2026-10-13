import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import type { AdminStore } from "@/lib/admin-store";
import { readAdminAccount, readAdminStore, saveAdminStore } from "@/lib/site-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin() {
  const jar = await cookies();
  return readAdminAccount(jar.get("pvl_admin")?.value);
}

export async function GET() {
  if (!(await requireAdmin())) {
    return Response.json({ ok: false, error: "Sign in to the admin portal." }, { status: 401 });
  }
  try {
    return Response.json({ ok: true, store: await readAdminStore() });
  } catch {
    return Response.json({ ok: false, error: "The website data could not be loaded." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!(await requireAdmin())) {
    return Response.json({ ok: false, error: "Sign in to the admin portal." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    store?: AdminStore;
    removedPaymentIds?: unknown;
    changedPaymentIds?: unknown;
  } | null;
  const store = body?.store;
  if (!store || !Array.isArray(store.courses) || !Array.isArray(store.internships) || !Array.isArray(store.news)) {
    return Response.json({ ok: false, error: "Missing website content." }, { status: 400 });
  }
  const removedPaymentIds = Array.isArray(body?.removedPaymentIds)
    ? body.removedPaymentIds.filter((id): id is string => typeof id === "string")
    : [];
  const changedPaymentIds = Array.isArray(body?.changedPaymentIds)
    ? body.changedPaymentIds.filter((id): id is string => typeof id === "string")
    : [];

  try {
    const saved = await saveAdminStore(
      {
        courses: store.courses,
        internships: store.internships,
        news: store.news,
        events: Array.isArray(store.events) ? store.events : [],
        payments: Array.isArray(store.payments) ? store.payments : [],
        members: Array.isArray(store.members) ? store.members : [],
        suppressedEmails: Array.isArray(store.suppressedEmails) ? store.suppressedEmails : [],
      },
      removedPaymentIds,
      changedPaymentIds,
    );
    return Response.json({ ok: true, store: saved });
  } catch {
    return Response.json({ ok: false, error: "Could not save the website." }, { status: 500 });
  }
}
