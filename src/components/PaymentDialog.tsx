"use client";

import { FormEvent, useEffect, useId, useState } from "react";
import {
  ACCOUNT_EVENT,
  createAccount,
  getSession,
  login,
  refreshSession,
  type AccountSession,
} from "@/lib/account";
import type { PaymentKind } from "@/lib/internship-payment";
import { marketFor, paymentCountries } from "@/lib/payment-markets";

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
  const [country, setCountry] = useState("");
  const [provider, setProvider] = useState<Provider>("paystack");
  const market = marketFor(country);
  const confirming = Boolean(returnTo);

  function chooseCountry(code: string) {
    const next = marketFor(code);
    setCountry(code);
    if (next) setProvider(next.provider);
    setError("");
  }

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

  async function pay(nextProvider: Provider) {
    if (!account || !market) return;
    if (nextProvider === "accrue" && market.code === "OTHER") {
      setError("Choose your country to pay with Accrue.");
      return;
    }
    setError("");
    setPending(nextProvider);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, slug, provider: nextProvider, country: market.code }),
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
                Fee {fee}. Choose your country and we will suggest Paystack or Accrue. You can switch.
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
          ) : confirming ? (
            account ? (
              error ? <p className="mt-8 text-sm text-orange">{error}</p> : null
            ) : (
            <form onSubmit={onAccount} className="mt-6 space-y-4">
              <p className="text-sm leading-relaxed text-navy">
                Log in with the account that started this payment.
              </p>
              <AccountFields mode={mode} setMode={setMode} setError={setError} />
              {error ? <p className="text-sm text-orange">{error}</p> : null}
              <AccountSubmit pending={pending} mode={mode} />
            </form>
            )
          ) : (
            <div className="mt-6 space-y-4">
              <CountrySelect value={country} disabled={pending !== null} onChange={chooseCountry} />
              {market ? (
                <>
                  {account ? (
                    <p className="text-sm text-navy">
                      Paying as <span className="font-semibold">{account.name}</span>
                      <span className="mt-1 block text-muted">{account.email}</span>
                    </p>
                  ) : (
                    <p className="text-sm leading-relaxed text-navy">
                      Log in or create an account, then pay from {market.name}.
                    </p>
                  )}
                  <ProviderPicker
                    recommended={market.provider}
                    selected={provider}
                    pending={pending}
                    onSelect={(next) => {
                      setProvider(next);
                      setError("");
                    }}
                  />
                  {account ? (
                    <button
                      type="button"
                      disabled={pending !== null}
                      onClick={() => void pay(provider)}
                      className="w-full bg-orange px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white hover:bg-orange-soft disabled:opacity-60"
                    >
                      {pending === provider
                        ? "Opening…"
                        : `Pay with ${provider === "paystack" ? "Paystack" : "Accrue"}`}
                    </button>
                  ) : (
                    <form onSubmit={onAccount} className="space-y-4">
                      <AccountFields mode={mode} setMode={setMode} setError={setError} />
                      <AccountSubmit pending={pending} mode={mode} />
                    </form>
                  )}
                </>
              ) : null}
              {error ? <p className="text-sm text-orange">{error}</p> : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const providerOptions: Array<{
  id: Provider;
  label: string;
  image: string;
  imageClass: string;
}> = [
  {
    id: "paystack",
    label: "Paystack",
    image: "/images/payments/paystack.png",
    imageClass: "h-8 w-auto object-contain",
  },
  {
    id: "accrue",
    label: "Accrue",
    image: "/images/payments/accrue.svg",
    imageClass: "h-7 w-auto",
  },
];

function CountrySelect({
  value,
  disabled,
  onChange,
}: {
  value: string;
  disabled: boolean;
  onChange: (code: string) => void;
}) {
  return (
    <label className="block text-sm font-medium text-navy" htmlFor="payment-country">
      Country you are paying from
      <select
        id="payment-country"
        name="country"
        required
        disabled={disabled}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 w-full border border-navy/10 bg-white px-3 py-3 text-sm outline-none focus:border-orange disabled:opacity-60"
      >
        <option value="">Select your country</option>
        {paymentCountries().map((item) => (
          <option key={item.code} value={item.code}>
            {item.name}
          </option>
        ))}
      </select>
    </label>
  );
}

function ProviderPicker({
  recommended,
  selected,
  pending,
  onSelect,
}: {
  recommended: Provider;
  selected: Provider;
  pending: Provider | "account" | null;
  onSelect: (provider: Provider) => void;
}) {
  const ordered = [...providerOptions].sort((a, b) =>
    a.id === recommended ? -1 : b.id === recommended ? 1 : 0,
  );

  return (
    <div className="grid grid-cols-2 gap-3">
      {ordered.map((option) => {
        const active = selected === option.id;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            aria-label={option.id === recommended ? `${option.label}, suggested` : option.label}
            disabled={pending !== null}
            onClick={() => onSelect(option.id)}
            className={`flex h-24 flex-col items-center justify-end gap-2 border px-3 pb-3 transition disabled:opacity-60 ${
              active ? "border-orange bg-sand" : "border-navy/10 bg-white hover:border-orange"
            }`}
          >
            <span
              aria-hidden="true"
              className={`text-[10px] font-bold uppercase tracking-[0.14em] ${
                option.id === recommended ? "text-orange" : "invisible"
              }`}
            >
              Suggested
            </span>
            <img src={option.image} alt="" className={option.imageClass} />
          </button>
        );
      })}
    </div>
  );
}

function AccountFields({
  mode,
  setMode,
  setError,
}: {
  mode: "login" | "create";
  setMode: (mode: "login" | "create") => void;
  setError: (error: string) => void;
}) {
  return (
    <>
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
    </>
  );
}

function AccountSubmit({
  pending,
  mode,
}: {
  pending: Provider | "account" | null;
  mode: "login" | "create";
}) {
  return (
    <button
      type="submit"
      disabled={pending !== null}
      className="w-full bg-orange px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white hover:bg-orange-soft disabled:opacity-60"
    >
      {pending === "account" ? "Please wait…" : mode === "create" ? "Create account" : "Log in"}
    </button>
  );
}
