import { NewsClient } from "@/app/news/NewsClient";
import { getPublishedOrEmpty } from "@/lib/site-db";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const { news } = await getPublishedOrEmpty();
  return <NewsClient articles={news} />;
}
