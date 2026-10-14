import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import {
  courses,
  events,
  internshipPostings,
  news,
  type Course,
  type InternshipPosting,
} from "@/data/content";
import type {
  AdminEvent,
  AdminStore,
  MemberRecord,
  NewsArticle,
  PaymentRecord,
  PaymentStatus,
} from "@/lib/admin-store";
import { database } from "@/lib/mongo";
import type { PublicWaitlistEntry } from "@/lib/waitlist";

const scrypt = promisify(scryptCallback);
const SESSION_MS = 1000 * 60 * 60 * 24 * 14;

type AdminCredential = {
  name: string;
  email: string;
  passwordHash: string;
};

type StoreDoc = {
  _id: "store";
  courses: Course[];
  internships: InternshipPosting[];
  news: NewsArticle[];
  events: AdminEvent[];
  members: MemberRecord[];
  suppressedEmails: string[];
};

export type PublishedCatalog = {
  courses: Course[];
  internships: InternshipPosting[];
  news: NewsArticle[];
  events: AdminEvent[];
};

let ready: Promise<void> | null = null;

function contentSeed(): Omit<StoreDoc, "_id" | "members" | "suppressedEmails"> {
  return {
    courses: structuredClone(courses),
    internships: structuredClone(internshipPostings),
    news: structuredClone(news),
    events: events.map((event, index) => ({
      id: `event-${index + 1}`,
      title: event.title,
      type: event.type,
      date: event.date,
      time: event.time,
      status: event.status,
      description: event.description,
    })),
  };
}

function dated(date = new Date()) {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

async function checkPassword(password: string, stored: string) {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  const expected = Buffer.from(key, "hex");
  if (expected.length !== derived.length) return false;
  return timingSafeEqual(expected, derived);
}

async function collections() {
  const db = await database();
  return {
    site: db.collection<StoreDoc>("site"),
    payments: db.collection<PaymentRecord & { _id: string }>("payments"),
    admins: db.collection<AdminCredential & { _id: "admin" }>("admins"),
    sessions: db.collection<{ _id: string; email: string; expiresAt: number }>("sessions"),
    waitlist: db.collection<PublicWaitlistEntry & { _id: string }>("waitlist"),
    accounts: db.collection<{ _id: string; name: string; passwordHash: string }>("accounts"),
    userSessions: db.collection<{ _id: string; email: string; expiresAt: number }>("userSessions"),
  };
}

async function migrateFile(cols: Awaited<ReturnType<typeof collections>>) {
  try {
    const raw = await readFile(path.join(process.cwd(), "data", "pvl-backend.json"), "utf8");
    const parsed = JSON.parse(raw) as {
      admin?: AdminCredential | null;
      waitlist?: PublicWaitlistEntry[];
    };
    if (parsed.admin?.email && !(await cols.admins.findOne({ _id: "admin" }))) {
      await cols.admins.insertOne({ _id: "admin", ...parsed.admin });
    }
    if (Array.isArray(parsed.waitlist)) {
      for (const entry of parsed.waitlist) {
        if (!entry?.email || !entry.id) continue;
        await cols.waitlist.updateOne(
          { _id: entry.id },
          { $setOnInsert: { _id: entry.id, id: entry.id, name: entry.name, email: entry.email, createdAt: entry.createdAt } },
          { upsert: true },
        );
      }
    }
  } catch {
    // No previous file store to import.
  }
}

async function ensureReady() {
  if (!ready) {
    ready = (async () => {
      const cols = await collections();
      const existing = await cols.site.findOne({ _id: "store" });
      if (!existing) {
        await cols.site.insertOne({
          _id: "store",
          ...contentSeed(),
          members: [],
          suppressedEmails: [],
        });
      }
      await migrateFile(cols);
      await cols.payments.createIndex({ reference: 1 }, { unique: true });
    })().catch((error) => {
      ready = null;
      throw error;
    });
  }
  await ready;
}

function withoutId<T extends { _id?: unknown }>(doc: T) {
  const { _id: ignored, ...rest } = doc;
  void ignored;
  return rest;
}

async function listPayments() {
  const cols = await collections();
  const docs = await cols.payments.find({}).sort({ date: -1 }).toArray();
  return docs.map((doc) => withoutId(doc) as PaymentRecord);
}

async function memberFromAccount(account: { _id: string; name: string }, members: MemberRecord[]) {
  const email = account._id.toLowerCase();
  if (members.some((member) => member.email.toLowerCase() === email)) return null;
  return {
    id: `account-${email}`,
    name: account.name,
    email,
    phone: "",
    program: "Site account",
    kind: "account" as const,
    status: "new" as const,
    registered: dated(),
    notes: "Signed up on the enroll page.",
  };
}

async function readStoreDoc(): Promise<AdminStore> {
  await ensureReady();
  const cols = await collections();
  const doc = await cols.site.findOne({ _id: "store" });
  if (!doc) throw new Error("The website store is missing.");
  const accounts = await cols.accounts.find({}).toArray();
  const members = [...doc.members];
  for (const account of accounts) {
    const addition = await memberFromAccount(account, members);
    if (addition) members.unshift(addition);
  }
  const waitlist = await cols.waitlist.find({}).sort({ createdAt: -1 }).toArray();
  for (const entry of waitlist) {
    const email = entry.email.toLowerCase();
    if (members.some((member) => member.email.toLowerCase() === email)) continue;
    if (doc.suppressedEmails.some((item) => item.toLowerCase() === email)) continue;
    members.unshift({
      id: entry.id,
      name: entry.name,
      email,
      phone: "",
      program: "Public waitlist",
      kind: "waitlist",
      status: "waitlist",
      registered: dated(new Date(entry.createdAt)),
      notes: "Joined the waitlist on the site.",
    });
  }
  return {
    courses: doc.courses,
    internships: doc.internships,
    news: doc.news,
    events: doc.events,
    members,
    suppressedEmails: doc.suppressedEmails,
    payments: await listPayments(),
  };
}

export async function getPublished(): Promise<PublishedCatalog> {
  const store = await readStoreDoc();
  return {
    courses: store.courses,
    internships: store.internships,
    news: store.news,
    events: store.events,
  };
}

const emptyCatalog: PublishedCatalog = {
  courses: [],
  internships: [],
  news: [],
  events: [],
};

export async function getPublishedOrEmpty(): Promise<PublishedCatalog> {
  try {
    return await getPublished();
  } catch {
    return emptyCatalog;
  }
}

export async function readAdminStore() {
  return readStoreDoc();
}

export async function saveAdminStore(
  store: AdminStore,
  removedPaymentIds: string[] = [],
  changedPaymentIds: string[] = [],
) {
  await ensureReady();
  const cols = await collections();
  await cols.site.updateOne(
    { _id: "store" },
    {
      $set: {
        courses: store.courses,
        internships: store.internships,
        news: store.news,
        events: store.events,
        members: store.members,
        suppressedEmails: store.suppressedEmails,
      },
    },
  );
  if (removedPaymentIds.length > 0) {
    await cols.payments.deleteMany({ _id: { $in: removedPaymentIds } });
  }
  const changed = new Set(changedPaymentIds);
  for (const payment of store.payments) {
    if (!changed.has(payment.id)) continue;
    await cols.payments.updateOne(
      { _id: payment.id },
      { $set: { status: payment.status, notes: payment.notes } },
    );
  }
  return readStoreDoc();
}

export async function recordPaymentAttempt(payment: PaymentRecord) {
  await ensureReady();
  const cols = await collections();
  try {
    await cols.payments.insertOne({ ...payment, _id: payment.id });
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? error.code : undefined;
    if (code !== 11000) throw error;
  }
  const email = payment.email.toLowerCase();
  const store = await cols.site.findOne({ _id: "store" });
  if (!store) return;
  const existing = store.members.find((member) => member.email.toLowerCase() === email);
  const nextMember: MemberRecord = existing
    ? {
        ...existing,
        name: payment.name,
        program: payment.program,
        kind: payment.kind,
        status: existing.status === "confirmed" ? "confirmed" : "review",
        notes: existing.notes || "Started checkout on the site.",
      }
    : {
        id: `payer-${email}`,
        name: payment.name,
        email,
        phone: "",
        program: payment.program,
        kind: payment.kind,
        status: "review",
        registered: payment.date,
        notes: "Started checkout on the site.",
      };
  const members = existing
    ? store.members.map((member) => (member.email.toLowerCase() === email ? nextMember : member))
    : [nextMember, ...store.members];
  await cols.site.updateOne({ _id: "store" }, { $set: { members } });
}

export async function markPayment(reference: string, status: PaymentStatus, notes?: string) {
  await ensureReady();
  const cols = await collections();
  const payment = await cols.payments.findOne({ reference });
  if (!payment) return;
  await cols.payments.updateOne(
    { reference },
    { $set: { status, ...(notes ? { notes } : {}) } },
  );
  if (status !== "paid") return;
  const store = await cols.site.findOne({ _id: "store" });
  if (!store) return;
  const email = payment.email.toLowerCase();
  const members = store.members.map((member) =>
    member.email.toLowerCase() === email ? { ...member, status: "confirmed" as const, program: payment.program } : member,
  );
  await cols.site.updateOne({ _id: "store" }, { $set: { members } });
}

export async function adminStatus() {
  await ensureReady();
  const cols = await collections();
  const admin = await cols.admins.findOne({ _id: "admin" });
  return { configured: admin !== null };
}

export async function createAdminAccount(input: { name: string; email: string; password: string }) {
  await ensureReady();
  const cols = await collections();
  const existing = await cols.admins.findOne({ _id: "admin" });
  if (existing) return { error: "Admin access is already set up." as const };
  const admin = {
    _id: "admin" as const,
    name: input.name,
    email: input.email,
    passwordHash: await hashPassword(input.password),
  };
  await cols.admins.insertOne(admin);
  const token = randomBytes(32).toString("hex");
  await cols.sessions.insertOne({ _id: token, email: input.email, expiresAt: Date.now() + SESSION_MS });
  return { session: { name: input.name, email: input.email }, token };
}

export async function loginAdminAccount(input: { email: string; password: string }) {
  await ensureReady();
  const cols = await collections();
  const admin = await cols.admins.findOne({ _id: "admin" });
  if (!admin) return { error: "Create admin access first." as const };
  const matches = admin.email === input.email && (await checkPassword(input.password, admin.passwordHash));
  if (!matches) return { error: "Check the email and password, then try again." as const };
  const token = randomBytes(32).toString("hex");
  await cols.sessions.insertOne({ _id: token, email: admin.email, expiresAt: Date.now() + SESSION_MS });
  return { session: { name: admin.name, email: admin.email }, token };
}

export async function readAdminAccount(token: string | undefined) {
  if (!token) return null;
  await ensureReady();
  const cols = await collections();
  const session = await cols.sessions.findOne({ _id: token });
  if (!session || session.expiresAt <= Date.now()) return null;
  const admin = await cols.admins.findOne({ _id: "admin" });
  if (!admin || admin.email !== session.email) return null;
  return { name: admin.name, email: admin.email };
}

export async function endAdminSession(token: string | undefined) {
  if (!token) return;
  await ensureReady();
  const cols = await collections();
  await cols.sessions.deleteOne({ _id: token });
}

export async function joinWaitlist(input: { name: string; email: string }) {
  await ensureReady();
  const cols = await collections();
  const existing = await cols.waitlist.findOne({ email: input.email });
  if (existing) return;
  const entry: PublicWaitlistEntry = {
    id: `waitlist-${randomBytes(8).toString("hex")}`,
    name: input.name,
    email: input.email,
    createdAt: new Date().toISOString(),
  };
  await cols.waitlist.insertOne({ ...entry, _id: entry.id });
  const store = await cols.site.findOne({ _id: "store" });
  if (!store) return;
  if (store.members.some((member) => member.email.toLowerCase() === input.email)) return;
  const member: MemberRecord = {
    id: entry.id,
    name: input.name,
    email: input.email,
    phone: "",
    program: "Public waitlist",
    kind: "waitlist",
    status: "waitlist",
    registered: dated(),
    notes: "Joined the waitlist on the site.",
  };
  await cols.site.updateOne(
    { _id: "store" },
    {
      $set: {
        members: [member, ...store.members],
        suppressedEmails: store.suppressedEmails.filter((email) => email.toLowerCase() !== input.email),
      },
    },
  );
}

export async function listWaitlist() {
  await ensureReady();
  const cols = await collections();
  const docs = await cols.waitlist.find({}).sort({ createdAt: -1 }).toArray();
  return docs.map((doc) => ({
    id: doc.id,
    name: doc.name,
    email: doc.email,
    createdAt: doc.createdAt,
  }));
}

export async function removeWaitlist(id: string) {
  await ensureReady();
  const cols = await collections();
  const result = await cols.waitlist.deleteOne({ _id: id });
  return result.deletedCount > 0;
}

export async function createUserAccount(input: { name: string; email: string; password: string }) {
  await ensureReady();
  const cols = await collections();
  const existing = await cols.accounts.findOne({ _id: input.email });
  if (existing) return { error: "An account with this email already exists. Log in instead." as const };
  await cols.accounts.insertOne({
    _id: input.email,
    name: input.name,
    passwordHash: await hashPassword(input.password),
  });
  const store = await cols.site.findOne({ _id: "store" });
  if (store && !store.members.some((member) => member.email.toLowerCase() === input.email)) {
    const member: MemberRecord = {
      id: `account-${input.email}`,
      name: input.name,
      email: input.email,
      phone: "",
      program: "Site account",
      kind: "account",
      status: "new",
      registered: dated(),
      notes: "Signed up on the enroll page.",
    };
    await cols.site.updateOne({ _id: "store" }, { $set: { members: [member, ...store.members] } });
  }
  return { session: { name: input.name, email: input.email } };
}

export async function loginUserAccount(input: { email: string; password: string }) {
  await ensureReady();
  const cols = await collections();
  const account = await cols.accounts.findOne({ _id: input.email });
  if (!account || !(await checkPassword(input.password, account.passwordHash))) {
    return { error: "Email or password is incorrect." as const };
  }
  return { session: { name: account.name, email: account._id } };
}

export async function openUserSession(account: { name: string; email: string }) {
  await ensureReady();
  const cols = await collections();
  const token = randomBytes(32).toString("hex");
  await cols.userSessions.insertOne({
    _id: token,
    email: account.email,
    expiresAt: Date.now() + SESSION_MS,
  });
  return token;
}

export async function readUserSession(token: string | undefined) {
  if (!token) return null;
  await ensureReady();
  const cols = await collections();
  const session = await cols.userSessions.findOne({ _id: token });
  if (!session || session.expiresAt <= Date.now()) return null;
  const account = await cols.accounts.findOne({ _id: session.email });
  if (!account) return null;
  return { name: account.name, email: account._id };
}

export async function endUserSession(token: string | undefined) {
  if (!token) return;
  await ensureReady();
  const cols = await collections();
  await cols.userSessions.deleteOne({ _id: token });
}

export async function readPaymentEmail(reference: string) {
  await ensureReady();
  const cols = await collections();
  const payment = await cols.payments.findOne({ reference }, { projection: { email: 1 } });
  return payment?.email.toLowerCase() ?? null;
}
