"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { CourseCard } from "@/components/CourseCard";
import { PageHero } from "@/components/PageHero";
import { PaymentDialog } from "@/components/PaymentDialog";
import { SectionHeading } from "@/components/SectionHeading";
import { FloatCard, Magnetic, Reveal } from "@/components/motion";
import { courses, type Course } from "@/data/content";

type Provider = "paystack" | "accrue";

export default function CoursesPage() {
  const [courseList, setCourseList] = useState(courses);
  const [active, setActive] = useState<Course | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/catalog")
      .then((response) => response.json())
      .then((data: { ok?: boolean; catalog?: { courses?: Course[] } }) => {
        if (!cancelled && data.ok && Array.isArray(data.catalog?.courses)) setCourseList(data.catalog.courses);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
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
    const course = courseList.find((item) => item.slug === slug);
    if (!course) return;
    setActive(course);
    setReturnTo({ slug, provider, reference });
  }, [courseList]);
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
            {courseList.map((course, i) => (
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
