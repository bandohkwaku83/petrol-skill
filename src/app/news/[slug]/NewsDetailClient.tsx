"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Magnetic, Reveal } from "@/components/motion";

type NewsItem = {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  image: string;
  content: string;
};

export function NewsDetailClient({ item }: { item: NewsItem }) {
  return (
    <article>
      <div className="grain relative min-h-[60vh] overflow-hidden bg-navy text-white">
        <Image
          src={item.image}
          alt=""
          fill
          className="ken-burns object-cover opacity-45"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/40" />
        <div className="relative mx-auto max-w-3xl px-5 py-28 md:px-8 md:py-36">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-orange-soft">
              {item.category} · {item.date}
            </p>
          </Reveal>
          <div className="mt-5 overflow-hidden">
            <Reveal delay={0.1}>
              <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold leading-tight md:text-5xl">
                {item.title}
              </h1>
            </Reveal>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
        <Reveal>
          <p className="text-lg leading-relaxed text-muted">{item.excerpt}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 text-base leading-relaxed text-ink">{item.content}</p>
        </Reveal>
        <Reveal delay={0.15} className="mt-10 flex flex-wrap gap-3">
          <Magnetic>
            <Button href="/news" variant="ghost">
              ← Back to news
            </Button>
          </Magnetic>
          <Magnetic>
            <Button href="/courses" variant="orange">
              Browse courses
            </Button>
          </Magnetic>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-8 text-sm text-muted">
            Looking for something specific?{" "}
            <Link href="/contact" className="font-semibold text-blue hover:text-orange">
              Contact our team
            </Link>
            .
          </p>
        </Reveal>
      </div>
    </article>
  );
}
