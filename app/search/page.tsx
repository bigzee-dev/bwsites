import type { Metadata } from "next";

import { SearchShell } from "@/components/client/search-shell";
import { SearchResults } from "@/components/search-results";
import { getCategories } from "@/lib/client/categories";
import { logSearchQuery } from "@/lib/client/search-query-actions";
import { searchSites } from "@/lib/client/sites";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search results for "${q}" · BW Sites` : "Search · BW Sites",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  if (query) {
    await logSearchQuery(query);
  }

  const [categories, sites] = await Promise.all([
    getCategories(),
    searchSites(query),
  ]);

  const heading = query ? `Results for "${query}"` : "All sites";

  return (
    <SearchShell categories={categories}>
      <SearchResults sites={sites} heading={heading} />
    </SearchShell>
  );
}
