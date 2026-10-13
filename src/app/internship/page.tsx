import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Magnetic, Reveal } from "@/components/motion";
import { internshipPostings } from "@/data/content";
import { getPublished } from "@/lib/site-db";
import { InternshipBoard } from "./InternshipBoard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Internship openings",
  description:
    "Internships are posted on this board only when a cohort is open for applications.",
};

export default async function InternshipPage() {
  let postings = internshipPostings;
  try {
    postings = (await getPublished()).internships;
  } catch {
    postings = internshipPostings;
  }
  const openPostings = postings.filter((posting) => posting.status === "open");
  const closedPostings = postings.filter((posting) => posting.status === "closed");
  const openCount = openPostings.length;

  return (
    <>
      <PageHero
        title="Internships are posted here when a cohort opens"
        description="This page is a board. An open internship card takes payment with Paystack or Accrue. After payment, the join link appears. Between cohorts, the board stays clear."
        image="/images/group-02.jpg"
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
            value={internshipPostings[0]?.posted ?? "—"}
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
                  : "Tap an open card to pay with Paystack or Accrue. The join link appears after the payment is confirmed."
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

      <section className="bg-sand">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <SectionHeading
              eyebrow="How this page works"
              title="Posted when needed, taken down when it closes"
            />
          </Reveal>
          <ol className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "We post it here",
                detail:
                  "An internship appears on this board only when applications for that cohort are open.",
              },
              {
                title: "You pay from the card",
                detail:
                  "Tap the open card and pay with Paystack or Accrue. After payment is confirmed, a join link appears.",
              },
              {
                title: "It leaves when the intake ends",
                detail:
                  "Closed postings move to the archive. The board returns to empty until the next one is posted.",
              },
            ].map((step, i) => (
              <Reveal key={step.title} delay={0.08 * i}>
                <li className="h-full border border-navy/10 bg-white p-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-orange">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl font-semibold text-navy">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{step.detail}</p>
                </li>
              </Reveal>
            ))}
          </ol>
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

