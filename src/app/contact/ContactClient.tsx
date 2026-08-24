"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Aurora, FloatCard, Magnetic, Reveal } from "@/components/motion";
import { site } from "@/data/content";

export default function ContactClient() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <>
      <PageHero
        title="Speak with the PVL team"
        description="Whether you are an individual learner or an organization looking to train a cohort, we are ready to help."
        image="/images/about-ppe.png"
      />

      <section className="bg-sand">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[1fr_1.1fr] md:px-8 md:py-28">
          <div>
            <Reveal>
              <SectionHeading
                eyebrow="Get in touch"
                title="We respond within 1–2 business days"
              />
            </Reveal>
            <ul className="mt-10 space-y-4 text-sm">
              {[
                { label: "Email", content: site.email, href: `mailto:${site.email}` },
                {
                  label: "Phone",
                  content: site.phone,
                  href: `tel:${site.phone.replace(/\s/g, "")}`,
                },
                {
                  label: "WhatsApp",
                  content: "Message us on WhatsApp",
                  href: `https://wa.me/${site.whatsapp.replace("+", "")}`,
                },
                { label: "Location", content: site.address },
              ].map((item, i) => (
                <Reveal key={item.label} delay={0.08 * i}>
                  <li className="border border-navy/8 bg-white p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-orange">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="mt-1 block font-medium text-navy hover:text-blue"
                      >
                        {item.content}
                      </a>
                    ) : (
                      <p className="mt-1 font-medium text-navy">{item.content}</p>
                    )}
                  </li>
                </Reveal>
              ))}
            </ul>
            <Reveal delay={0.3}>
              <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold">
                <a href={site.social.linkedin} className="text-blue hover:text-orange">
                  LinkedIn
                </a>
                <a href={site.social.facebook} className="text-blue hover:text-orange">
                  Facebook
                </a>
                <a href={site.social.youtube} className="text-blue hover:text-orange">
                  YouTube
                </a>
              </div>
            </Reveal>
          </div>

          <FloatCard delay={0.15}>
            <div className="bg-white p-6 shadow-[0_24px_60px_-36px_rgba(10,39,72,0.5)] md:p-8">
              {sent ? (
                <div className="py-10 text-center">
                  <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-navy">
                    Message received
                  </h3>
                  <p className="mt-2 text-sm text-muted">
                    Thank you. Our team will follow up shortly.
                  </p>
                  <div className="mt-6 flex justify-center">
                    <Magnetic>
                      <Button href="/courses" variant="orange">
                        Browse courses
                      </Button>
                    </Magnetic>
                  </div>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4">
                  <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-navy">
                    Send a message
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm">
                      <span className="mb-1.5 block font-medium text-navy">Name</span>
                      <input
                        required
                        name="name"
                        className="w-full border border-navy/10 px-3 py-2.5 outline-none transition focus:border-orange"
                      />
                    </label>
                    <label className="block text-sm">
                      <span className="mb-1.5 block font-medium text-navy">Email</span>
                      <input
                        required
                        type="email"
                        name="email"
                        className="w-full border border-navy/10 px-3 py-2.5 outline-none transition focus:border-orange"
                      />
                    </label>
                  </div>
                  <label className="block text-sm">
                    <span className="mb-1.5 block font-medium text-navy">Subject</span>
                    <input
                      required
                      name="subject"
                      className="w-full border border-navy/10 px-3 py-2.5 outline-none transition focus:border-orange"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1.5 block font-medium text-navy">Message</span>
                    <textarea
                      required
                      name="message"
                      rows={5}
                      className="w-full border border-navy/10 px-3 py-2.5 outline-none transition focus:border-orange"
                    />
                  </label>
                  <button
                    type="submit"
                    className="w-full bg-orange px-5 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-orange-soft"
                  >
                    Send message
                  </button>
                </form>
              )}
            </div>
          </FloatCard>
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy">
        <Aurora />
        <div className="relative mx-auto max-w-7xl px-5 py-10 md:px-8">
          <Reveal>
            <div className="overflow-hidden border border-white/10 bg-white/5">
              <iframe
                title="Map — Accra, Ghana"
                src="https://maps.google.com/maps?q=Accra%20Ghana&t=&z=12&ie=UTF8&iwloc=&output=embed"
                className="h-72 w-full grayscale-[30%] contrast-125"
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
