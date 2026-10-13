"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";
import { FloatCard, Magnetic, Reveal } from "@/components/motion";
import { site } from "@/data/content";

const inputClass =
  "w-full border border-navy/10 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange";

const channels = [
  {
    name: "WhatsApp community",
    detail: "Join the group for cohort news, reminders, and questions.",
    href: site.social.whatsapp,
    action: "Join community",
    mark: "whatsapp" as const,
  },
  {
    name: "YouTube",
    detail: "Subscribe for session clips, explainers, and program updates.",
    href: site.social.youtube,
    action: "Subscribe",
    mark: "youtube" as const,
  },
];

const socials = [
  { name: "LinkedIn", href: site.social.linkedin, mark: "linkedin" as const },
  { name: "Facebook", href: site.social.facebook, mark: "facebook" as const },
  { name: "X", href: site.social.twitter, mark: "x" as const },
];

function Mark({ name }: { name: "whatsapp" | "youtube" | "linkedin" | "facebook" | "x" }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "h-5 w-5",
    "aria-hidden": true,
    fill: "currentColor",
  };

  if (name === "whatsapp") {
    return (
      <svg {...common}>
        <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.41a10 10 0 004.65 1.18h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2zm5.76 13.9c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.42-.14-.95-.31-1.64-.6-2.88-1.24-4.76-4.14-4.9-4.33-.14-.19-1.16-1.54-1.16-2.94s.73-2.08 1-2.37c.24-.27.64-.39 1.02-.39.12 0 .23 0 .33.01.3.01.45.03.65.5.24.58.82 2 .89 2.15.07.14.12.32.02.51-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.13-.28.28-.12.54.16.27.7 1.15 1.5 1.86 1.03.92 1.9 1.2 2.17 1.34.27.13.43.11.59-.07.16-.17.68-.79.86-1.06.18-.27.36-.22.6-.13.24.09 1.54.73 1.8.86.27.13.44.2.51.31.06.11.06.64-.18 1.32z" />
      </svg>
    );
  }

  if (name === "youtube") {
    return (
      <svg {...common}>
        <path d="M23 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C19.2 5.4 12 5.4 12 5.4s-7.2 0-8.8.4c-.9.2-1.6.9-1.8 1.8C1 9 1 12.2 1 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.6.4 8.8.4 8.8.4s7.2 0 8.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6zM9.8 15.5v-6.6l6.2 3.3-6.2 3.3z" />
      </svg>
    );
  }

  if (name === "linkedin") {
    return (
      <svg {...common}>
        <path d="M4.7 3.2A1.8 1.8 0 112.9 5a1.8 1.8 0 011.8-1.8zM3 8.2h3.4V21H3V8.2zM9.3 8.2H12.6v1.7h.1c.5-.9 1.6-1.9 3.4-1.9 3.6 0 4.3 2.4 4.3 5.5V21H17v-6.4c0-1.5 0-3.5-2.1-3.5s-2.5 1.7-2.5 3.4V21H9.3V8.2z" />
      </svg>
    );
  }

  if (name === "facebook") {
    return (
      <svg {...common}>
        <path d="M14.5 8.5V6.8c0-.7.5-1 1.2-1h1.8V3h-2.5C11.8 3 10.5 4.6 10.5 6.6v1.9H8.5V11h2v10h4v-10h2.6l.4-2.5h-3z" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M17.6 3H20.4L14.1 10.2 21.5 21h-6.2l-4.3-6.6L6 21H3.2l6.8-7.8L2.7 3h6.3l3.9 6.1L17.6 3zm-1.1 16.2h1.7L7.6 4.7H5.8l10.7 14.5z" />
    </svg>
  );
}

export default function WaitlistPage() {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    const nextName = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nextName, email }),
      });
      const data = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!response.ok || !data?.ok) {
        setError(data?.error || "The waitlist did not save. Try again.");
        setPending(false);
        return;
      }
      setName(nextName);
      setSent(true);
    } catch {
      setError("The waitlist did not save. Try again.");
      setPending(false);
    }
  }

  return (
    <section id="join" className="bg-sand pt-28 pb-20 md:pt-32 md:pb-28">
      <div className="mx-auto grid max-w-7xl items-start gap-8 px-5 lg:grid-cols-[1.15fr_0.85fr] md:px-8">
        <div>
          <Reveal>
            <div className="max-w-3xl">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.28em] text-orange">
                Waitlist
              </p>
              <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold leading-[1.1] tracking-tight text-navy md:text-5xl">
                Tell us how to reach you
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">
                One note when seats open. No extra steps, and you can leave the list any time
                by writing to us.
              </p>
            </div>
          </Reveal>

            <FloatCard delay={0.12} className="mt-10">
              <div className="bg-white p-6 shadow-[0_24px_60px_-36px_rgba(10,39,72,0.5)] md:p-8">
                {sent ? (
                  <div className="py-8">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-orange">
                      You&apos;re on the list
                    </p>
                    <h3 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-navy">
                      Thanks{name ? `, ${name}` : ""}.
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
                      We&apos;ll email you when a program opens. While you wait, join the
                      community and subscribe on the side.
                    </p>
                    <div className="mt-8">
                      <Magnetic>
                        <Button href="/courses" variant="primary">
                          Browse courses
                        </Button>
                      </Magnetic>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} className="space-y-5">
                    <div>
                      <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-navy">
                        Join the waitlist
                      </h3>
                      <p className="mt-2 text-sm text-muted">
                        Internships, upcoming courses, and future cohorts.
                      </p>
                    </div>
                    <label className="block text-sm">
                      <span className="mb-1.5 block font-medium text-navy">Name</span>
                      <input
                        required
                        name="name"
                        autoComplete="name"
                        placeholder="Your full name"
                        className={inputClass}
                      />
                    </label>
                    <label className="block text-sm">
                      <span className="mb-1.5 block font-medium text-navy">Email</span>
                      <input
                        required
                        type="email"
                        name="email"
                        autoComplete="email"
                        placeholder="you@email.com"
                        className={inputClass}
                      />
                    </label>
                    {error ? (
                      <p role="alert" className="border border-orange/30 bg-orange/10 px-3 py-2 text-sm text-navy">
                        {error}
                      </p>
                    ) : null}
                    <button
                      type="submit"
                      disabled={pending}
                      className="w-full bg-orange px-5 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-orange-soft disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {pending ? "Please wait…" : "Join waitlist"}
                    </button>
                  </form>
                )}
              </div>
            </FloatCard>
          </div>

          <Reveal delay={0.18} className="lg:sticky lg:top-28">
            <aside className="bg-navy p-6 text-white md:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-orange-soft">
                While you wait
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold leading-tight md:text-3xl">
                Join the community and follow our channels
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                Cohort notices also go out on WhatsApp and YouTube. The other channels are
                for sessions, stories, and day-to-day updates.
              </p>

              <ul className="mt-8 space-y-3">
                {channels.map((channel) => (
                  <li key={channel.name}>
                    <a
                      href={channel.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-4 border border-white/10 bg-white/5 p-4 transition hover:border-orange/60 hover:bg-white/10"
                    >
                      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center bg-orange text-white">
                        <Mark name={channel.mark} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold">{channel.name}</span>
                        <span className="mt-1 block text-sm leading-relaxed text-white/60">
                          {channel.detail}
                        </span>
                        <span className="mt-3 block text-[11px] font-bold uppercase tracking-[0.16em] text-orange-soft">
                          {channel.action}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-orange-soft">
                  Other social media
                </p>
                <ul className="mt-4 grid gap-2">
                  {socials.map((social) => (
                    <li key={social.name}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-3 border border-white/10 px-4 py-3 text-sm font-semibold transition hover:border-white/30 hover:bg-white/5"
                      >
                        <span className="flex items-center gap-3">
                          <Mark name={social.mark} />
                          {social.name}
                        </span>
                        <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">
                          Follow
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </Reveal>
      </div>
    </section>
  );
}
