"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { FloatCard, Magnetic, Reveal } from "@/components/motion";
import { leadership, values, whyExists } from "@/data/content";

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="Why PetroSkill Virtual Learning exists"
        description="PVL exists to bridge the gap between classroom theory and real-world application by delivering hands-on training, expert-led sessions, and job-focused learning experiences."
        image="/images/about-ppe.png"
      />

      <section className="overflow-hidden bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 md:grid-cols-2 md:px-8 md:py-28">
          <Reveal>
            <SectionHeading
              eyebrow="Why PVL exists"
              title={whyExists.title}
              description={whyExists.body}
            />
          </Reveal>
          <Reveal delay={0.15}>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/why-pvl-team.jpg"
                alt="PetroSkill team in safety gear"
                fill
                className="object-cover object-[center_30%]"
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
                To provide practical, industry-driven training that develops skilled, employable, and future-ready oil and gas professionals across Africa and beyond.
              </h2>
            </article>
          </FloatCard>
          <FloatCard delay={0.1}>
            <article className="relative h-full overflow-hidden bg-navy p-8 text-white md:p-10">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-orange-soft">
                Vision
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-semibold leading-snug md:text-3xl">
                To become the leading virtual technical training hub in petroleum and energy education for the global energy sector.
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

      <section className="bg-sand">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <SectionHeading
              eyebrow="Leadership Team"
              title="People shaping PVL’s programs and partnerships"
            />
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {leadership.map((person, i) => (
              <FloatCard key={person.name} delay={0.08 * i}>
                <article className="overflow-hidden bg-white">
                  <div className="relative aspect-[5/7] overflow-hidden">
                    <Image
                      src={person.image}
                      alt={person.name}
                      fill
                      className={`origin-top object-cover object-top transition duration-700 ${
                        i === 0 ? "scale-[1.35] hover:scale-[1.42]" : "hover:scale-105"
                      }`}
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-[family-name:var(--font-display)] font-semibold text-navy">
                      {person.name}
                    </h3>
                    <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-orange">
                      {person.role}
                    </p>
                  </div>
                </article>
              </FloatCard>
            ))}
          </div>
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
