import type { Metadata } from "next";
import ContactPage from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact",
};

export default function Page() {
  return <ContactPage />;
}
