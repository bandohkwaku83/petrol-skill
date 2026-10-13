import { notFound } from "next/navigation";
import { news } from "@/data/content";
import { getPublished } from "@/lib/site-db";
import { NewsDetailClient } from "./NewsDetailClient";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

async function articles() {
  try {
    return (await getPublished()).news;
  } catch {
    return news;
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const item = (await articles()).find((n) => n.slug === slug);
  return { title: item?.title ?? "News" };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = (await articles()).find((n) => n.slug === slug);
  if (!item) notFound();
  return <NewsDetailClient item={item} />;
}
