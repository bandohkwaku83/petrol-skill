import Image from "next/image";

export function BrandLogo({
  tone = "color",
  priority = false,
}: {
  tone?: "color" | "light";
  priority?: boolean;
}) {
  return (
    <span className="relative block h-11 w-[5.4rem] overflow-hidden md:h-[3.25rem] md:w-[6.35rem]">
      <Image
        src="/images/Logo.png"
        alt=""
        fill
        priority={priority}
        sizes="102px"
        className={`object-cover object-[center_41.5%] ${tone === "light" ? "brightness-0 invert" : ""}`}
      />
    </span>
  );
}
