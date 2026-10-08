"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) {
    return <div className="flex min-h-full flex-1 flex-col">{children}</div>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
