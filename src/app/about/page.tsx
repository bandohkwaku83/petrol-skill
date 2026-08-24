"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { CountUp, FloatCard, Magnetic, Reveal } from "@/components/motion";
import { leadership, stats, values } from "@/data/content";

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="Why PetroSkill Virtual Learning exists"
        description="We started PVL to close the gap between academic credentials and the practical skills energy employers need — through affordable, live professional training."
        image="/images/about-ppe.png"
      />

      <section className="overflow-hidden bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 md:grid-cols-2 md:px-8 md:py-28">
          <Reveal>
            <SectionHeading
              eyebrow="Our Story"
              title="From LMS confusion to a professional institute experience"
              description="Our previous website reflected a Tutor LMS model. Today we operate as a training institute: live cohorts, expert instructors, clear registration via Microsoft Forms, and partnerships that keep programs industry-relevant."
            />
          </Reveal>
          <Reveal delay={0.15}>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/group-02.jpg"
                alt="Team collaboration"
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 50vw"
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-navy/40 to-transparent"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-sand">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-20 md:grid-cols-2 md:px-8">
          <FloatCard>
            <article className="h-full bg-white p-8 md:p-10">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-orange">
                Mission
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-semibold leading-snug text-navy md:text-3xl">
                Deliver affordable, industry-relevant education that professionals can apply immediately.
              </h2>
            </article>
          </FloatCard>
          <FloatCard delay={0.1}>
            <article className="relative h-full overflow-hidden bg-navy p-8 text-white md:p-10">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-orange-soft">
                Vision
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-semibold leading-snug md:text-3xl">
                Become a leading professional training organization for the global energy sector.
              </h2>
            </article>
          </FloatCard>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <SectionHeading eyebrow="Core Values" title="What guides every cohort we run" />
          </Reveal>
          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={0.08 * i}>
                <div className="group border-t border-navy/15 pt-6">
                  <motion.p
                    className="font-[family-name:var(--font-display)] text-5xl font-semibold text-orange/30"
                    whileHover={{ color: "var(--pvl-orange)" }}
                  >
                    0{i + 1}
                  </motion.p>
                  <h3 className="mt-4 font-[family-name:var(--font-display)] text-xl font-semibold text-navy">
                    {v.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{v.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy py-20 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <SectionHeading light eyebrow="Our Impact" title="Numbers that reflect global reach" />
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-5">
            {stats.map((s) => (
              <CountUp key={s.label} value={s.value} label={s.label} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sand">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <SectionHeading
              eyebrow="Leadership Team"
              title="People shaping PVL’s programs and partnerships"
            />
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {leadership.map((person, i) => (
              <FloatCard key={person.name} delay={0.08 * i}>
                <article className="overflow-hidden bg-white">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={person.image}
                      alt={person.name}
                      fill
                      className="object-cover transition duration-700 hover:scale-105"
                      sizes="(max-width:768px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-[family-name:var(--font-display)] font-semibold text-navy">
                      {person.name}
                    </h3>
                    <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-orange">
                      {person.role}
                    </p>
                    <p className="mt-3 text-sm text-muted">{person.bio}</p>
                  </div>
                </article>
              </FloatCard>
            ))}
          </div>
          <Reveal className="mt-12 border border-dashed border-navy/20 bg-white p-8 text-center">
            <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-navy">
              Advisory Board
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
              Industry advisors support curriculum relevance and partnership strategy.
              Profiles will be published as appointments are confirmed.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-10 flex justify-center">
            <Magnetic>
              <Button href="/contact" variant="orange">
                Partner with PVL
              </Button>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </>
  );
}
