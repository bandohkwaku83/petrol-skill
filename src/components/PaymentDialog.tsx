"use client";

import { FormEvent, useEffect, useId, useState, type ReactNode } from "react";
import type { PaymentKind } from "@/lib/internship-payment";

type Provider = "paystack" | "accrue";

export function PaymentDialog({
  kind,
  slug,
  title,
  fee,
  eyebrow,
  joinLabel,
  returnTo,
  onClose,
}: {
  kind: PaymentKind;
  slug: string;
  title: string;
  fee: string;
  eyebrow: string;
  joinLabel: string;
  returnTo: { provider: Provider; reference: string } | null;
  onClose: () => void;
}) {
  const titleId = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState<Provider | null>(null);
  const [checking, setChecking] = useState(Boolean(returnTo));
  const [joinUrl, setJoinUrl] = useState("");

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape" && !pending && !checking) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, pending, checking]);

  useEffect(() => {
    if (!returnTo) return;
    let cancelled = false;
    const params = new URLSearchParams({
      kind,
      provider: returnTo.provider,
      reference: returnTo.reference,
      slug,
    });
    fetch(`/api/checkout?${params.toString()}`)
      .then((response) => response.json())
      .then((payload: { ok?: boolean; joinUrl?: string; error?: string }) => {
        if (cancelled) return;
        if (payload.ok && payload.joinUrl) setJoinUrl(payload.joinUrl);
        else setError(payload.error || "Payment could not be confirmed.");
      })
      .catch(() => {
        if (!cancelled) setError("Payment could not be confirmed. Try again.");
      })
      .finally(() => {
        if (!cancelled) setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, [kind, returnTo, slug]);

  async function pay(provider: Provider) {
    setError("");
    if (name.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter your name and a valid email.");
      return;
    }
    setPending(provider);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          slug,
          name: name.trim(),
          email: email.trim(),
          provider,
        }),
      });
      const payload = (await response.json()) as { ok?: boolean; url?: string; error?: string };
      if (!payload.ok || !payload.url) {
        setError(payload.error || "Payment could not start.");
        setPending(null);
        return;
      }
      window.location.assign(payload.url);
    } catch {
      setError("Payment could not start. Try again.");
      setPending(null);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy/70">
      <div className="flex min-h-full items-start justify-center p-4 sm:py-10">
        <button
          type="button"
          aria-label="Close payment"
          className="absolute inset-0 cursor-default"
          onClick={() => {
            if (!pending && !checking) onClose();
          }}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="relative z-10 w-full max-w-lg bg-white p-6 shadow-2xl md:p-8"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-orange">
                {eyebrow}
              </p>
              <h2
                id={titleId}
                className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-navy"
              >
                {title}
              </h2>
              <p className="mt-2 text-sm text-muted">
                Fee {fee}. Pay with Paystack or Accrue, then use the join link.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={Boolean(pending) || checking}
              className="px-2 text-2xl leading-none text-navy/50 hover:text-navy disabled:opacity-40"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {checking ? (
            <p className="mt-8 text-sm text-muted">Confirming your payment…</p>
          ) : joinUrl ? (
            <div className="mt-8">
              <p className="text-sm leading-relaxed text-navy">
                Payment received. Tap the link to join {title}.
              </p>
              <a
                href={joinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center bg-orange px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white hover:bg-orange-soft"
              >
                {joinLabel}
              </a>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <label className="block text-sm font-medium text-navy">
                Full name
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  className="mt-1.5 w-full border border-navy/10 px-3 py-3 text-sm outline-none focus:border-orange"
                />
              </label>
              <label className="block text-sm font-medium text-navy">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  className="mt-1.5 w-full border border-navy/10 px-3 py-3 text-sm outline-none focus:border-orange"
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <PayButton provider="paystack" pending={pending} onPay={pay} label="Pay with Paystack">
                  <img
                    src="/images/payments/paystack.png"
                    alt="Paystack"
                    className="h-8 w-auto object-contain"
                  />
                </PayButton>
                <PayButton provider="accrue" pending={pending} onPay={pay} label="Pay with Accrue">
                  <img src="/images/payments/accrue.svg" alt="Accrue" className="h-7 w-auto" />
                </PayButton>
              </div>
              {error ? <p className="text-sm text-orange">{error}</p> : null}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function PayButton({
  provider,
  pending,
  onPay,
  label,
  children,
}: {
  provider: Provider;
  pending: Provider | null;
  onPay: (provider: Provider) => void;
  label: string;
  children: ReactNode;
}) {
  const busy = pending !== null;
  return (
    <button
      type="button"
      aria-label={label}
      disabled={busy}
      onClick={() => onPay(provider)}
      className="flex h-20 items-center justify-center border border-navy/10 bg-white px-4 transition hover:border-orange disabled:opacity-60"
    >
      {pending === provider ? (
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-navy">Opening…</span>
      ) : (
        children
      )}
    </button>
  );
}
