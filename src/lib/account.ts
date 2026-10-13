export type AccountSession = {
  name: string;
  email: string;
};

const ACCOUNTS_KEY = "pvl-accounts";
const SESSION_KEY = "pvl-session";
export const ACCOUNT_EVENT = "pvl-account";

type StoredAccount = AccountSession & { passwordHash: string };

function readAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? (JSON.parse(raw) as StoredAccount[]) : [];
  } catch {
    return [];
  }
}

export function listAccounts(): AccountSession[] {
  return readAccounts().map(({ name, email }) => ({ name, email }));
}

function publish(session: AccountSession | null) {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event(ACCOUNT_EVENT));
}

export function getSession(): AccountSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AccountSession) : null;
  } catch {
    return null;
  }
}

export async function createAccount(input: { name: string; email: string; password: string }) {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  if (name.length < 2) return { error: "Enter your full name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email address." };
  if (input.password.length < 8) return { error: "Use at least 8 characters for your password." };

  try {
    const response = await fetch("/api/account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "create", name, email, password: input.password }),
    });
    const data = (await response.json().catch(() => null)) as {
      ok?: boolean;
      error?: string;
      session?: AccountSession;
    } | null;
    if (!response.ok || !data?.ok || !data.session) {
      return { error: data?.error || "Could not create the account." };
    }
    publish(data.session);
    return { session: data.session };
  } catch {
    return { error: "The account service did not respond. Try again." };
  }
}

export async function login(input: { email: string; password: string }) {
  const email = input.email.trim().toLowerCase();
  try {
    const response = await fetch("/api/account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "login", email, password: input.password }),
    });
    const data = (await response.json().catch(() => null)) as {
      ok?: boolean;
      error?: string;
      session?: AccountSession;
    } | null;
    if (!response.ok || !data?.ok || !data.session) {
      return { error: data?.error || "Email or password is incorrect." };
    }
    publish(data.session);
    return { session: data.session };
  } catch {
    return { error: "The account service did not respond. Try again." };
  }
}

export async function refreshSession() {
  try {
    const response = await fetch("/api/account");
    const data = (await response.json().catch(() => null)) as { ok?: boolean; session?: AccountSession } | null;
    if (response.ok && data?.ok && data.session) {
      publish(data.session);
      return data.session;
    }
    if (response.status === 401) publish(null);
    return null;
  } catch {
    return getSession();
  }
}

export function logout() {
  publish(null);
  void fetch("/api/account", { method: "DELETE" });
}
