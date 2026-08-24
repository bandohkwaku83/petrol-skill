"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { ProfileIcon } from "@/components/ProfileIcon";
import { SectionHeading } from "@/components/SectionHeading";
import { FloatCard, Magnetic, Reveal } from "@/components/motion";
import { testimonials } from "@/data/content";

export default function TestimonialsPage() {
  return (
    <>
      <PageHero
        title="Student stories, alumni outcomes, and employer feedback"
        description="Hear how live PVL programs helped professionals build skills, confidence, and career momentum."
        image="/images/team-04.jpg"
      />

      <section className="bg-sand">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <SectionHeading
              eyebrow="Voices"
              title="What participants and partners say"
            />
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {testimonials.map((t, i) => (
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
                  </div>
                </blockquote>
              </FloatCard>
            ))}
          </div>

          <Reveal className="mt-12 flex justify-center">
            <Magnetic>
              <Button href="/courses" variant="orange">
                Start your journey
              </Button>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </>
  );
}
