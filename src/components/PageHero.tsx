"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Aurora, Reveal } from "@/components/motion";

export function PageHero({
  title,
  description,
  image,
  actions,
}: {
  title: string;
  description?: string;
  image: string;
  actions?: ReactNode;
}) {
  return (
    <section className="grain relative flex min-h-[78vh] items-end overflow-hidden text-white">
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={image}
            alt=""
            fill
            priority
            className="ken-burns object-cover object-[center_18%]"
            sizes="100vw"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/70 via-transparent to-transparent" />
        <Aurora />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-36 md:px-8 md:pb-20">
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="max-w-4xl font-[family-name:var(--font-display)] text-[clamp(2.4rem,5.5vw,4.5rem)] font-semibold leading-[1.02] tracking-tight"
          >
            {title}
          </motion.h1>
        </div>

        {description ? (
          <Reveal delay={0.35} y={24}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
              {description}
            </p>
          </Reveal>
        ) : null}

        {actions ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            {actions}
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
