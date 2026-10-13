import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { readAdminAccount } from "@/lib/backend-store";
import { sendUserEmails, type MailRecipient } from "@/lib/mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const jar = await cookies();
  const admin = await readAdminAccount(jar.get("pvl_admin")?.value);
  if (!admin) {
    return Response.json({ ok: false, error: "Sign in to the admin portal." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    subject?: unknown;
    message?: unknown;
    recipients?: unknown;
  } | null;

  const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
  const message = typeof body?.message === "string" ? body.message.trim() : "";
  if (subject.length < 2 || subject.length > 150) {
    return Response.json({ ok: false, error: "Enter a subject." }, { status: 400 });
  }
  if (message.length < 2 || message.length > 8000) {
    return Response.json({ ok: false, error: "Write the message." }, { status: 400 });
  }

  const recipients = new Map<string, MailRecipient>();
  if (Array.isArray(body?.recipients)) {
    for (const item of body.recipients) {
      if (!item || typeof item !== "object") continue;
      const record = item as { name?: unknown; email?: unknown };
      const email = typeof record.email === "string" ? record.email.trim().toLowerCase() : "";
      const name = typeof record.name === "string" ? record.name.trim() : "";
      if (!emailPattern.test(email) || email.length > 120 || name.length > 80) continue;
      if (!recipients.has(email)) recipients.set(email, { email, name: name || email });
    }
  }

  const people = [...recipients.values()];
  if (people.length === 0) {
    return Response.json({ ok: false, error: "Choose at least one person." }, { status: 400 });
  }
  if (people.length > 300) {
    return Response.json({ ok: false, error: "Send to 300 people or fewer at a time." }, { status: 400 });
  }

  try {
    const result = await sendUserEmails({ recipients: people, subject, text: message });
    if (!result.ok) {
      const error =
        result.sent > 0
          ? `${result.error} ${result.sent} ${result.sent === 1 ? "email was" : "emails were"} sent before it stopped.`
          : result.error;
      return Response.json({ ok: false, error }, { status: 502 });
    }
    return Response.json({ ok: true, sent: result.sent });
  } catch {
    return Response.json({ ok: false, error: "The email service did not respond. Try again." }, { status: 502 });
  }
}
