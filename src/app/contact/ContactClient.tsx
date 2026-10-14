"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Aurora, FloatCard, Magnetic, Reveal } from "@/components/motion";
import { site } from "@/data/content";

function ContactGlyph({ name }: { name: "mail" | "phone" | "whatsapp" | "pin" }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    className: "h-5 w-5 shrink-0 text-black",
    "aria-hidden": true,
  };

  if (name === "mail") {
    return (
      <svg {...common}>
        <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
        <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
      </svg>
    );
  }

  if (name === "phone") {
    return (
      <svg {...common}>
        <path
          fillRule="evenodd"
          d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  if (name === "whatsapp") {
    return (
      <svg {...common}>
        <path d="M12 2.4a8.8 8.8 0 00-7.6 13.2L3 21.2l5.7-1.5A8.8 8.8 0 1012 2.4z" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path
        fillRule="evenodd"
        d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.018 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
        clipRule="evenodd"
      />
    </svg>
  );
}

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
                {
                  label: "Email",
                  content: site.email,
                  href: `mailto:${site.email}`,
                  icon: "mail" as const,
                },
                {
                  label: "Phone",
                  content: site.phone,
                  href: `tel:${site.phone.replace(/\s/g, "")}`,
                  icon: "phone" as const,
                },
                {
                  label: "WhatsApp",
                  content: "Join the WhatsApp community",
                  href: site.social.whatsapp,
                  icon: "whatsapp" as const,
                },
                { label: "Location", content: site.address, icon: "pin" as const },
              ].map((item, i) => (
                <Reveal key={item.label} delay={0.08 * i}>
                  <li className="flex items-center gap-4 border border-navy/8 bg-white p-4">
                    <ContactGlyph name={item.icon} />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-orange">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="mt-1 block break-words font-medium text-navy hover:text-blue"
                        >
                          {item.content}
                        </a>
                      ) : (
                        <p className="mt-1 font-medium text-navy">{item.content}</p>
                      )}
                    </div>
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
                <a href={site.social.twitter} className="text-blue hover:text-orange">
                  X
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
