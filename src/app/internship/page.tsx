"use client";

import Image from "next/image";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Aurora, FloatCard, Magnetic, Reveal } from "@/components/motion";
import { internship, site, testimonials } from "@/data/content";

export default function InternshipPage() {
  return (
    <>
      <PageHero
        title="Virtual Internship for emerging energy professionals"
        description={internship.overview}
        image="/images/cta-thumbs-up.png"
        actions={
          <>
            <Magnetic>
              <Button href={site.registrationForm} variant="orange" external>
                Register Now
              </Button>
            </Magnetic>
            <Magnetic>
              <Button href={site.waitlistForm} variant="secondary" external>
                Join Waitlist
              </Button>
            </Magnetic>
          </>
        }
      />

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <SectionHeading
              eyebrow="Learning Objectives"
              title="What you will walk away with"
            />
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {internship.objectives.map((o, i) => (
              <Reveal key={o} delay={0.08 * i}>
                <div className="border-l-2 border-orange bg-sand px-5 py-4 text-sm text-ink">
                  <span className="mr-2 font-[family-name:var(--font-display)] font-bold text-orange">
                    0{i + 1}
                  </span>
                  {o}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sand">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-2 md:px-8 md:py-28">
          <div>
            <Reveal>
              <SectionHeading eyebrow="Curriculum" title="Six-week learning journey" />
            </Reveal>
            <ol className="mt-10 space-y-3">
              {internship.curriculum.map((item, i) => (
                <Reveal key={item.week} delay={0.06 * i}>
                  <li className="flex gap-4 border border-navy/8 bg-white p-4">
                    <span className="font-[family-name:var(--font-display)] text-sm font-bold text-orange">
                      {item.week}
                    </span>
                    <span className="text-sm text-ink">{item.topic}</span>
                  </li>
                </Reveal>
              ))}
            </ol>
            <Reveal delay={0.2}>
              <p className="mt-6 text-sm text-muted">{internship.schedule}</p>
            </Reveal>
          </div>
          <div>
            <Reveal>
              <SectionHeading
                eyebrow="Industry Speakers"
                title="Learn from practitioners"
              />
            </Reveal>
            <ul className="mt-10 space-y-3">
              {internship.speakers.map((s, i) => (
                <Reveal key={s} delay={0.06 * i}>
                  <li className="border border-navy/8 bg-white px-5 py-4 text-sm font-medium text-navy">
                    {s}
                  </li>
                </Reveal>
              ))}
            </ul>
            <Reveal delay={0.2} className="relative mt-8 aspect-[16/10] overflow-hidden">
              <Image
                src="/images/team-08.jpg"
                alt="Industry speaker"
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 50vw"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="grain relative overflow-hidden bg-navy text-white">
        <Aurora />
        <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <SectionHeading
              light
              eyebrow="Benefits"
              title="Why participants choose this internship"
            />
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {internship.benefits.map((b, i) => (
              <FloatCard key={b} delay={0.08 * i}>
                <div className="h-full border border-white/10 bg-white/5 p-5 text-sm backdrop-blur-sm">
                  {b}
                </div>
              </FloatCard>
            ))}
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <Reveal>
              <div className="border border-white/10 bg-white/5 p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-soft">
                  Pricing
                </p>
                <p className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold">
                  {internship.pricing}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1} className="md:col-span-2">
              <div className="border border-white/10 bg-white/5 p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-soft">
                  Previous cohorts
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {internship.cohorts.map((c) => (
                    <span
                      key={c}
                      className="border border-white/15 px-3 py-1.5 text-sm"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <SectionHeading eyebrow="Testimonials" title="Voices from past interns" />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {testimonials.slice(0, 2).map((t, i) => (
              <FloatCard key={t.name} delay={0.1 * i}>
                <blockquote className="h-full bg-sand p-6 md:p-8">
                  <p className="font-[family-name:var(--font-display)] text-lg leading-relaxed text-navy">
                    “{t.quote}”
                  </p>
                  <p className="mt-6 text-sm font-semibold text-navy">
                    {t.name} · {t.role}
                  </p>
                </blockquote>
              </FloatCard>
            ))}
          </div>

          <div className="mt-16">
            <Reveal>
              <SectionHeading eyebrow="FAQs" title="Common questions" />
            </Reveal>
            <div className="mt-8 space-y-3">
              {internship.faqs.map((f, i) => (
                <Reveal key={f.q} delay={0.06 * i}>
                  <details className="group border border-navy/10 p-5 open:bg-sand">
                    <summary className="cursor-pointer font-[family-name:var(--font-display)] font-semibold text-navy">
                      {f.q}
                    </summary>
                    <p className="mt-3 text-sm text-muted">{f.a}</p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal className="mt-12 flex flex-wrap gap-3">
            <Magnetic>
              <Button href={site.registrationForm} variant="orange" external>
                Register Now
              </Button>
            </Magnetic>
            <Magnetic>
              <Button href={site.waitlistForm} variant="ghost" external>
                Join Waitlist
              </Button>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </>
  );
}
