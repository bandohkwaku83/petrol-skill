import { HomeClient } from "@/app/HomeClient";
import { getPublishedOrEmpty } from "@/lib/site-db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { courses } = await getPublishedOrEmpty();
  return <HomeClient courses={courses} />;
}
