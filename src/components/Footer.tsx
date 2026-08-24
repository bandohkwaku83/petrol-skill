import Image from "next/image";
import Link from "next/link";
import { navLinks, site } from "@/data/content";

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-2 md:px-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Image
            src="/images/Logo.png"
            alt={site.name}
            width={220}
            height={60}
            className="h-12 w-auto object-contain brightness-0 invert"
          />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/60">
            Affordable live training for oil, gas, energy, and emerging technology
            professionals — worldwide.
          </p>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-orange-soft">
            Explore
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {navLinks.slice(1, 6).map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-orange-soft">
            Programs
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>
              <Link href="/courses" className="hover:text-white">
                Courses
              </Link>
            </li>
            <li>
              <Link href="/internship" className="hover:text-white">
                Internship
              </Link>
            </li>
            <li>
              <Link href="/waitlist" className="hover:text-white">
                Waitlist
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-white">
                Gallery
              </Link>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-orange-soft">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-white">
                {site.email}
              </a>
            </li>
            <li>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-white">
                {site.phone}
              </a>
            </li>
            <li>{site.address}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-5 text-xs text-white/40 md:px-8">
          <p>© {new Date().getFullYear()} PetroSkill Virtual Learning</p>
        </div>
      </div>
    </footer>
  );
}
