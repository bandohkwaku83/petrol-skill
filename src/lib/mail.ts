import { site } from "@/data/content";

export type MailRecipient = {
  name: string;
  email: string;
};

type SendResult = { ok: true; sent: number } | { ok: false; error: string; sent: number };

const addressPattern = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;

function unwrap(value: string) {
  let current = value.trim();
  while (
    current.length > 1 &&
    ((current.startsWith('"') && current.endsWith('"')) ||
      (current.startsWith("'") && current.endsWith("'")))
  ) {
    current = current.slice(1, -1).trim();
  }
  return current;
}

function fromAddress() {
  const fallback = `${site.shortName} <${site.email}>`;
  const configured = unwrap(process.env.RESEND_FROM ?? "");
  if (!configured) return fallback;
  if (addressPattern.test(configured)) return configured;

  const named = configured.match(/^(.*?)\s*<\s*([^<>"]+@[^<>"]+)\s*>$/);
  if (!named) return fallback;

  const name = unwrap(named[1]).replace(/\s+/g, " ");
  const email = named[2].trim();
  if (!addressPattern.test(email)) return fallback;
  if (!name || /[<>"]/.test(name)) return email;
  return `${name} <${email}>`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function messageHtml(text: string) {
  const body = escapeHtml(text)
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br>")}</p>`)
    .join("");
  return `<div style="font-family:Georgia,serif;font-size:16px;line-height:1.6;color:#0a2748">${body}<p style="margin-top:32px;font-size:13px;color:#5c6b7a">${escapeHtml(site.name)}</p></div>`;
}

export async function sendUserEmails(input: {
  recipients: MailRecipient[];
  subject: string;
  text: string;
}): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "Resend is not set up yet.", sent: 0 };

  const html = messageHtml(input.text);
  const from = fromAddress();
  let sent = 0;

  for (let index = 0; index < input.recipients.length; index += 50) {
    const chunk = input.recipients.slice(index, index + 50);
    const response = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        chunk.map((person) => ({
          from,
          to: [person.email],
          subject: input.subject,
          text: input.text,
          html,
          reply_to: site.email,
        })),
      ),
      signal: AbortSignal.timeout(30000),
    });

    const payload = (await response.json().catch(() => null)) as {
      message?: string;
      data?: { id?: string }[];
    } | null;

    if (!response.ok) {
      const message = payload?.message || "";
      const error = message.includes("Invalid `from` field")
        ? "The sender address is not one Resend can use. The people you selected are fine."
        : message || "Resend could not send this email.";
      return { ok: false, sent, error };
    }

    sent += Array.isArray(payload?.data) ? payload.data.length : chunk.length;
  }

  return { ok: true, sent };
}
