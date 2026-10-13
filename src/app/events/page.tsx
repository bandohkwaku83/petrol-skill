"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { FloatCard, Magnetic, Reveal } from "@/components/motion";
import { events, site } from "@/data/content";

export default function EventsPage() {
  const [eventList, setEventList] = useState(events);
  const upcoming = eventList.filter((e) => e.status === "upcoming");
  const previous = eventList.filter((e) => e.status === "previous");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/catalog")
      .then((response) => response.json())
      .then((data: { ok?: boolean; catalog?: { events?: typeof events } }) => {
        if (!cancelled && data.ok && Array.isArray(data.catalog?.events)) setEventList(data.catalog.events);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <PageHero
        title="Webinars, workshops, and community gatherings"
        description="Join live sessions that complement our courses — or catch recaps from previous events."
        image="/images/hero-ppe-full.png"
      />

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <SectionHeading eyebrow="Upcoming" title="Register for the next session" />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {upcoming.map((event, i) => (
              <FloatCard key={event.title} delay={0.1 * i}>
                <article className="flex h-full flex-col border border-navy/8 bg-sand p-6 md:p-8">
                  <div className="flex items-center justify-between gap-3">
                    <span className="bg-orange/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-orange">
                      {event.type}
                    </span>
                    <span className="text-xs font-medium text-muted">
                      {event.date} · {event.time}
                    </span>
                  </div>
                  <h3 className="mt-5 font-[family-name:var(--font-display)] text-2xl font-semibold text-navy">
                    {event.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm text-muted">{event.description}</p>
                  <div className="mt-6">
                    <Magnetic>
                      <Button href={site.registrationForm} variant="orange" external>
                        Register
                      </Button>
                    </Magnetic>
                  </div>
                </article>
              </FloatCard>
            ))}
          </div>

          <div className="mt-20">
            <Reveal>
              <SectionHeading eyebrow="Previous" title="Recent events" />
            </Reveal>
            <div className="mt-10 space-y-4">
              {previous.map((event, i) => (
                <Reveal key={event.title} delay={0.08 * i}>
                  <article className="border border-navy/8 bg-white px-5 py-5 transition hover:border-orange/30 md:flex md:items-center md:justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
                        {event.type} · {event.date}
                      </p>
                      <h3 className="mt-2 font-[family-name:var(--font-display)] text-lg font-semibold text-navy">
                        {event.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted">{event.description}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
