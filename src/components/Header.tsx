"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/data/content";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = !isHome || scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition duration-300 ${
        solid
          ? "border-b border-navy/10 bg-white/95 text-navy backdrop-blur-md"
          : "bg-transparent text-white"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Link href="/" className="group flex shrink-0 items-center">
          <Image
            src="/images/Logo.png"
            alt={site.name}
            width={200}
            height={52}
            className={`h-9 w-auto object-contain transition duration-300 md:h-11 ${
              solid ? "" : "brightness-0 invert"
            }`}
            priority
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.filter((l) => l.href !== "/").map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-[13px] font-medium tracking-wide transition ${
                  active
                    ? solid
                      ? "text-orange"
                      : "text-orange-soft"
                    : solid
                      ? "text-ink/70 hover:text-navy"
                      : "text-white/75 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={`tel:${site.phone.replace(/\s/g, "")}`}
            className={`text-xs font-medium ${solid ? "text-muted" : "text-white/70"}`}
          >
            {site.phone}
          </a>
          <Link
            href="/courses"
            className="bg-orange px-4 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-orange-soft"
          >
            Enroll
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          className={`inline-flex h-10 w-10 items-center justify-center lg:hidden ${
            solid ? "text-navy" : "text-white"
          }`}
          onClick={() => setOpen((v) => !v)}
        >
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-5 bg-current transition ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-current transition ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-current transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </div>

      {open ? (
        <div className="border-t border-navy/10 bg-white px-5 py-6 text-navy lg:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-3 font-[family-name:var(--font-display)] text-lg font-semibold"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
