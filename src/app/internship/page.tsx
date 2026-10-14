import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Magnetic, Reveal } from "@/components/motion";
import { getPublishedOrEmpty } from "@/lib/site-db";
import { InternshipBoard } from "./InternshipBoard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Internship openings",
  description:
    "Internships are posted on this board only when a cohort is open for applications.",
};

export default async function InternshipPage() {
  const postings = (await getPublishedOrEmpty()).internships;
  const openPostings = postings.filter((posting) => posting.status === "open");
  const closedPostings = postings.filter((posting) => posting.status === "closed");
  const openCount = openPostings.length;

  return (
    <>
      <PageHero
        title="Internships are posted here when a cohort opens"
        description="This page is a board. An open internship card asks for your country, then takes payment. After payment, the join link appears. Between cohorts, the board stays clear."
        image="/images/flagship-session.jpg"
        actions={
          <>
            <Magnetic>
              <Button href="#board" variant="orange">
                {openCount === 0 ? "Check the board" : "See what’s posted"}
              </Button>
            </Magnetic>
            <Magnetic>
              <Button href="/waitlist" variant="secondary">
                Join waitlist
              </Button>
            </Magnetic>
          </>
        }
      />

      <section className="border-b border-navy/8 bg-sand">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:grid-cols-3 md:px-8">
          <StatusFact
            label="Open now"
            value={openCount === 0 ? "None" : String(openCount).padStart(2, "0")}
          />
          <StatusFact
            label="Last posted"
            value={postings.find((posting) => posting.posted)?.posted ?? "—"}
          />
          <StatusFact label="Between intakes" value="Board stays empty" />
        </div>
      </section>

      <section id="board" className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <SectionHeading
              eyebrow="Board"
              title={openCount === 0 ? "Nothing is posted" : "Open for applications"}
              description={
                openCount === 0
                  ? "New internships show up in this list when PetroSkill is taking applications. Until then, join the waitlist and we will write when the next one is up."
                  : "Tap an open card, choose your country, and pay. The join link appears after the payment is confirmed."
              }
            />
          </Reveal>

          {openCount === 0 ? (
            <Reveal className="mt-12">
              <div className="border border-navy/10 bg-sand px-6 py-14 md:px-12 md:py-20">
                <p className="font-[family-name:var(--font-display)] text-6xl font-semibold text-navy/15 md:text-7xl">
                  00
                </p>
                <h3 className="mt-4 max-w-xl font-[family-name:var(--font-display)] text-3xl font-semibold leading-tight text-navy md:text-5xl">
                  No internship is posted right now
                </h3>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted md:text-base">
                  When a cohort opens, its card is added here. Tap it to pay, then use the
                  join link. Closed intakes move to the archive below.
                </p>
                <div className="mt-8">
                  <Magnetic>
                    <Button href="/waitlist" variant="orange">
                      Join the waitlist
                    </Button>
                  </Magnetic>
                </div>
              </div>
            </Reveal>
          ) : (
            <InternshipBoard postings={openPostings} />
          )}

          {closedPostings.length > 0 ? (
            <div className="mt-16">
              <Reveal>
                <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-navy">
                  Previously posted
                </h3>
                <p className="mt-2 max-w-xl text-sm text-muted">
                  These intakes have closed. They stay here as a record, not as something
                  you can join.
                </p>
              </Reveal>
              <ul className="mt-6 divide-y divide-navy/10 border-y border-navy/10">
                {closedPostings.map((posting) => (
                  <li
                    key={posting.slug}
                    className="grid gap-3 py-5 sm:grid-cols-[140px_1fr] sm:items-center sm:gap-6"
                  >
                    <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
                      Closed
                    </span>
                    <span>
                      <span className="block font-[family-name:var(--font-display)] text-lg font-semibold text-navy">
                        {posting.title}
                      </span>
                      <span className="mt-1 block text-sm text-muted">
                        Posted {posting.posted} · Started {posting.starts}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}

function StatusFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange">{label}</p>
      <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-navy">
        {value}
      </p>
    </div>
  );
}

