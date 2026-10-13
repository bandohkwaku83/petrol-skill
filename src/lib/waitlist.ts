export type PublicWaitlistEntry = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export function cleanWaitlistInput(input: { name: unknown; email: unknown }) {
  const name = typeof input.name === "string" ? input.name.trim().replace(/\s+/g, " ") : "";
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";

  if (name.length < 2) return { error: "Enter your full name." };
  if (name.length > 80) return { error: "Enter a shorter name." };
  if (email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Enter a valid email address." };
  }

  return { name, email };
}
