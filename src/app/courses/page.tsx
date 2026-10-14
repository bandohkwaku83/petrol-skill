import { CoursesClient } from "@/app/courses/CoursesClient";
import { getPublishedOrEmpty } from "@/lib/site-db";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const { courses } = await getPublishedOrEmpty();
  return <CoursesClient courses={courses} />;
}
