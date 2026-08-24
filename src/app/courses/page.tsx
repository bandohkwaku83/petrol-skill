"use client";

import Link from "next/link";
import { Button } from "@/components/Button";
import { CourseCard } from "@/components/CourseCard";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { FloatCard, Magnetic, Reveal, TextMarquee } from "@/components/motion";
import { categories, courses } from "@/data/content";

export default function CoursesPage() {
  return (
    <>
      <PageHero
        title="Live professional programs for energy careers"
        description="Each course includes schedule, instructor, fee, outcomes, and a Register Now button that opens Microsoft Forms — no LMS lessons or quizzes."
        image="/images/hero-ppe-yellow.png"
        actions={
          <>
            <Magnetic>
              <Button href="#catalog" variant="orange">
                Browse catalog
              </Button>
            </Magnetic>
            <Magnetic>
              <Button href="/waitlist" variant="secondary">
                Join waitlist
              </Button>
            </Magnetic>
          </>
        }
      />

      <TextMarquee
        items={categories.map((c) => c.name)}
      />

      <section className="bg-sand">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
          <Reveal>
            <SectionHeading
              eyebrow="Categories"
              title="Find learning paths by discipline"
            />
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((cat, i) => (
              <FloatCard key={cat.slug} delay={0.04 * i}>
                <Link
                  href={`#${cat.slug}`}
                  className="block h-full border border-navy/10 bg-white p-5 transition hover:border-orange/40"
                >
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange">
                    0{(i + 1).toString().padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 font-[family-name:var(--font-display)] text-sm font-semibold text-navy">
                    {cat.name}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    {cat.description}
                  </p>
                </Link>
              </FloatCard>
            ))}
          </div>
        </div>
      </section>

      <section id="catalog" className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <SectionHeading
              eyebrow="Open Programs"
              title="Upcoming live courses"
              description="Select a course to view full details and register."
            />
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course, i) => (
              <FloatCard key={course.slug} delay={0.06 * i} className="h-full">
                <div id={course.category} className="h-full">
                  <CourseCard course={course} />
                </div>
              </FloatCard>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
