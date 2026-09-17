import type { Metadata } from "next";

import { SearchResults } from "@/components/search-results";
import { logSearchQuery } from "@/lib/client/search-query-actions";
import { searchSites } from "@/lib/client/sites";

type SearchPageProps = {
  searchParams: Promise<{ q?: string; page?: string }>;
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
  const { q, page } = await searchParams;
  const query = q?.trim() ?? "";
  const currentPage = Number.parseInt(page ?? "1", 10);

  if (query) {
    await logSearchQuery(query);
  }

  const sites = await searchSites(query);
  const heading = query ? `Results for "${query}"` : "All sites";

  return (
    <SearchResults
      sites={sites}
      heading={heading}
      page={Number.isNaN(currentPage) ? 1 : currentPage}
      basePath="/search"
      params={{ q: query || undefined }}
    />
  );
}
