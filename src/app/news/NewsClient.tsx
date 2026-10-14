"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { FloatCard, Reveal } from "@/components/motion";
import { news } from "@/data/content";

export function NewsClient({ articles }: { articles: typeof news }) {
  const categories = useMemo(
    () => ["All", ...new Set(articles.map((item) => item.category))],
    [articles],
  );
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = articles.filter((item) => {
    const matchesCategory = category === "All" || item.category === category;
    const haystack = `${item.title} ${item.excerpt} ${item.content} ${item.category}`.toLowerCase();
    const matchesQuery = haystack.includes(query.trim().toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const showFeatured = query.trim() === "" && category === "All" && filtered.length > 0;

  return (
    <>
      <PageHero
        title="Announcements, stories, and industry learning notes"
        description="Course openings, internship updates, industry notes, partnerships, success stories, event recaps, and speaker spotlights."
        image="/images/why-pvl-team.jpg"
      />

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <SectionHeading
              eyebrow="Latest"
              title="From the PVL desk"
              description="Search by keyword or filter by the kind of update you need."
            />
          </Reveal>

          <div className="mt-10 flex flex-col gap-4">
            <label className="block max-w-md text-sm">
              <span className="sr-only">Search news</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search announcements"
                className="w-full border border-navy/10 bg-sand px-4 py-3 text-sm text-navy outline-none transition focus:border-orange"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((item) => {
                const active = item === category;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] transition ${
                      active
                        ? "bg-navy text-white"
                        : "border border-navy/10 bg-white text-navy hover:border-orange/40"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {articles.length === 0 ? (
            <p className="mt-12 text-sm text-muted">No announcements are posted right now.</p>
          ) : filtered.length === 0 ? (
            <p className="mt-12 text-sm text-muted">
              Nothing matches that search. Try another keyword or category.
            </p>
          ) : showFeatured ? (
            <div className="mt-12 grid gap-6 lg:grid-cols-12">
              <FloatCard className="lg:col-span-7">
                <Link
                  href={`/news/${filtered[0].slug}`}
                  className="group relative block min-h-[440px] overflow-hidden"
                >
                  <Image
                    src={filtered[0].image}
                    alt={filtered[0].title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width:1024px) 100vw, 60vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-soft">
                      {filtered[0].category} · {filtered[0].date}
                    </p>
                    <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold md:text-4xl">
                      {filtered[0].title}
                    </h2>
                  </div>
                </Link>
              </FloatCard>
              <div className="flex flex-col gap-6 lg:col-span-5">
                {filtered.slice(1, 3).map((item, i) => (
                  <FloatCard key={item.slug} delay={0.1 * (i + 1)} className="flex-1">
                    <NewsRow item={item} />
                  </FloatCard>
                ))}
              </div>
              {filtered.length > 3 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:col-span-12 lg:grid-cols-3">
                  {filtered.slice(3).map((item, i) => (
                    <FloatCard key={item.slug} delay={0.05 * i}>
                      <NewsCard item={item} />
                    </FloatCard>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item, i) => (
                <FloatCard key={item.slug} delay={0.05 * i}>
                  <NewsCard item={item} />
                </FloatCard>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function NewsRow({
  item,
}: {
  item: (typeof news)[number];
}) {
  return (
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
  );
}

function NewsCard({ item }: { item: (typeof news)[number] }) {
  return (
    <Link href={`/news/${item.slug}`} className="group block h-full border border-navy/10 bg-sand">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={item.image}
          alt=""
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width:768px) 100vw, 33vw"
        />
      </div>
      <div className="p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-orange">
          {item.category}
        </p>
        <h3 className="mt-2 font-[family-name:var(--font-display)] text-lg font-semibold text-navy group-hover:text-blue">
          {item.title}
        </h3>
        <p className="mt-2 text-sm text-muted">{item.excerpt}</p>
        <p className="mt-3 text-xs text-muted">{item.date}</p>
      </div>
    </Link>
  );
}
