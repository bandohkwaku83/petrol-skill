import type { Metadata } from "next";
import { EnrollClient } from "./EnrollClient";

export const metadata: Metadata = { title: "Enroll" };

export default function EnrollPage() {
  return <EnrollClient />;
}
