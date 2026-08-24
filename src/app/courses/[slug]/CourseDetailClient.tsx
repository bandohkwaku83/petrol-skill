"use client";

import Image from "next/image";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { FloatCard, Magnetic, Reveal } from "@/components/motion";
import type { Course } from "@/data/content";
import { site } from "@/data/content";

export function CourseDetailClient({ course }: { course: Course }) {
  return (
    <>
      <PageHero
        title={course.title}
        description={course.description}
        image={course.image}
        actions={
          <>
            <Magnetic>
              <Button href={site.registrationForm} variant="orange" external>
                Register Now
              </Button>
            </Magnetic>
            <Magnetic>
              <Button href="/courses" variant="secondary">
                All courses
              </Button>
            </Magnetic>
          </>
        }
      />

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[1fr_340px] md:px-8 md:py-24">
          <div>
            <Reveal>
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-navy">
                Learning outcomes
              </h2>
            </Reveal>
            <ul className="mt-6 space-y-3">
              {course.outcomes.map((o, i) => (
                <Reveal key={o} delay={0.06 * i}>
                  <li className="flex gap-3 border border-navy/8 bg-sand px-4 py-3 text-sm text-ink">
                    <span className="font-bold text-orange">✓</span>
                    {o}
                  </li>
                </Reveal>
              ))}
            </ul>

            {course.prerequisites?.length ? (
              <Reveal className="mt-12">
                <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-navy">
                  Prerequisites
                </h2>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted">
                  {course.prerequisites.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </Reveal>
            ) : null}

            <div className="mt-12">
              <Reveal>
                <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-navy">
                  Frequently asked questions
                </h2>
              </Reveal>
              <div className="mt-6 space-y-3">
                {course.faqs.map((f, i) => (
                  <Reveal key={f.q} delay={0.06 * i}>
                    <details className="group border border-navy/8 p-4 open:bg-sand">
                      <summary className="cursor-pointer font-[family-name:var(--font-display)] font-semibold text-navy">
                        {f.q}
                      </summary>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{f.a}</p>
                    </details>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal className="mt-12 bg-navy p-6 text-white md:p-8">
              <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
                Ready to join?
              </h3>
              <p className="mt-2 text-sm text-white/70">
                Registration opens Microsoft Forms. After submission, our team sends
                payment instructions, WhatsApp group access, and Teams meeting details.
              </p>
              <div className="mt-6">
                <Magnetic>
                  <Button href={site.registrationForm} variant="orange" external>
                    Register via Microsoft Forms
                  </Button>
                </Magnetic>
              </div>
            </Reveal>
          </div>

          <FloatCard className="h-fit lg:sticky lg:top-28">
            <aside className="border border-navy/8 bg-sand p-6">
              <div className="relative mb-5 aspect-video overflow-hidden">
                <Image
                  src={course.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="340px"
                />
              </div>
              <dl className="space-y-3 text-sm">
                {[
                  ["Duration", course.duration],
                  ["Delivery", course.delivery],
                  ["Start date", course.startDate],
                  ["Time", course.time],
                  ["Instructor", course.instructor],
                  ["Fee", course.fee],
                  ["Audience", course.audience],
                ].map(([label, value]) => (
                  <div key={label} className="border-b border-navy/5 pb-3">
                    <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-orange">
                      {label}
                    </dt>
                    <dd className="mt-1 font-medium text-navy">{value}</dd>
                  </div>
                ))}
              </dl>
              <Magnetic className="mt-5 block">
                <Button
                  href={site.registrationForm}
                  variant="orange"
                  external
                  className="w-full"
                >
                  Register Now
                </Button>
              </Magnetic>
            </aside>
          </FloatCard>
        </div>
      </section>
    </>
  );
}
