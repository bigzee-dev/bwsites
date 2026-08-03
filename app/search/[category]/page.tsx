import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SearchResults } from "@/components/search-results";
import { getCategoryBySlug } from "@/lib/client/categories";
import { searchSites } from "@/lib/client/sites";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);

  if (!category) return {};

  return {
    title: `${category.name} · BW Sites`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);

  if (!category) notFound();

  const sites = await searchSites("", category.id);

  return <SearchResults sites={sites} heading={category.name} />;
}
