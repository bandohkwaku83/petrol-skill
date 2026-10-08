"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  ACCOUNT_EVENT,
  createAccount,
  getSession,
  login,
  logout,
  type AccountSession,
} from "@/lib/account";

const inputClass =
  "w-full border border-navy/10 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange";

export function EnrollClient() {
  const [mode, setMode] = useState<"create" | "login">("create");
  const [session, setSession] = useState<AccountSession | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const sync = () => setSession(getSession());
    sync();
    setReady(true);
    window.addEventListener(ACCOUNT_EVENT, sync);
    return () => window.removeEventListener(ACCOUNT_EVENT, sync);
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    if (mode === "create") {
      const confirm = String(form.get("confirm") ?? "");
      if (password !== confirm) {
        setError("Passwords do not match.");
        setPending(false);
        return;
      }
      const result = await createAccount({
        name: String(form.get("name") ?? ""),
        email,
        password,
      });
      if (result.error) setError(result.error);
    } else {
      const result = await login({ email, password });
      if (result.error) setError(result.error);
    }
    setPending(false);
  }

  return (
    <section className="bg-sand pt-28 pb-20 md:pt-32 md:pb-28">
      <div className="mx-auto max-w-lg px-5 md:px-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-orange">Enroll</p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.05] text-navy md:text-5xl">
          {session ? "Your account" : mode === "create" ? "Create an account" : "Log in"}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted">
          {session
            ? "You are signed in. Use this account when you come back to PVL."
            : "Create an account to enroll, or log in if you already have one."}
        </p>

        {ready && session ? (
          <div className="mt-8 bg-white p-6">
            <p className="font-[family-name:var(--font-display)] text-2xl font-semibold text-navy">
              {session.name}
            </p>
            <p className="mt-1 text-sm text-muted">{session.email}</p>
            <button
              type="button"
              onClick={() => logout()}
              className="mt-6 bg-navy px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-blue"
            >
              Log out
            </button>
          </div>
        ) : (
          <div className="mt-8 bg-white p-5 md:p-6">
            <div className="grid grid-cols-2 border border-navy/10">
              {(
                [
                  ["create", "Create account"],
                  ["login", "Log in"],
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

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              {mode === "create" ? (
                <label className="block text-sm">
                  <span className="mb-1.5 block font-medium text-navy">Full name</span>
                  <input name="name" required autoComplete="name" className={inputClass} />
                </label>
              ) : null}
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-navy">Email</span>
                <input name="email" type="email" required autoComplete="email" className={inputClass} />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-navy">Password</span>
                <input
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete={mode === "create" ? "new-password" : "current-password"}
                  className={inputClass}
                />
              </label>
              {mode === "create" ? (
                <label className="block text-sm">
                  <span className="mb-1.5 block font-medium text-navy">Confirm password</span>
                  <input
                    name="confirm"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className={inputClass}
                  />
                </label>
              ) : null}

              {error ? (
                <p className="border border-orange/30 bg-orange/10 px-3 py-2 text-sm text-navy" role="alert">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={pending}
                className="w-full bg-orange px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-orange-soft disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending ? "Please wait…" : mode === "create" ? "Create account" : "Log in"}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
