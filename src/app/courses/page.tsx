"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { CourseCard } from "@/components/CourseCard";
import { PageHero } from "@/components/PageHero";
import { PaymentDialog } from "@/components/PaymentDialog";
import { SectionHeading } from "@/components/SectionHeading";
import { FloatCard, Magnetic, Reveal } from "@/components/motion";
import { categories, courses, type Course } from "@/data/content";

type Provider = "paystack" | "accrue";

export default function CoursesPage() {
  const [active, setActive] = useState<Course | null>(null);
  const [returnTo, setReturnTo] = useState<{
    slug: string;
    provider: Provider;
    reference: string;
  } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") !== "1" || params.get("kind") !== "course") return;
    const provider = params.get("provider");
    const reference = params.get("reference") || params.get("trxref") || "";
    const slug = params.get("slug") || "";
    if ((provider !== "paystack" && provider !== "accrue") || !reference || !slug) return;
    const course = courses.find((item) => item.slug === slug);
    if (!course) return;
    setActive(course);
    setReturnTo({ slug, provider, reference });
  }, []);
  return (
    <>
      <PageHero
        title="Live professional programs for energy careers"
        description="Tap a course to pay with Paystack or Accrue. After payment is confirmed, a join link appears."
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

      <section className="bg-sand">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
          <Reveal>
            <SectionHeading
              eyebrow="Categories"
              title="Find learning paths by discipline"
            />
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
            {categories.map((cat, i) => (
              <FloatCard key={cat.slug} delay={0.04 * i}>
                <Link
                  href={`#${cat.slug}`}
                  className="block h-full border border-navy/10 bg-white p-4 transition hover:border-orange/40 sm:p-5"
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
              description="Tap a course to pay with Paystack or Accrue. The join link appears after the payment is confirmed."
            />
          </Reveal>
          <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-3">
            {courses.map((course, i) => (
              <FloatCard key={course.slug} delay={0.06 * i} className="h-full">
                <div id={course.category} className="h-full">
                  <CourseCard course={course} onOpen={() => setActive(course)} />
                </div>
              </FloatCard>
            ))}
          </div>
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
          returnTo={returnTo?.slug === active.slug ? returnTo : null}
          onClose={() => setActive(null)}
        />
      ) : null}
    </>
  );
}
