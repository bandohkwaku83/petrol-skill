"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { ProfileIcon } from "@/components/ProfileIcon";
import { SectionHeading } from "@/components/SectionHeading";
import {
  Aurora,
  CountUp,
  FloatCard,
  Magnetic,
  Reveal,
  SplitHeadline,
} from "@/components/motion";
import {
  courses,
  news,
  site,
  stats,
  testimonials,
  whyChoose,
} from "@/data/content";

export default function HomePage() {
  const featured = courses.filter((c) => c.featured).slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="grain relative flex min-h-[100svh] items-end overflow-hidden text-white">
        <div className="absolute inset-0">
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
              className="ken-burns object-cover object-[center_30%]"
              sizes="100vw"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-navy/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/50 to-transparent" />
          <Aurora />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-36 md:px-8 md:pb-24">
          <div>
            <SplitHeadline
              className="max-w-5xl font-[family-name:var(--font-display)] text-[clamp(2.75rem,7.5vw,6rem)] font-semibold leading-[0.94] tracking-[-0.03em]"
              lines={[
                "Live training for",
                "energy careers",
                "that matter.",
              ]}
              glowWord="matter"
            />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            className="mt-7 max-w-lg text-base leading-relaxed text-white/80 md:text-lg"
          >
            Instructor-led virtual programs in oil, gas, and emerging technology —
            built for people who want real skills, not another video library.
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
                Virtual internship
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
      <section className="overflow-hidden bg-background pt-16 md:pt-24 lg:pt-28">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-12">
          <Reveal className="relative min-h-[420px] lg:col-span-7 lg:min-h-[640px]">
            <Image
              src="/images/who-are-we.jpg"
              alt="PetroSkill team giving a thumbs up"
              fill
              className="object-cover object-[center_20%]"
              sizes="(max-width:1024px) 100vw, 58vw"
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-navy/30 to-transparent"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
            />
          </Reveal>
          <div className="flex flex-col justify-center bg-sand px-5 py-16 md:px-12 lg:col-span-5">
            <Reveal>
              <SectionHeading
                eyebrow="Who we are"
                title="Industry depth. Human teaching."
                description="PVL connects practicing experts with ambitious professionals across Africa and the world — through scheduled live sessions, not passive content dumps."
              />
            </Reveal>
            <div className="mt-10 space-y-6 border-t border-navy/10 pt-8">
              {["Live", "Applied", "Open"].map((word, i) => (
                <Reveal key={word} delay={0.1 * i}>
                  <p className="font-[family-name:var(--font-display)] text-4xl font-semibold text-navy">
                    {word}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {
                      [
                        "Instructor-led on Microsoft Teams",
                        "Case studies from real operating contexts",
                        "Register via Microsoft Forms in minutes",
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
                title="Upcoming live cohorts"
                description="Pick a course. Register on Microsoft Forms. Join the classroom."
              />
            </Reveal>
            <Reveal delay={0.15}>
              <Button href="/courses" variant="ghost">
                Full catalog
              </Button>
            </Reveal>
          </div>
        </div>
        <div className="course-rail px-5 md:px-8 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
          {featured.map((course, i) => (
            <FloatCard key={course.slug} delay={i * 0.08}>
              <Link
                href={`/courses/${course.slug}`}
                className="group relative block overflow-hidden bg-navy text-white"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                    sizes="360px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/45 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-soft">
                      0{i + 1} · {course.duration}
                    </p>
                    <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold leading-tight">
                      {course.title}
                    </h3>
                    <p className="mt-3 text-sm text-white/70">
                      Starts {course.startDate} · {course.fee}
                    </p>
                    <span className="mt-5 inline-block text-xs font-bold uppercase tracking-[0.16em] text-white transition group-hover:text-orange-soft">
                      View details →
                    </span>
                  </div>
                </div>
              </Link>
            </FloatCard>
          ))}
        </div>
      </section>

      {/* Internship */}
      <section className="grain relative overflow-hidden text-white">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=2000&q=80"
            alt="Young professionals collaborating in a virtual learning session"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-navy/78" />
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
              Six weeks. Live mentors. Industry speakers. A capstone you can talk about in
              interviews — not a certificate collecting dust.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Magnetic>
                <Button href={site.registrationForm} variant="orange" external>
                  Register now
                </Button>
              </Magnetic>
              <Magnetic>
                <Button href="/internship" variant="secondary">
                  See the program
                </Button>
              </Magnetic>
            </div>
          </Reveal>
          <div className="flex flex-col justify-end border-l border-white/15 md:pl-10">
            {[
              "Structured weekly live sessions",
              "Guided projects with feedback",
              "Guest speakers from industry",
              "Career clinic & alumni network",
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

      {/* Why */}
      <section className="bg-sand py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Why PVL"
              title="Clarity over noise. Practice over shortcuts."
            />
          </Reveal>
          <div className="mt-16 grid gap-x-10 gap-y-12 md:grid-cols-2">
            {whyChoose.map((item, i) => (
              <Reveal key={item.title} delay={0.08 * i}>
                <div className="group border-t border-navy/15 pt-6">
                  <motion.p
                    className="font-[family-name:var(--font-display)] text-5xl font-semibold text-orange/35"
                    whileHover={{ color: "var(--pvl-orange)", scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    0{i + 1}
                  </motion.p>
                  <h3 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-semibold text-navy">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-sm text-muted">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="relative mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <Reveal className="shrink-0 text-center lg:text-left">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-orange-soft">
                Impact
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight md:text-2xl">
                Training professionals worldwide
              </h2>
            </Reveal>

            <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5 lg:gap-0">
              {stats.map((stat, i) => (
                <Reveal
                  key={stat.label}
                  delay={0.05 * i}
                  className={`text-center lg:px-4 ${
                    i > 0 ? "lg:border-l lg:border-white/10" : ""
                  }`}
                >
                  <CountUp
                    value={stat.value}
                    label={stat.label}
                    variant="dark"
                    compact
                  />
                </Reveal>
              ))}
            </div>
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
          <Reveal delay={0.2}>
            <Link
              href="/testimonials"
              className="mt-12 inline-block text-xs font-bold uppercase tracking-[0.2em] text-blue hover:text-orange"
            >
              More stories →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* News */}
      <section className="bg-background py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <SectionHeading eyebrow="News" title="What’s moving at PVL" />
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-12">
            <FloatCard className="lg:col-span-7">
              <Link
                href={`/news/${news[0].slug}`}
                className="group relative block min-h-[420px] overflow-hidden"
              >
                <Image
                  src={news[0].image}
                  alt={news[0].title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width:1024px) 100vw, 60vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-soft">
                    {news[0].category}
                  </p>
                  <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold md:text-3xl">
                    {news[0].title}
                  </h3>
                </div>
              </Link>
            </FloatCard>
            <div className="flex flex-col gap-6 lg:col-span-5">
              {news.slice(1).map((item, i) => (
                <FloatCard key={item.slug} delay={0.1 * (i + 1)} className="flex-1">
                  <Link
                    href={`/news/${item.slug}`}
                    className="group flex h-full flex-col justify-between border border-navy/10 bg-white p-6 transition hover:border-orange/40"
                  >
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange">
                        {item.category}
                      </p>
                      <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl font-semibold text-navy group-hover:text-blue">
                        {item.title}
                      </h3>
                    </div>
                    <p className="mt-4 text-sm text-muted">{item.date}</p>
                  </Link>
                </FloatCard>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
