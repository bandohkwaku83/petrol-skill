"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  hasAdminCredential,
  logoutAdmin,
  readAdminSession,
  rememberAdminSession,
  type AdminSession,
} from "@/lib/admin-auth";
import { type AdminStore } from "@/lib/admin-store";
import { site } from "@/data/content";

type AdminContextValue = {
  store: AdminStore;
  admin: AdminSession;
  notice: string;
  update: (recipe: (store: AdminStore) => AdminStore, options?: { quiet?: boolean }) => void;
  logout: () => void;
};

const AdminContext = createContext<AdminContextValue | null>(null);

export function useAdmin() {
  const value = useContext(AdminContext);
  if (!value) throw new Error("useAdmin must be used in the admin portal");
  return value;
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<AdminSession | null>(null);
  const [credentialExists, setCredentialExists] = useState(false);
  const [store, setStore] = useState<AdminStore | null>(null);
  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState("");
  const storeRef = useRef<AdminStore | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveQueue = useRef(Promise.resolve());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const local = readAdminSession();
      let serverSession: AdminSession | null = null;
      let configured = false;
      let reached = false;
      try {
        const response = await fetch("/api/admin/session");
        const data = (await response.json()) as {
          configured?: boolean;
          authenticated?: boolean;
          session?: AdminSession | null;
        };
        reached = true;
        configured = Boolean(data.configured);
        if (data.authenticated && data.session?.email && data.session.name) {
          serverSession = { name: data.session.name, email: data.session.email };
        }
      } catch {
        reached = false;
      }
      if (cancelled) return;
      if (reached) {
        setCredentialExists(configured);
        setSession(serverSession);
      } else {
        setCredentialExists(hasAdminCredential());
        setSession(local);
      }
      setReady(true);
    })();
    return () => {
      cancelled = true;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    if (!session) return;
    setLoadError("");
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch("/api/admin/store");
        const data = (await response.json()) as { ok?: boolean; store?: AdminStore };
        if (cancelled) return;
        if (!data.ok || !data.store) {
          setLoadError("Could not load the website data.");
          return;
        }
        storeRef.current = data.store;
        setStore(data.store);
      } catch {
        if (!cancelled) setLoadError("Could not load the website data.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [session]);

  const update = useCallback((recipe: (current: AdminStore) => AdminStore, options?: { quiet?: boolean }) => {
    const current = storeRef.current;
    if (!current) return;
    const next = recipe(current);
    if (next === current) return;
    const removedPaymentIds = current.payments
      .filter((payment) => !next.payments.some((item) => item.id === payment.id))
      .map((payment) => payment.id);
    const changedPaymentIds = next.payments
      .filter((payment) => {
        const previous = current.payments.find((item) => item.id === payment.id);
        return previous && (previous.status !== payment.status || previous.notes !== payment.notes);
      })
      .map((payment) => payment.id);
    storeRef.current = next;
    setStore(next);
    const snapshot = next;
    saveQueue.current = saveQueue.current.then(async () => {
      try {
        const response = await fetch("/api/admin/store", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ store: snapshot, removedPaymentIds, changedPaymentIds }),
        });
        const data = (await response.json().catch(() => null)) as { ok?: boolean; store?: AdminStore } | null;
        if (!response.ok || !data?.ok || !data.store) {
          setNotice("Could not save.");
          return;
        }
        if (storeRef.current === snapshot) {
          storeRef.current = data.store;
          setStore(data.store);
        }
        if (options?.quiet) return;
        setNotice("Saved.");
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setNotice(""), 2400);
      } catch {
        setNotice("Could not save.");
      }
    });
  }, []);

  const logout = useCallback(() => {
    logoutAdmin();
    void fetch("/api/admin/session", { method: "DELETE" }).finally(() => {
      setSession(null);
    });
  }, []);

  const onReady = useCallback((next: AdminSession) => {
    setCredentialExists(true);
    setSession(next);
  }, []);

  const value = useMemo<AdminContextValue | null>(() => {
    if (!store || !session) return null;
    return { store, admin: session, notice, update, logout };
  }, [store, session, notice, update, logout]);

  if (!ready || (session && !store && !loadError)) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center bg-navy text-white">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/70">Admin portal</p>
      </div>
    );
  }

  if (session && loadError) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center bg-navy px-6 text-center text-white">
        <p className="max-w-sm text-sm leading-6 text-white/80">{loadError} Check that MongoDB is running, then refresh.</p>
      </div>
    );
  }

  if (!session || !value) {
    return <AccessScreen mode={credentialExists ? "login" : "setup"} onReady={onReady} />;
  }

  return (
    <AdminContext.Provider value={value}>
      <AdminShell notice={notice} admin={session} onLogout={logout}>
        {children}
      </AdminShell>
    </AdminContext.Provider>
  );
}

function AccessScreen({
  mode,
  onReady,
}: {
  mode: "setup" | "login";
  onReady: (session: AdminSession) => void;
}) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          name: "Admin",
          email,
          password,
        }),
      });
      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        session?: AdminSession;
      } | null;
      if (!response.ok || !data?.ok || !data.session) {
        setError(data?.error || "Could not sign in.");
        setPending(false);
        return;
      }
      const remembered = await rememberAdminSession({
        name: data.session.name,
        email: data.session.email,
        password,
      });
      if (remembered.error || !remembered.session) {
        setError(remembered.error || "Could not sign in.");
        setPending(false);
        return;
      }
      onReady(remembered.session);
    } catch {
      setError("The admin service did not respond. Try again.");
    }
    setPending(false);
  }

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-navy px-5 py-16">
      <div className="w-full max-w-md bg-white p-6 md:p-8">
        <Image src="/images/Logo.png" alt={site.name} width={180} height={48} className="h-10 w-auto" priority />
        <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.22em] text-orange">Admin portal</p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold leading-tight text-navy">
          {mode === "setup" ? "Create admin access" : "Admin sign-in"}
        </h1>
        {mode === "login" ? (
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Use the staff email and password.
          </p>
        ) : null}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-navy">Email</span>
            <input
              name="email"
              type="email"
              required
              defaultValue={mode === "setup" ? site.email : ""}
              autoComplete="email"
              className="w-full border border-navy/10 px-3 py-2.5 text-sm outline-none focus:border-orange"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-navy">Password</span>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete={mode === "setup" ? "new-password" : "current-password"}
              className="w-full border border-navy/10 px-3 py-2.5 text-sm outline-none focus:border-orange"
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
            className="w-full bg-orange px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-orange-soft disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Please wait…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminShell({
  children,
  notice,
  admin,
  onLogout,
}: {
  children: ReactNode;
  notice: string;
  admin: AdminSession;
  onLogout: () => void;
}) {
  const pathname = usePathname();
  const { store } = useAdmin();
  const [open, setOpen] = useState(false);
  const desktop = useDesktopNav();
  const navOpen = desktop || open;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const links = [
    { href: "/admin", label: "Overview", icon: "grid", count: null },
    { href: "/admin/courses", label: "Courses", icon: "book", count: store.courses.length },
    { href: "/admin/internship", label: "Internship", icon: "briefcase", count: store.internships.length },
    { href: "/admin/news", label: "News", icon: "news", count: store.news.length },
    { href: "/admin/events", label: "Events", icon: "calendar", count: store.events.length },
    { href: "/admin/payments", label: "Payments", icon: "card", count: store.payments.length },
    { href: "/admin/members", label: "Members", icon: "users", count: store.members.length },
    { href: "/admin/mail", label: "Email", icon: "mail", count: null },
  ] as const;

  const current = links.find((link) => isCurrent(pathname, link.href));

  return (
    <div className="min-h-screen bg-sand">
      {open ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-navy/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}
      <aside
        inert={navOpen ? undefined : true}
        aria-hidden={navOpen ? undefined : true}
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-navy text-white transition-transform duration-300 lg:w-64 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Link href="/admin" className="block">
            <Image
              src="/images/Logo.png"
              alt={site.name}
              width={160}
              height={42}
              className="h-9 w-auto brightness-0 invert"
            />
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            className="px-2 py-1 text-xs font-bold uppercase tracking-[0.14em] text-white/70 lg:hidden"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
        <p className="px-5 text-[11px] font-bold uppercase tracking-[0.22em] text-orange-soft">Admin portal</p>
        <nav className="mt-4 flex-1 space-y-1 overflow-y-auto px-3">
          {links.map((link) => {
            const active = isCurrent(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium ${
                  active ? "bg-white/10 text-white" : "text-white/65 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon name={link.icon} />
                <span className="flex-1">{link.label}</span>
                {link.count !== null ? <span className="text-xs text-white/40">{link.count}</span> : null}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-4">
          <p className="truncate text-sm font-semibold">{admin.name}</p>
          <p className="truncate text-xs text-white/50">{admin.email}</p>
          <div className="mt-4 flex items-center justify-between gap-3">
            <Link href="/" className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">
              View site
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className="text-xs font-bold uppercase tracking-[0.14em] text-orange-soft"
            >
              Log out
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-navy/10 bg-white/95 px-4 py-3 backdrop-blur md:px-8">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Open menu"
              className="inline-flex h-11 w-11 items-center justify-center text-navy lg:hidden"
              onClick={() => setOpen(true)}
            >
              <span className="space-y-1.5">
                <span className="block h-0.5 w-5 bg-current" />
                <span className="block h-0.5 w-5 bg-current" />
                <span className="block h-0.5 w-5 bg-current" />
              </span>
            </button>
            <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-navy lg:hidden">
              {current?.label ?? "Admin"}
            </p>
            <p role="status" aria-live="polite" className="hidden text-sm font-medium text-blue lg:block">
              {notice || "PetroSkill Virtual Learning"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {notice ? (
              <p role="status" aria-live="polite" className="text-xs font-semibold text-blue lg:hidden">
                {notice}
              </p>
            ) : null}
            <Link href="/" className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
              View site
            </Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}

function useDesktopNav() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const sync = () => setDesktop(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return desktop;
}

function isCurrent(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Icon({ name }: { name: "grid" | "book" | "briefcase" | "news" | "calendar" | "card" | "users" | "mail" }) {
  const props = {
    viewBox: "0 0 24 24",
    className: "h-4 w-4",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (name === "grid") {
    return (
      <svg {...props}>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    );
  }
  if (name === "book") {
    return (
      <svg {...props}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    );
  }
  if (name === "briefcase") {
    return (
      <svg {...props}>
        <rect x="2" y="7" width="20" height="14" rx="1" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    );
  }
  if (name === "news") {
    return (
      <svg {...props}>
        <path d="M4 4h13v16H4z" />
        <path d="M17 8h3v12H7" />
        <path d="M7 8h7M7 12h7M7 16h4" />
      </svg>
    );
  }
  if (name === "calendar") {
    return (
      <svg {...props}>
        <rect x="3" y="4" width="18" height="18" />
        <path d="M3 10h18M8 2v4M16 2v4" />
      </svg>
    );
  }
  if (name === "card") {
    return (
      <svg {...props}>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>
    );
  }
  if (name === "mail") {
    return (
      <svg {...props}>
        <rect x="3" y="5" width="18" height="14" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 19c.6-3 2.8-4.5 6-4.5s5.4 1.5 6 4.5" />
      <circle cx="17" cy="9" r="2.2" />
      <path d="M16.5 14.6c2.2.3 3.8 1.5 4.5 4" />
    </svg>
  );
}
