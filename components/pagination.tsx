import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

function buildHref(
  basePath: string,
  params: Record<string, string | undefined>,
  page: number,
) {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }

  if (page > 1) search.set("page", String(page));

  const queryString = search.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}

/** Page numbers to render, with `null` marking a gap. */
function pageRange(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: (number | null)[] = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) pages.push(null);
  for (let page = start; page <= end; page++) pages.push(page);
  if (end < totalPages - 1) pages.push(null);

  pages.push(totalPages);
  return pages;
}

const linkClasses =
  "inline-flex h-9 min-w-9 items-center justify-center gap-1 rounded-lg border border-border bg-background px-3 font-mono text-sm text-foreground transition-colors hover:border-brand-blue-700 hover:text-brand-blue-900 dark:bg-input/30 dark:hover:border-brand-yellow-light dark:hover:text-brand-yellow-light";

const disabledClasses =
  "inline-flex h-9 min-w-9 items-center justify-center gap-1 rounded-lg border border-border px-3 font-mono text-sm text-muted-foreground opacity-50";

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  params = {},
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
  params?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const href = (page: number) => buildHref(basePath, params, page);

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex items-center justify-center gap-1.5 sm:gap-2"
    >
      {currentPage > 1 ? (
        <Link
          href={href(currentPage - 1)}
          rel="prev"
          aria-label="Previous page"
          className={linkClasses}
        >
          <ChevronLeft aria-hidden className="size-4" />
          <span className="hidden sm:inline">Previous</span>
        </Link>
      ) : (
        <span aria-hidden className={disabledClasses}>
          <ChevronLeft className="size-4" />
          <span className="hidden sm:inline">Previous</span>
        </span>
      )}

      {pageRange(currentPage, totalPages).map((page, index) =>
        page === null ? (
          <span
            key={`gap-${index}`}
            aria-hidden
            className="px-1 font-mono text-sm text-muted-foreground"
          >
            …
          </span>
        ) : (
          <Link
            key={page}
            href={href(page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
            className={cn(
              linkClasses,
              page === currentPage &&
                "border-transparent bg-brand-blue-900 text-white hover:border-transparent hover:text-white dark:bg-brand-yellow-dark dark:text-ink-950 dark:hover:text-ink-950",
            )}
          >
            {page}
          </Link>
        ),
      )}

      {currentPage < totalPages ? (
        <Link
          href={href(currentPage + 1)}
          rel="next"
          aria-label="Next page"
          className={linkClasses}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight aria-hidden className="size-4" />
        </Link>
      ) : (
        <span aria-hidden className={disabledClasses}>
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
