import type { Metadata } from "next";
import { Figtree, Unbounded } from "next/font/google";
import { SiteFrame } from "@/components/SiteFrame";
import { site } from "@/data/content";
import "./globals.css";

const body = Figtree({
  variable: "--font-body",
  subsets: ["latin"],
});

const display = Unbounded({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} | Live Energy Training`,
    template: `%s | ${site.shortName}`,
  },
  description:
    "PetroSkill Virtual Learning delivers affordable, live instructor-led professional training for oil, gas, energy, and emerging technology careers.",
  metadataBase: new URL("https://petroskillvirtuallearning.com"),
  icons: {
    icon: "/images/favicon.png",
    shortcut: "/images/favicon.png",
    apple: "/images/favicon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-background text-ink antialiased">
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
