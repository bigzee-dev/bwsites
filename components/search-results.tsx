import { Globe2 } from "lucide-react";

import { Pagination } from "@/components/pagination";
import { SiteCard } from "@/components/site-card";
import type { SiteWithCategories } from "@/lib/client/sites";

export const SITES_PER_PAGE = 30;

export function SearchResults({
  sites,
  heading,
  page = 1,
  basePath,
  params,
}: {
  sites: SiteWithCategories[];
  heading: string;
  page?: number;
  basePath: string;
  params?: Record<string, string | undefined>;
}) {
  const totalPages = Math.max(1, Math.ceil(sites.length / SITES_PER_PAGE));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * SITES_PER_PAGE;
  const visibleSites = sites.slice(start, start + SITES_PER_PAGE);

  return (
    <div>
      <div className="mb-6 flex flex-col  gap-4">
        <div className="flex items-center gap-4">
          <span
            aria-hidden
            className="hidden h-8 w-1 shrink-0 rounded bg-brand-yellow-dark sm:block"
          />
          <h1 className="font-heading text-2xl font-bold text-brand-blue-900 sm:text-3xl dark:text-brand-blue-300">
            {heading}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground font-mono">
          {sites.length} {sites.length === 1 ? "site" : "sites"} found
          {totalPages > 1 && ` · page ${currentPage} of ${totalPages}`}
        </p>
      </div>

      {sites.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
          <Globe2 className="size-8 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-foreground">
              No sites found
            </p>
            <p className="text-sm text-muted-foreground">
              Try a different search term or category.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {visibleSites.map((site) => (
              <SiteCard key={site.id} site={site} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath={basePath}
            params={params}
          />
        </>
      )}
    </div>
  );
}
