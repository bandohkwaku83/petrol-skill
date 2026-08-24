"use client";

import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { FloatCard, Reveal, TextMarquee } from "@/components/motion";
import { gallery } from "@/data/content";

export default function GalleryPage() {
  const categories = [...new Set(gallery.map((g) => g.category))];

  return (
    <>
      <PageHero
        title="Inside PVL — sessions, speakers, and celebrations"
        description="A look at training sessions, workshops, guest speakers, graduations, and behind-the-scenes moments."
        image="/images/group-01.jpg"
      />

      <TextMarquee items={categories} />

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <SectionHeading eyebrow="Media" title="Moments from our community" />
          </Reveal>
          <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3">
            {gallery.map((item, i) => (
              <FloatCard key={item.title} delay={0.05 * i} className="mb-5 break-inside-avoid">
                <figure className="overflow-hidden border border-navy/8 bg-sand">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition duration-700 hover:scale-110"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                  </div>
                  <figcaption className="p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-orange">
                      {item.category}
                    </p>
                    <p className="mt-1 font-[family-name:var(--font-display)] text-sm font-semibold text-navy">
                      {item.title}
                    </p>
                  </figcaption>
                </figure>
              </FloatCard>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
