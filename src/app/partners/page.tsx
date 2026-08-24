"use client";

import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { FloatCard, Magnetic, Reveal, TextMarquee } from "@/components/motion";
import { partners } from "@/data/content";

export default function PartnersPage() {
  const types = [...new Set(partners.map((p) => p.type))];

  return (
    <>
      <PageHero
        title="Collaborators powering credible, scalable training"
        description="We work with universities, energy companies, associations, technology providers, sponsors, and training partners."
        image="/images/group-01.jpg"
        actions={
          <Magnetic>
            <Button href="/contact" variant="orange">
              Become a partner
            </Button>
          </Magnetic>
        }
      />

      <TextMarquee items={types} />

      <section className="bg-sand">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          {types.map((type) => (
            <div key={type} className="mb-16 last:mb-0">
              <Reveal>
                <SectionHeading eyebrow={type} title={`${type} partners`} />
              </Reveal>
              <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {partners
                  .filter((p) => p.type === type)
                  .map((p, i) => (
                    <FloatCard key={p.name} delay={0.08 * i}>
                      <article className="h-full border border-navy/8 bg-white p-6 transition hover:border-orange/30">
                        <div className="flex h-14 w-14 items-center justify-center bg-navy font-[family-name:var(--font-display)] text-sm font-bold text-white">
                          {p.logo}
                        </div>
                        <h3 className="mt-5 font-[family-name:var(--font-display)] text-lg font-semibold text-navy">
                          {p.name}
                        </h3>
                        <p className="mt-2 text-sm text-muted">{p.description}</p>
                      </article>
                    </FloatCard>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
