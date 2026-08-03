import type { Metadata } from "next";

import { SearchResults } from "@/components/search-results";
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

  const sites = await searchSites(query);
  const heading = query ? `Results for "${query}"` : "All sites";

  return <SearchResults sites={sites} heading={heading} />;
}
