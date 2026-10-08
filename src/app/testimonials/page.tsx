"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { ProfileIcon } from "@/components/ProfileIcon";
import { SectionHeading } from "@/components/SectionHeading";
import { FloatCard, Magnetic, Reveal } from "@/components/motion";
import { site, testimonialKinds, testimonials } from "@/data/content";

export default function TestimonialsPage() {
  return (
    <>
      <PageHero
        title="Student stories, alumni outcomes, and employer feedback"
        description="Written notes, a video story, and a LinkedIn recommendation from people who have sat in a live PVL cohort."
        image="/images/team-04.jpg"
      />

      <section className="bg-sand">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          {testimonialKinds.map((group) => {
            const items = testimonials.filter((t) => t.kind === group.id);
            if (items.length === 0) return null;
            return (
              <div key={group.id} className="mb-16 last:mb-0">
                <Reveal>
                  <SectionHeading eyebrow="Voices" title={group.label} />
                </Reveal>
                <div className="mt-10 grid gap-6 md:grid-cols-2">
                  {items.map((t, i) => (
                    <FloatCard key={t.name} delay={0.08 * i}>
                      <blockquote className="flex h-full gap-5 bg-white p-6 md:p-8">
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            duration: 4 + i,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <ProfileIcon size="md" />
                        </motion.div>
                        <div>
                          <p className="font-[family-name:var(--font-display)] text-base leading-relaxed text-navy md:text-lg">
                            “{t.quote}”
                          </p>
                          <p className="mt-5 font-semibold text-navy">{t.name}</p>
                          <p className="text-xs text-muted">
                            {t.role} · {t.company}
                          </p>
                          {t.videoUrl ? (
                            <a
                              href={t.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-4 inline-block text-xs font-bold uppercase tracking-[0.16em] text-blue hover:text-orange"
                            >
                              Watch on YouTube
                            </a>
                          ) : null}
                          {t.linkedinUrl ? (
                            <a
                              href={t.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-4 inline-block text-xs font-bold uppercase tracking-[0.16em] text-blue hover:text-orange"
                            >
                              View on LinkedIn
                            </a>
                          ) : null}
                        </div>
                      </blockquote>
                    </FloatCard>
                  ))}
                </div>
              </div>
            );
          })}

          <Reveal className="mt-4 flex flex-wrap justify-center gap-3">
            <Magnetic>
              <Button href="/courses" variant="orange">
                Start your journey
              </Button>
            </Magnetic>
            <Magnetic>
              <Button href={site.social.linkedin} variant="ghost" external>
                PVL on LinkedIn
              </Button>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </>
  );
}
