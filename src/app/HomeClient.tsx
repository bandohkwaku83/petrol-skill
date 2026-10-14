"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { useState } from "react";
import { CourseArt } from "@/components/CourseArt";
import { PaymentDialog } from "@/components/PaymentDialog";
import { ProfileIcon } from "@/components/ProfileIcon";
import { SectionHeading } from "@/components/SectionHeading";
import {
  Aurora,
  FloatCard,
  Magnetic,
  Reveal,
  SplitHeadline,
} from "@/components/motion";
import {
  partners,
  testimonials,
  type Course,
} from "@/data/content";

export function HomeClient({ courses }: { courses: Course[] }) {
  const featured = courses.filter((c) => c.featured).slice(0, 4);
  const [active, setActive] = useState<Course | null>(null);

  return (
    <>
      {/* Hero */}
      <section className="grain relative min-h-[100svh] overflow-hidden bg-navy text-white lg:flex lg:items-end">
        <div className="absolute inset-x-0 top-0 h-[78svh] overflow-hidden lg:inset-0 lg:h-full">
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src="/images/hero-image.png"
              alt="PetroSkill professional in industrial safety gear"
              fill
              priority
              className="ken-burns object-cover object-[78%_center] lg:object-[center_30%]"
              sizes="100vw"
            />
          </motion.div>
          <div className="absolute inset-0 hidden bg-gradient-to-t from-navy via-navy/55 to-navy/20 lg:block" />
          <div className="absolute inset-0 hidden bg-gradient-to-r from-navy/90 via-navy/50 to-transparent lg:block" />
          <Aurora />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,transparent_32%,#061a33_54%,#061a33_100%)] lg:hidden" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-12 pt-[46svh] md:px-8 lg:pb-24 lg:pt-36">
          <div>
            <SplitHeadline
              className="max-w-4xl font-[family-name:var(--font-display)] text-[clamp(2rem,4.6vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
              lines={[
                "Build the Skills.",
                "Gain the Experience.",
                "Become Industry-Ready.",
              ]}
              glowWord="Industry-Ready"
            />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            className="mt-7 max-w-lg text-base leading-relaxed text-white/80 md:text-lg"
          >
            Practical oil and gas training, virtual internships, and industry-relevant simulation tools for the next generation of energy professionals.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Magnetic>
              <Button href="/courses" variant="orange">
                Explore courses
              </Button>
            </Magnetic>
            <Magnetic>
              <Button href="/internship" variant="secondary">
                Internship openings
              </Button>
            </Magnetic>
          </motion.div>
        </div>

        <motion.div
          aria-hidden
          className="absolute bottom-8 right-8 hidden items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 md:flex"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          Scroll
          <span className="block h-10 w-px bg-gradient-to-b from-orange to-transparent" />
        </motion.div>
      </section>

      {/* About */}
      <section className="overflow-hidden bg-sand">
        <div className="mx-auto grid max-w-7xl items-center lg:grid-cols-12">
          <Reveal className="relative aspect-[5/4] bg-[#f4f5f7] lg:col-span-7">
            <Image
              src="/images/Who-are-we.PNG"
              alt="PetroSkill team giving a thumbs up"
              fill
              className="object-contain object-center"
              sizes="(max-width:1024px) 100vw, 58vw"
            />
          </Reveal>
          <div className="flex flex-col justify-center px-5 py-16 md:px-12 lg:col-span-5 lg:py-20">
            <Reveal>
              <SectionHeading
                eyebrow="Who we are"
                title="Practical learning. Industry-led."
                description="PetroSkill Virtual Learning (PVL) equips students, graduates, and young professionals with practical, industry-ready skills for the oil and gas sector through expert-led training, hands-on learning, and engineering simulation tools. We bridge the gap between academic theory and industry practice, preparing the next generation of energy professionals for successful careers."
              />
            </Reveal>
            <div className="mt-10 space-y-6 border-t border-navy/10 pt-8">
              {["Live", "Practical", "Accessible"].map((word, i) => (
                <Reveal key={word} delay={0.1 * i}>
                  <p className="font-[family-name:var(--font-display)] text-4xl font-semibold text-navy">
                    {word}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {
                      [
                        "Instructor-led sessions and interactive discussions",
                        "Engineering exercises, industry case studies, and simulation tools",
                        "Virtual learning opportunities for students, graduates, and professionals worldwide",
                      ][i]
                    }
                  </p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.25} className="mt-10">
              <Button href="/about" variant="primary">
                Meet PVL
              </Button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Courses rail */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <Reveal>
              <SectionHeading
                eyebrow="Featured programs"
                title="Upcoming live programs"
                description="Tap a course, choose your country, and pay. The join link appears after payment."
              />
            </Reveal>
            <Reveal delay={0.15}>
              <Button href="/courses" variant="ghost">
                Full catalog
              </Button>
            </Reveal>
          </div>
        </div>
        {featured.length === 0 ? (
          <p className="px-5 text-sm text-muted md:px-8">Nothing is posted right now. New programs appear here when they open.</p>
        ) : (
        <div className="course-rail px-5 md:px-8 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
          {featured.map((course, i) => (
            <FloatCard key={course.slug} delay={i * 0.08}>
              <button
                type="button"
                onClick={() => setActive(course)}
                className="group block w-full overflow-hidden bg-white text-left text-white"
              >
                <CourseArt className="h-28 sm:h-40" />
                <div className="bg-navy p-4 sm:p-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-soft">
                    0{i + 1} · {course.duration}
                  </p>
                  <h3 className="mt-2 font-[family-name:var(--font-display)] text-base font-semibold leading-tight sm:text-xl">
                    {course.title}
                  </h3>
                  <p className="mt-3 text-sm text-white/70">
                    Starts {course.startDate} · {course.fee}
                  </p>
                  <span className="mt-5 inline-block text-xs font-bold uppercase tracking-[0.16em] text-white transition group-hover:text-orange-soft">
                    Pay to join →
                  </span>
                </div>
              </button>
            </FloatCard>
          ))}
        </div>
        )}
      </section>

      {/* Internship */}
      <section className="grain relative overflow-hidden text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/flagship-session.jpg"
            alt="Student in a live virtual session"
            fill
            className="object-cover object-[center_55%]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/92 via-navy/70 to-navy/50" />
          <Aurora />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-24 md:grid-cols-2 md:px-8 md:py-32">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-orange-soft">
              Flagship
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              Virtual{" "}
              <span className="relative inline-block text-orange-soft">
                Internship
                <span aria-hidden className="glow-blob absolute -inset-x-2 -bottom-1 top-1/2 blur-2xl" />
              </span>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/75 md:text-lg">
              Internships are posted when a cohort opens. Interns gain exposure to key operational areas of the oil and gas industry, complemented by additional courses that enhance their technical skills and professional development.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Magnetic>
                <Button href="/internship" variant="orange">
                  See openings
                </Button>
              </Magnetic>
              <Magnetic>
                <Button href="/waitlist" variant="secondary">
                  Join waitlist
                </Button>
              </Magnetic>
            </div>
          </Reveal>
          <div className="flex flex-col justify-end border-l border-white/15 md:pl-10">
            {[
              "Structured weekly live sessions",
              "Capstone project with feedback",
              "Guest speakers from industry",
              "Certificate of completion and transcript provision",
            ].map((item, i) => (
              <Reveal key={item} delay={0.1 * i}>
                <div className="border-b border-white/10 py-5 font-[family-name:var(--font-display)] text-lg md:text-xl">
                  <span className="mr-4 text-orange-soft">0{i + 1}</span>
                  {item}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="relative bg-white py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-5 text-center md:px-8">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-orange">
              Voices
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <blockquote className="mt-8">
              <p className="font-[family-name:var(--font-display)] text-2xl font-medium leading-snug tracking-tight text-navy md:text-4xl md:leading-[1.25]">
                “{testimonials[0].quote}”
              </p>
              <footer className="mt-10 flex flex-col items-center gap-3">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ProfileIcon size="md" />
                </motion.div>
                <div>
                  <p className="font-semibold text-navy">{testimonials[0].name}</p>
                  <p className="text-sm text-muted">
                    {testimonials[0].role} · {testimonials[0].company}
                  </p>
                </div>
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* Partners */}
      <section className="bg-sand py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <p className="text-center text-[11px] font-bold uppercase tracking-[0.28em] text-orange">
              Partners
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
              {partners.map((partner) => (
                <div key={partner.name} className="bg-black px-8 py-5">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={429}
                    height={147}
                    className="h-14 w-auto md:h-16"
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
      {active ? (
        <PaymentDialog
          kind="course"
          slug={active.slug}
          title={active.title}
          fee={active.fee}
          eyebrow="Course payment"
          joinLabel="Join the course"
          returnTo={null}
          onClose={() => setActive(null)}
        />
      ) : null}
    </>
  );
}
