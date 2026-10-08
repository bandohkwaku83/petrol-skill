export type AdminSession = {
  name: string;
  email: string;
};

const CREDENTIAL_KEY = "pvl-admin-credential";
const SESSION_KEY = "pvl-admin-session";

type Credential = AdminSession & { passwordHash: string };

async function hashPassword(email: string, password: string) {
  const data = new TextEncoder().encode(`pvl-admin:${email}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function readCredential(): Credential | null {
  try {
    const raw = localStorage.getItem(CREDENTIAL_KEY);
    return raw ? (JSON.parse(raw) as Credential) : null;
  } catch {
    return null;
  }
}

export function hasAdminCredential() {
  return readCredential() !== null;
}

export function readAdminSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AdminSession;
    const credential = readCredential();
    if (!credential || credential.email !== session.email) return null;
    return session;
  } catch {
    return null;
  }
}

export async function createAdminAccess(input: { name: string; email: string; password: string }) {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  if (name.length < 2) return { error: "Enter your name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email address." };
  if (input.password.length < 8) return { error: "Use at least 8 characters." };
  if (hasAdminCredential()) return { error: "Admin access is already set up in this browser." };

  const credential: Credential = {
    name,
    email,
    passwordHash: await hashPassword(email, input.password),
  };
  const session = { name, email };
  try {
    localStorage.setItem(CREDENTIAL_KEY, JSON.stringify(credential));
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    return { error: "This browser could not save the admin sign-in." };
  }
  return { session };
}

export async function loginAdmin(input: { email: string; password: string }) {
  const email = input.email.trim().toLowerCase();
  const credential = readCredential();
  if (
    !credential ||
    credential.email !== email ||
    credential.passwordHash !== (await hashPassword(email, input.password))
  ) {
    return { error: "Check the email and password, then try again." };
  }
  const session = { name: credential.name, email: credential.email };
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    return { error: "This browser could not save the admin sign-in." };
  }
  return { session };
}

export function logoutAdmin() {
  localStorage.removeItem(SESSION_KEY);
}
