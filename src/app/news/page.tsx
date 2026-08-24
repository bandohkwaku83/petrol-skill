"use client";

import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { FloatCard, Reveal } from "@/components/motion";
import { news } from "@/data/content";

export default function NewsPage() {
  return (
    <>
      <PageHero
        title="Announcements, stories, and industry learning notes"
        description="Course openings, internship updates, partnerships, success stories, and event recaps."
        image="/images/group-02.jpg"
      />

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <SectionHeading eyebrow="Latest" title="From the PVL desk" />
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-12">
            <FloatCard className="lg:col-span-7">
              <Link
                href={`/news/${news[0].slug}`}
                className="group relative block min-h-[440px] overflow-hidden"
              >
                <Image
                  src={news[0].image}
                  alt={news[0].title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width:1024px) 100vw, 60vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-soft">
                    {news[0].category} · {news[0].date}
                  </p>
                  <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold md:text-4xl">
                    {news[0].title}
                  </h2>
                </div>
              </Link>
            </FloatCard>
            <div className="flex flex-col gap-6 lg:col-span-5">
              {news.slice(1).map((item, i) => (
                <FloatCard key={item.slug} delay={0.1 * (i + 1)} className="flex-1">
                  <Link
                    href={`/news/${item.slug}`}
                    className="group flex h-full overflow-hidden border border-navy/10 bg-sand"
                  >
                    <div className="relative w-2/5 min-h-[160px]">
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="200px"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-center p-5">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-orange">
                        {item.category}
                      </p>
                      <h3 className="mt-2 font-[family-name:var(--font-display)] text-lg font-semibold text-navy group-hover:text-blue">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-xs text-muted">{item.date}</p>
                    </div>
                  </Link>
                </FloatCard>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
