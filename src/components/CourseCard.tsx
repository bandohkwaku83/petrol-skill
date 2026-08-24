import Image from "next/image";
import Link from "next/link";
import type { Course } from "@/data/content";

export function CourseCard({ course }: { course: Course }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden bg-navy text-white">
      <div className="relative aspect-[16/11] overflow-hidden">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover object-top transition duration-700 group-hover:scale-105"
          sizes="(max-width:768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
        <span className="absolute bottom-3 left-3 text-[11px] font-bold uppercase tracking-[0.18em] text-orange-soft">
          {course.delivery} · {course.duration}
        </span>
      </div>
      <div className="flex flex-1 flex-col border border-t-0 border-navy/10 bg-white p-6 text-ink">
        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold leading-snug text-navy">
          <Link href={`/courses/${course.slug}`} className="hover:text-blue">
            {course.title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
          {course.description.slice(0, 110)}…
        </p>
        <div className="mt-6 flex items-center justify-between border-t border-navy/8 pt-4 text-sm">
          <span className="font-semibold text-navy">{course.fee}</span>
          <Link
            href={`/courses/${course.slug}`}
            className="text-xs font-bold uppercase tracking-[0.14em] text-orange hover:text-navy"
          >
            Details →
          </Link>
        </div>
      </div>
    </article>
  );
}
