export type AccountSession = {
  name: string;
  email: string;
};

const ACCOUNTS_KEY = "pvl-accounts";
const SESSION_KEY = "pvl-session";
export const ACCOUNT_EVENT = "pvl-account";

type StoredAccount = AccountSession & { passwordHash: string };

async function hashPassword(email: string, password: string) {
  const data = new TextEncoder().encode(`${email}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

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

  const accounts = readAccounts();
  if (accounts.some((account) => account.email === email)) {
    return { error: "An account with this email already exists. Log in instead." };
  }

  accounts.push({ name, email, passwordHash: await hashPassword(email, input.password) });
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  const session = { name, email };
  publish(session);
  return { session };
}

export async function login(input: { email: string; password: string }) {
  const email = input.email.trim().toLowerCase();
  const account = readAccounts().find((item) => item.email === email);
  if (!account || account.passwordHash !== (await hashPassword(email, input.password))) {
    return { error: "Email or password is incorrect." };
  }
  const session = { name: account.name, email: account.email };
  publish(session);
  return { session };
}

export function logout() {
  publish(null);
}
