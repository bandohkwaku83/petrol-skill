"use client";

import { useEffect, useState } from "react";
import { PaymentDialog } from "@/components/PaymentDialog";
import type { InternshipPosting } from "@/data/content";

type Provider = "paystack" | "accrue";

export function InternshipBoard({ postings }: { postings: InternshipPosting[] }) {
  const [active, setActive] = useState<InternshipPosting | null>(null);
  const [returnTo, setReturnTo] = useState<{
    slug: string;
    provider: Provider;
    reference: string;
  } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") !== "1" || params.get("kind") !== "internship") return;
    const provider = params.get("provider");
    const reference = params.get("reference") || params.get("trxref") || "";
    const slug = params.get("slug") || "";
    if ((provider !== "paystack" && provider !== "accrue") || !reference || !slug) return;
    const posting = postings.find((item) => item.slug === slug);
    if (!posting) return;
    setActive(posting);
    setReturnTo({ slug, provider, reference });
  }, [postings]);

  return (
    <>
      <div className="mt-12 space-y-4">
        {postings.map((posting) => (
          <PostingCard key={posting.slug} posting={posting} onOpen={() => setActive(posting)} />
        ))}
      </div>
      {active ? (
        <PaymentDialog
          kind="internship"
          slug={active.slug}
          title={active.title}
          fee={active.fee}
          eyebrow="Internship payment"
          joinLabel="Join the internship"
          returnTo={returnTo?.slug === active.slug ? returnTo : null}
          onClose={() => setActive(null)}
        />
      ) : null}
    </>
  );
}

function PostingCard({
  posting,
  onOpen,
}: {
  posting: InternshipPosting;
  onOpen: () => void;
}) {
  const facts = [
    ["Starts", posting.starts],
    ["Apply by", posting.closes],
    ["Length", posting.duration],
    ["Format", posting.format],
  ];

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group grid w-full overflow-hidden border border-navy/10 bg-white text-left transition hover:border-orange/50 lg:grid-cols-[1fr_260px]"
    >
      <div className="p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-orange px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white">
            Open
          </span>
          <span className="text-xs text-muted">Posted {posting.posted}</span>
        </div>
        <h3 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-semibold text-navy group-hover:text-blue md:text-3xl">
          {posting.title}
        </h3>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
          {posting.summary}
        </p>
        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-orange">
                {label}
              </dt>
              <dd className="mt-1 text-sm font-medium text-navy">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="flex flex-col justify-between bg-navy p-6 text-white md:p-8">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-soft">Fee</p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-4xl font-semibold">
            {posting.fee}
          </p>
          <p className="mt-3 text-sm text-white/65">per participant</p>
        </div>
        <span className="mt-8 inline-flex items-center text-xs font-bold uppercase tracking-[0.16em] text-orange-soft">
          Pay to join →
        </span>
      </div>
    </button>
  );
}
