"use client";

import {
  motion,
  useInView,
  useReducedMotion,
  Variants,
} from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 40,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.85, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

export function SplitHeadline({
  lines,
  className = "",
  glowWord,
}: {
  lines: string[];
  className?: string;
  glowWord?: string;
}) {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const child: Variants = {
    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: "115%" },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.95, ease },
    },
  };

  return (
    <motion.h1
      className={className}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {lines.map((line) => (
        <span key={line} className="block overflow-hidden pb-1">
          <motion.span variants={child} className="block">
            {line.split(" ").map((word, i) => {
              const clean = word.replace(/[.,!—]/g, "");
              const isGlow = glowWord && clean === glowWord;
              return (
                <span key={`${word}-${i}`} className="inline-block">
                  {isGlow ? (
                    <span className="relative inline-block">
                      <span className="relative z-10 text-orange-soft">{word}</span>
                      <span
                        aria-hidden
                        className="glow-blob absolute -inset-x-3 -bottom-2 top-1/3 -z-0"
                      />
                    </span>
                  ) : (
                    word
                  )}
                  {i < line.split(" ").length - 1 ? "\u00A0" : null}
                </span>
              );
            })}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  );
}

export function CountUp({
  value,
  label,
  variant = "dark",
  large = false,
  compact = false,
}: {
  value: string;
  label: string;
  variant?: "dark" | "light";
  large?: boolean;
  compact?: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const numeric = parseFloat(value.replace(/[^0-9.]/g, ""));
  const suffix = value.replace(/[0-9.,]/g, "");
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setN(numeric);
      return;
    }
    let frame: number;
    const start = performance.now();
    const duration = 1600;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setN(Math.round(numeric * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, numeric, reduce]);

  const numberClass =
    variant === "light"
      ? "text-navy"
      : "text-white";
  const labelClass =
    variant === "light"
      ? "text-muted"
      : "text-white/55";

  return (
    <div ref={ref}>
      <p
        className={`stat-number font-[family-name:var(--font-display)] font-semibold tracking-tight ${numberClass} ${
          large
            ? "text-6xl md:text-7xl"
            : compact
              ? "text-2xl md:text-3xl"
              : "text-4xl md:text-5xl"
        }`}
      >
        {n.toLocaleString()}
        {suffix}
      </p>
      <p className={`${compact ? "mt-1 text-xs" : "mt-2 text-sm"} font-medium ${labelClass}`}>
        {label}
      </p>
    </div>
  );
}

export function TextMarquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-white/10 bg-navy py-4 text-white">
      <motion.div
        className="flex w-max gap-10 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
      >
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-10 font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-[0.22em] text-white/70"
          >
            {item}
            <span className="text-orange">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function Aurora() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -left-1/4 top-[-10%] h-[60%] w-[70%] rounded-full bg-sky/35 blur-[100px]"
        animate={{ x: [0, 40, -20, 0], y: [0, 30, 10, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-1/4 top-1/4 h-[50%] w-[55%] rounded-full bg-orange/30 blur-[110px]"
        animate={{ x: [0, -50, 20, 0], y: [0, -20, 40, 0], scale: [1, 1.15, 1, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-10%] left-1/3 h-[40%] w-[40%] rounded-full bg-blue/45 blur-[90px]"
        animate={{ x: [0, 30, -30, 0], opacity: [0.35, 0.7, 0.45, 0.35] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export function Magnetic({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.045 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 22 }}
    >
      {children}
    </motion.div>
  );
}

export function FloatCard({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.8, delay, ease }}
      whileHover={{ y: -8 }}
    >
      {children}
    </motion.div>
  );
}
