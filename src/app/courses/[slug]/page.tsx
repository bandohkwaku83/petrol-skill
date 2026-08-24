import { notFound } from "next/navigation";
import { courses } from "@/data/content";
import { CourseDetailClient } from "./CourseDetailClient";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  return { title: course?.title ?? "Course" };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) notFound();
  return <CourseDetailClient course={course} />;
}
