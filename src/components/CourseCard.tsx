import { CourseArt } from "@/components/CourseArt";
import type { Course } from "@/data/content";

export function CourseCard({ course, onOpen }: { course: Course; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative flex h-full w-full flex-col overflow-hidden bg-navy text-left text-white"
    >
      <div className="relative aspect-[16/11] overflow-hidden">
        <CourseArt className="absolute inset-0" />
        <span className="absolute bottom-3 left-3 text-[11px] font-bold uppercase tracking-[0.18em] text-orange-soft">
          {course.delivery} · {course.duration}
        </span>
      </div>
      <div className="flex flex-1 flex-col border border-t-0 border-navy/10 bg-[#F5F5F5] p-4 text-ink sm:p-6">
        <h3 className="font-[family-name:var(--font-display)] text-base font-semibold leading-snug text-navy group-hover:text-blue sm:text-lg">
          {course.title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
          {course.description.slice(0, 110)}…
        </p>
        <div className="mt-6 flex items-center justify-between border-t border-navy/8 pt-4 text-sm">
          <span className="font-semibold text-navy">{course.fee}</span>
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-orange">
            Pay to join →
          </span>
        </div>
      </div>
    </button>
  );
}
