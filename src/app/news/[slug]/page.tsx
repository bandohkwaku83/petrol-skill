import { notFound } from "next/navigation";
import { news } from "@/data/content";
import { NewsDetailClient } from "./NewsDetailClient";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const item = news.find((n) => n.slug === slug);
  return { title: item?.title ?? "News" };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = news.find((n) => n.slug === slug);
  if (!item) notFound();
  return <NewsDetailClient item={item} />;
}
