import Image from "next/image";

export function CourseArt({ className = "" }: { className?: string }) {
  return (
    <div className={`overflow-hidden bg-[#F5F5F5] ${className}`}>
      <div className="relative h-full w-full">
        <Image
          src="/images/course-icon.jpg"
          alt=""
          fill
          className="object-contain mix-blend-multiply"
          sizes="(max-width: 768px) 100vw, 360px"
        />
      </div>
    </div>
  );
}
