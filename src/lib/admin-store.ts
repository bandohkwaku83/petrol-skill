import {
  categories,
  courses,
  events,
  internshipPostings,
  news,
  type Course,
  type InternshipPosting,
} from "@/data/content";
import { listAccounts } from "@/lib/account";
import type { PaymentProvider } from "@/lib/internship-payment";

export type NewsArticle = (typeof news)[number];

export type AdminEvent = {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  status: "upcoming" | "previous";
  description: string;
};

export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";
export type PaymentKind = "course" | "internship";

export type PaymentRecord = {
  id: string;
  name: string;
  email: string;
  kind: PaymentKind;
  program: string;
  slug: string;
  amount: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  reference: string;
  date: string;
  notes: string;
};

export type MemberStatus = "new" | "review" | "confirmed" | "waitlist";
export type MemberKind = "course" | "internship" | "event" | "account";

export type MemberRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  kind: MemberKind;
  status: MemberStatus;
  registered: string;
  notes: string;
};

export type AdminStore = {
  courses: Course[];
  internships: InternshipPosting[];
  news: NewsArticle[];
  events: AdminEvent[];
  payments: PaymentRecord[];
  members: MemberRecord[];
  suppressedEmails: string[];
};

export const paymentStatusLabel: Record<PaymentStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  failed: "Failed",
  refunded: "Refunded",
};

export const memberStatusLabel: Record<MemberStatus, string> = {
  new: "New",
  review: "In review",
  confirmed: "Confirmed",
  waitlist: "Waitlist",
};

export const memberKindLabel: Record<MemberKind, string> = {
  course: "Course",
  internship: "Internship",
  event: "Event",
  account: "Account",
};

export const paymentKindLabel: Record<PaymentKind, string> = {
  course: "Course",
  internship: "Internship",
};

export const providerLabel: Record<PaymentProvider, string> = {
  paystack: "Paystack",
  accrue: "Accrue",
};

export const eventStatusLabel = {
  upcoming: "Upcoming",
  previous: "Previous",
} as const;

export const internshipStatusLabel = {
  open: "Open",
  closed: "Closed",
} as const;

export const newsCategories = [
  "Internship Updates",
  "Course Announcements",
  "Partnership Announcements",
  "Industry News",
  "Student Success Stories",
  "Event Recaps",
  "Speaker Spotlights",
];

export const eventTypes = ["Webinar", "Workshop", "Conference"];

const STORE_KEY = "pvl-admin-store";
const STORE_VERSION = 1;

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function resolveSlug(input: {
  slug: string;
  title: string;
  existing: string[];
  current?: string;
}): { slug: string } | { error: string } {
  const slug = slugify(input.slug || input.title);
  if (!slug) return { error: "Enter a title." };
  const taken = input.existing.some((item) => item === slug && item !== input.current);
  if (taken) return { error: "That URL slug is already in use. Choose another." };
  return { slug };
}

export function normalizeFee(value: string) {
  const trimmed = value.trim();
  if (/^\d+(\.\d{1,2})?$/.test(trimmed)) return `$${trimmed}`;
  return trimmed;
}

export function feeAmount(value: string) {
  const amount = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(amount) ? amount : 0;
}

export function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function formatAdminDate(date = new Date()) {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase());
}

export function createId(prefix: string) {
  const value =
    globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${value}`;
}

export function categoryName(slug: string) {
  return categories.find((category) => category.slug === slug)?.name ?? slug;
}

export function upsert<T>(items: T[], next: T, key: (item: T) => string, currentKey = "") {
  const index = items.findIndex((item) => key(item) === (currentKey || key(next)));
  if (index === -1) return [next, ...items];
  return items.map((item, itemIndex) => (itemIndex === index ? next : item));
}

export function removeWhere<T>(items: T[], key: (item: T) => string, value: string) {
  return items.filter((item) => key(item) !== value);
}

export function blankCourse(): Course {
  return {
    slug: "",
    title: "",
    category: categories[0]?.slug ?? "reservoir-engineering",
    description: "",
    duration: "",
    delivery: "Live Online",
    startDate: "",
    time: "",
    instructor: "",
    fee: "",
    audience: "",
    image: "",
    featured: false,
    outcomes: [],
    prerequisites: [],
    faqs: [],
  };
}

export function blankInternship(): InternshipPosting {
  return {
    slug: "",
    title: "",
    status: "open",
    posted: formatAdminDate(),
    closes: "",
    starts: "",
    duration: "",
    format: "Live online",
    fee: "",
    summary: "",
    image: "/images/group-02.jpg",
    overview: "",
    objectives: [],
  };
}

export function blankNews(): NewsArticle {
  return {
    slug: "",
    title: "",
    category: "Course Announcements",
    date: formatAdminDate(),
    excerpt: "",
    image: "",
    content: "",
  };
}

export function blankEvent(): AdminEvent {
  return {
    id: "",
    title: "",
    type: "Webinar",
    date: "",
    time: "",
    status: "upcoming",
    description: "",
  };
}

export function blankPayment(): PaymentRecord {
  return {
    id: "",
    name: "",
    email: "",
    kind: "course",
    program: "",
    slug: "",
    amount: "",
    provider: "paystack",
    status: "pending",
    reference: "",
    date: formatAdminDate(),
    notes: "",
  };
}

export function blankMember(): MemberRecord {
  return {
    id: "",
    name: "",
    email: "",
    phone: "",
    program: "",
    kind: "course",
    status: "new",
    registered: formatAdminDate(),
    notes: "",
  };
}

function seedStore(): AdminStore {
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
    payments: [
      {
        id: "pay-akosua-reservoir",
        name: "Akosua Mensah",
        email: "akosua.mensah@example.com",
        kind: "course",
        program: "Reservoir Simulation Fundamentals",
        slug: "reservoir-simulation-fundamentals",
        amount: "$249",
        provider: "paystack",
        status: "paid",
        reference: "pvl-course-reservoir-simulation-fundamentals-8f3a1c02",
        date: "2 October 2026",
        notes: "Seat confirmed after Paystack.",
      },
      {
        id: "pay-amina-economics",
        name: "Amina Hassan",
        email: "amina.hassan@example.com",
        kind: "course",
        program: "Petroleum Economics & Investment Analysis",
        slug: "petroleum-economics-investment",
        amount: "$229",
        provider: "accrue",
        status: "paid",
        reference: "pvl-course-petroleum-economics-investment-19bc44e1",
        date: "21 September 2026",
        notes: "",
      },
      {
        id: "pay-grace-internship",
        name: "Grace Nkrumah",
        email: "grace.nkrumah@example.com",
        kind: "internship",
        program: "Virtual Internship — Cohort 9",
        slug: "virtual-internship-cohort-9",
        amount: "$149",
        provider: "paystack",
        status: "paid",
        reference: "pvl-internship-virtual-internship-cohort-9-77aa2104",
        date: "18 September 2026",
        notes: "Join link sent on WhatsApp.",
      },
      {
        id: "pay-yusuf-internship",
        name: "Yusuf Bello",
        email: "yusuf.bello@example.com",
        kind: "internship",
        program: "Virtual Internship — Cohort 9",
        slug: "virtual-internship-cohort-9",
        amount: "$149",
        provider: "accrue",
        status: "pending",
        reference: "pvl-internship-virtual-internship-cohort-9-c31e90ab",
        date: "4 October 2026",
        notes: "Waiting for Accrue to confirm.",
      },
      {
        id: "pay-chiamaka-ai",
        name: "Chiamaka Obi",
        email: "chiamaka.obi@example.com",
        kind: "course",
        program: "AI for Upstream Oil & Gas Operations",
        slug: "ai-for-upstream-operations",
        amount: "$299",
        provider: "paystack",
        status: "failed",
        reference: "pvl-course-ai-for-upstream-operations-55d0e812",
        date: "6 October 2026",
        notes: "Card was declined.",
      },
      {
        id: "pay-kojo-python",
        name: "Kojo Antwi",
        email: "kojo.antwi@example.com",
        kind: "course",
        program: "Python for Petroleum Engineers",
        slug: "python-for-petroleum-engineers",
        amount: "$179",
        provider: "paystack",
        status: "refunded",
        reference: "pvl-course-python-for-petroleum-engineers-90ab3310",
        date: "28 September 2026",
        notes: "Moved to the waitlist after a schedule clash.",
      },
    ],
    members: [
      {
        id: "member-akosua",
        name: "Akosua Mensah",
        email: "akosua.mensah@example.com",
        phone: "+233 24 000 1101",
        program: "Reservoir Simulation Fundamentals",
        kind: "course",
        status: "confirmed",
        registered: "2 October 2026",
        notes: "Seat confirmed. WhatsApp invite sent.",
      },
      {
        id: "member-yusuf",
        name: "Yusuf Bello",
        email: "yusuf.bello@example.com",
        phone: "+234 80 000 2202",
        program: "Virtual Internship — Cohort 9",
        kind: "internship",
        status: "review",
        registered: "4 October 2026",
        notes: "Awaiting Accrue confirmation.",
      },
      {
        id: "member-chiamaka",
        name: "Chiamaka Obi",
        email: "chiamaka.obi@example.com",
        phone: "+234 70 000 3303",
        program: "AI for Upstream Oil & Gas Operations",
        kind: "course",
        status: "new",
        registered: "6 October 2026",
        notes: "Asked for an evening cohort.",
      },
      {
        id: "member-kojo",
        name: "Kojo Antwi",
        email: "kojo.antwi@example.com",
        phone: "+233 20 000 4404",
        program: "Python for Petroleum Engineers",
        kind: "course",
        status: "waitlist",
        registered: "28 September 2026",
        notes: "Refunded and placed on the next intake list.",
      },
      {
        id: "member-amina",
        name: "Amina Hassan",
        email: "amina.hassan@example.com",
        phone: "+254 70 000 5505",
        program: "Petroleum Economics & Investment Analysis",
        kind: "course",
        status: "confirmed",
        registered: "21 September 2026",
        notes: "",
      },
      {
        id: "member-samuel",
        name: "Samuel Tetteh",
        email: "samuel.tetteh@example.com",
        phone: "+233 55 000 6606",
        program: "Careers in Energy: Live Q&A",
        kind: "event",
        status: "new",
        registered: "8 October 2026",
        notes: "Registered for the careers webinar.",
      },
      {
        id: "member-grace",
        name: "Grace Nkrumah",
        email: "grace.nkrumah@example.com",
        phone: "+233 27 000 7707",
        program: "Virtual Internship — Cohort 9",
        kind: "internship",
        status: "confirmed",
        registered: "18 September 2026",
        notes: "Paid and added to the cohort group.",
      },
      {
        id: "member-omar",
        name: "Omar Diallo",
        email: "omar.diallo@example.com",
        phone: "+221 77 000 8808",
        program: "Energy Data Analytics Essentials",
        kind: "course",
        status: "review",
        registered: "30 September 2026",
        notes: "Payment instructions still to send.",
      },
    ],
    suppressedEmails: [],
  };
}

function isStore(value: unknown): value is AdminStore {
  if (!value || typeof value !== "object") return false;
  const store = value as AdminStore;
  return (
    Array.isArray(store.courses) &&
    Array.isArray(store.internships) &&
    Array.isArray(store.news) &&
    Array.isArray(store.events) &&
    Array.isArray(store.payments) &&
    Array.isArray(store.members) &&
    Array.isArray(store.suppressedEmails)
  );
}

function readPersisted(): AdminStore | null {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { version?: number; data?: unknown };
    if (parsed.version !== STORE_VERSION || !isStore(parsed.data)) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

export function saveAdminStore(store: AdminStore) {
  localStorage.setItem(STORE_KEY, JSON.stringify({ version: STORE_VERSION, data: store }));
}

function mergeAccounts(store: AdminStore): AdminStore {
  const known = new Set(store.members.map((member) => member.email.toLowerCase()));
  const suppressed = new Set(store.suppressedEmails.map((email) => email.toLowerCase()));
  const additions: MemberRecord[] = [];

  for (const account of listAccounts()) {
    const email = account.email.toLowerCase();
    if (known.has(email) || suppressed.has(email)) continue;
    additions.push({
      id: `account-${email}`,
      name: account.name,
      email,
      phone: "",
      program: "Site account",
      kind: "account",
      status: "new",
      registered: formatAdminDate(),
      notes: "Signed up on the enroll page.",
    });
  }

  if (additions.length === 0) return store;
  return { ...store, members: [...additions, ...store.members] };
}

export function loadAdminStore(): AdminStore {
  if (typeof window === "undefined") return seedStore();
  try {
    const stored = readPersisted();
    const base = stored ?? seedStore();
    const merged = mergeAccounts(base);
    if (!stored || merged !== base) saveAdminStore(merged);
    return merged;
  } catch {
    const seeded = seedStore();
    try {
      saveAdminStore(seeded);
    } catch {
      return seeded;
    }
    return seeded;
  }
}
