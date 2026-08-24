"use client";

import { FormEvent, useState } from "react";
import { site } from "@/data/content";

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="border border-white/20 bg-white/5 px-4 py-4 text-sm text-white">
        You&apos;re in. We&apos;ll share upcoming programs soon.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-3">
      {!compact ? (
        <input
          name="name"
          required
          placeholder="Full name"
          className="w-full border border-white/20 bg-transparent px-4 py-3.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-orange-soft"
        />
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          name="email"
          type="email"
          required
          placeholder="Email address"
          className="w-full border border-white/20 bg-transparent px-4 py-3.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-orange-soft"
        />
        <button
          type="submit"
          className="shrink-0 bg-orange px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-orange-soft"
        >
          Subscribe
        </button>
      </div>
      <p className="text-[11px] text-white/40">
        Prefer forms?{" "}
        <a
          href={site.newsletterForm}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white"
        >
          Microsoft Forms
        </a>
      </p>
    </form>
  );
}
