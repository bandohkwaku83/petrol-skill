"use client";

import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Aurora, FloatCard, Magnetic, Reveal } from "@/components/motion";
import { site } from "@/data/content";

export default function WaitlistPage() {
  const lists = [
    {
      title: "Virtual Internship",
      description: "Get notified when the next internship cohort opens for applications.",
    },
    {
      title: "Upcoming Courses",
      description: "Be first to know when new live technical and digital courses launch.",
    },
    {
      title: "Future Cohorts",
      description: "Join the interest list for specialized programs still in planning.",
    },
  ];

  return (
    <>
      <PageHero
        title="Reserve your place for future programs"
        description="Cohorts fill quickly. Join a waitlist via Microsoft Forms and we will reach out when seats open."
        image="/images/cta-thumbs-up.png"
        actions={
          <Magnetic>
            <Button href={site.waitlistForm} variant="orange" external>
              Open waitlist form
            </Button>
          </Magnetic>
        }
      />

      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <SectionHeading
              eyebrow="Choose a list"
              title="Tell us what you are interested in"
            />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {lists.map((list, i) => (
              <FloatCard key={list.title} delay={0.1 * i}>
                <article className="flex h-full flex-col border border-navy/8 bg-sand p-6 md:p-8">
                  <p className="font-[family-name:var(--font-display)] text-5xl font-semibold text-orange/30">
                    0{i + 1}
                  </p>
                  <h3 className="mt-4 font-[family-name:var(--font-display)] text-xl font-semibold text-navy">
                    {list.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm text-muted">{list.description}</p>
                  <div className="mt-8">
                    <Magnetic>
                      <Button href={site.waitlistForm} variant="primary" external>
                        Join waitlist
                      </Button>
                    </Magnetic>
                  </div>
                </article>
              </FloatCard>
            ))}
          </div>
        </div>
      </section>

      <section className="grain relative overflow-hidden bg-navy py-16 text-white">
        <Aurora />
        <div className="relative mx-auto max-w-7xl px-5 text-center md:px-8">
          <Reveal>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold md:text-4xl">
              Prefer to talk first?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-white/70">
              Reach the team and we&apos;ll help you pick the right program.
            </p>
            <div className="mt-8 flex justify-center">
              <Magnetic>
                <Button href="/contact" variant="orange">
                  Contact us
                </Button>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
