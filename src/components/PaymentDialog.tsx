"use client";

import { FormEvent, useEffect, useId, useState, type ReactNode } from "react";
import {
  ACCOUNT_EVENT,
  createAccount,
  getSession,
  login,
  refreshSession,
  type AccountSession,
} from "@/lib/account";
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
  const [account, setAccount] = useState<AccountSession | null>(null);
  const [accountReady, setAccountReady] = useState(false);
  const [mode, setMode] = useState<"login" | "create">("login");
  const [error, setError] = useState("");
  const [pending, setPending] = useState<Provider | "account" | null>(null);
  const [checking, setChecking] = useState(false);
  const [joinUrl, setJoinUrl] = useState("");

  useEffect(() => {
    const sync = () => setAccount(getSession());
    void refreshSession().finally(() => {
      sync();
      setAccountReady(true);
    });
    window.addEventListener(ACCOUNT_EVENT, sync);
    return () => window.removeEventListener(ACCOUNT_EVENT, sync);
  }, []);

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
    if (!returnTo || !account) return;
    let cancelled = false;
    setChecking(true);
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
  }, [account, kind, returnTo, slug]);

  async function pay(provider: Provider) {
    if (!account) return;
    setError("");
    setPending(provider);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, slug, provider }),
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

  async function onAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending("account");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    if (mode === "create") {
      const confirm = String(form.get("confirm") ?? "");
      if (password !== confirm) {
        setError("Passwords do not match.");
        setPending(null);
        return;
      }
      const result = await createAccount({ name: String(form.get("name") ?? ""), email, password });
      if (result.error) setError(result.error);
    } else {
      const result = await login({ email, password });
      if (result.error) setError(result.error);
    }
    setPending(null);
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
                Fee {fee}. Log in or create an account, then pay with Paystack or Accrue.
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

          {!accountReady || checking ? (
            <p className="mt-8 text-sm text-muted">{checking ? "Confirming your payment…" : "Checking your account…"}</p>
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
            account ? (
            <div className="mt-6 space-y-4">
              <p className="text-sm text-navy">
                Paying as <span className="font-semibold">{account.name}</span>
                <span className="mt-1 block text-muted">{account.email}</span>
              </p>
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
            </div>
          ) : (
            <form onSubmit={onAccount} className="mt-6 space-y-4">
              <p className="text-sm leading-relaxed text-navy">
                Log in or create an account before paying.
              </p>
              <div className="grid grid-cols-2 border border-navy/10">
                {(
                  [
                    ["login", "Log in"],
                    ["create", "Create account"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setMode(id);
                      setError("");
                    }}
                    className={`px-3 py-3 text-xs font-bold uppercase tracking-[0.14em] ${
                      mode === id ? "bg-navy text-white" : "bg-white text-navy"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {mode === "create" ? (
                <label className="block text-sm font-medium text-navy">
                  Full name
                  <input
                    name="name"
                    required
                    autoComplete="name"
                    className="mt-1.5 w-full border border-navy/10 px-3 py-3 text-sm outline-none focus:border-orange"
                  />
                </label>
              ) : null}
              <label className="block text-sm font-medium text-navy">
                Email
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="mt-1.5 w-full border border-navy/10 px-3 py-3 text-sm outline-none focus:border-orange"
                />
              </label>
              <label className="block text-sm font-medium text-navy">
                Password
                <input
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete={mode === "create" ? "new-password" : "current-password"}
                  className="mt-1.5 w-full border border-navy/10 px-3 py-3 text-sm outline-none focus:border-orange"
                />
              </label>
              {mode === "create" ? (
                <label className="block text-sm font-medium text-navy">
                  Confirm password
                  <input
                    name="confirm"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="mt-1.5 w-full border border-navy/10 px-3 py-3 text-sm outline-none focus:border-orange"
                  />
                </label>
              ) : null}
              {error ? <p className="text-sm text-orange">{error}</p> : null}
              <button
                type="submit"
                disabled={pending !== null}
                className="w-full bg-orange px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white hover:bg-orange-soft disabled:opacity-60"
              >
                {pending === "account" ? "Please wait…" : mode === "create" ? "Create account" : "Log in"}
              </button>
            </form>
            )
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
  pending: Provider | "account" | null;
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
