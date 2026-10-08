"use client";

import Link from "next/link";
import { useAdmin } from "@/components/admin/AdminProvider";
import { Badge } from "@/components/admin/ui";
import {
  feeAmount,
  formatMoney,
  memberStatusLabel,
  paymentStatusLabel,
  type PaymentStatus,
} from "@/lib/admin-store";

export default function AdminHomePage() {
  const { store } = useAdmin();
  const collected = store.payments
    .filter((payment) => payment.status === "paid")
    .reduce((sum, payment) => sum + feeAmount(payment.amount), 0);
  const pending = store.payments.filter((payment) => payment.status === "pending").length;
  const waiting = store.members.filter((member) => member.status === "new" || member.status === "review").length;
  const openInternships = store.internships.filter((posting) => posting.status === "open").length;
  const featured = store.courses.filter((course) => course.featured).length;
  const upcoming = store.events.filter((event) => event.status === "upcoming").length;

  const cards = [
    { href: "/admin/courses", label: "Courses", value: String(store.courses.length), detail: `${featured} featured` },
    {
      href: "/admin/internship",
      label: "Internship",
      value: String(store.internships.length),
      detail: `${openInternships} open`,
    },
    { href: "/admin/news", label: "News", value: String(store.news.length), detail: "Stories and announcements" },
    { href: "/admin/events", label: "Events", value: String(store.events.length), detail: `${upcoming} upcoming` },
    {
      href: "/admin/payments",
      label: "Collected",
      value: formatMoney(collected),
      detail: `${pending} pending`,
    },
    { href: "/admin/members", label: "Members", value: String(store.members.length), detail: `${waiting} waiting` },
  ];

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-navy md:text-4xl">
        Admin portal
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        Manage courses, internships, news, events, payments, and registered members. Sample payments and
        registrations are included. Updates stay on this device.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="border border-navy/10 bg-white p-5 transition hover:border-orange/50"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange">{card.label}</p>
            <p className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-navy">
              {card.value}
            </p>
            <p className="mt-2 text-sm text-muted">{card.detail}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="border border-navy/10 bg-white">
          <div className="flex items-center justify-between border-b border-navy/8 px-5 py-4">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-navy">Recent payments</h2>
            <Link href="/admin/payments" className="text-xs font-bold uppercase tracking-[0.14em] text-orange">
              Open
            </Link>
          </div>
          <ul className="divide-y divide-navy/8 px-5">
            {store.payments.slice(0, 5).map((payment) => (
              <li key={payment.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-navy">{payment.name}</p>
                  <p className="truncate text-xs text-muted">{payment.program}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-semibold text-navy">{payment.amount}</p>
                  <span className="mt-1 inline-flex">
                    <Badge tone={paymentTone(payment.status)}>{paymentStatusLabel[payment.status]}</Badge>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="border border-navy/10 bg-white">
          <div className="flex items-center justify-between border-b border-navy/8 px-5 py-4">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-navy">
              Latest registrations
            </h2>
            <Link href="/admin/members" className="text-xs font-bold uppercase tracking-[0.14em] text-orange">
              Open
            </Link>
          </div>
          <ul className="divide-y divide-navy/8 px-5">
            {store.members.slice(0, 5).map((member) => (
              <li key={member.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-navy">{member.name}</p>
                  <p className="truncate text-xs text-muted">{member.program}</p>
                </div>
                <Badge tone={memberTone(member.status)}>{memberStatusLabel[member.status]}</Badge>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function paymentTone(status: PaymentStatus) {
  if (status === "paid") return "navy" as const;
  if (status === "pending") return "orange" as const;
  if (status === "failed") return "alert" as const;
  return "sand" as const;
}

function memberTone(status: keyof typeof memberStatusLabel) {
  if (status === "confirmed") return "navy" as const;
  if (status === "review") return "blue" as const;
  if (status === "new") return "orange" as const;
  return "sand" as const;
}
