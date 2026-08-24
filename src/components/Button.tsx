import Link from "next/link";
import { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "orange" | "line";

const styles: Record<Variant, string> = {
  primary: "bg-navy text-white hover:bg-blue",
  secondary: "bg-white/10 text-white ring-1 ring-white/40 hover:bg-white hover:text-navy",
  ghost: "bg-transparent text-navy ring-1 ring-navy/20 hover:ring-navy/50",
  orange: "bg-orange text-white hover:bg-orange-soft",
  line: "bg-transparent text-white underline-offset-4 hover:underline",
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
}) {
  const classes = `inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] transition duration-300 ${styles[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
