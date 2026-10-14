"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { CourseCard } from "@/components/CourseCard";
import { PageHero } from "@/components/PageHero";
import { PaymentDialog } from "@/components/PaymentDialog";
import { SectionHeading } from "@/components/SectionHeading";
import { FloatCard, Magnetic, Reveal } from "@/components/motion";
import { type Course } from "@/data/content";

type Provider = "paystack" | "accrue";

export function CoursesClient({ courses }: { courses: Course[] }) {
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
  }, [courses]);
  return (
    <>
      <PageHero
        title="Live professional programs for energy careers"
        description="Tap a course, choose your country, and pay. After payment is confirmed, a join link appears."
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

      <section id="catalog" className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <SectionHeading
              eyebrow="Open Programs"
              title="Upcoming live courses"
              description="Tap a course, choose your country, and pay. The join link appears after the payment is confirmed."
            />
          </Reveal>
          {courses.length === 0 ? (
            <p className="mt-12 text-sm text-muted">No courses are open right now.</p>
          ) : (
          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
            {courses.map((course, i) => (
              <FloatCard key={course.slug} delay={0.06 * i} className="h-full">
                <div id={course.category} className="h-full">
                  <CourseCard course={course} onOpen={() => setActive(course)} />
                </div>
              </FloatCard>
            ))}
          </div>
          )}
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
