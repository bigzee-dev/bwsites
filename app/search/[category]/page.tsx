import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SearchShell } from "@/components/client/search-shell";
import { SearchResults } from "@/components/search-results";
import { getCategories, getCategoryBySlug } from "@/lib/client/categories";
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

  const [categories, sites] = await Promise.all([
    getCategories(),
    searchSites("", category.id),
  ]);

  return (
    <SearchShell categories={categories} activeSlug={categorySlug}>
      <SearchResults sites={sites} heading={category.name} />
    </SearchShell>
  );
}
