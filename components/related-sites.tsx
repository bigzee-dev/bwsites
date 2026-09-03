import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon } from "lucide-react";

import { getRelatedSites, type SiteWithCategories } from "@/lib/client/sites";
import { categoryHref } from "@/lib/slug";

/** Bare domain for the card eyebrow; admin-entered urls are not always valid. */
function hostnameOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

type RelatedSitesProps = {
  site: Pick<SiteWithCategories, "id" | "name" | "categories">;
};

export async function RelatedSites({ site }: RelatedSitesProps) {
  const related = await getRelatedSites(site);

  if (related.length === 0) return null;

  const primaryCategory = site.categories[0];

  return (
    <section
      aria-labelledby="related-sites-heading"
      className="mt-16 border-t border-ink-200/70 pt-10 dark:border-ink-800"
    >
      {/* Masthead */}
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-500 dark:text-ink-300">
            Keep Browsing
          </p>
          <h2
            id="related-sites-heading"
            className="mt-3 flex items-center gap-4 font-heading text-2xl font-bold text-brand-blue-900 sm:text-3xl dark:text-brand-blue-300"
          >
            <span
              aria-hidden
              className="hidden h-7 w-1 shrink-0 rounded bg-brand-yellow-light sm:block"
            />
            Related Sites
          </h2>
        </div>

        {primaryCategory && (
          <Link
            href={categoryHref(primaryCategory.name)}
            className="group inline-flex items-center gap-2 border-b border-ink-300 pb-1 font-sans text-[12px] uppercase tracking-[0.2em] text-ink-700 transition-colors hover:border-brand-yellow-light hover:text-brand-blue-900 dark:border-ink-700 dark:text-ink-200 dark:hover:text-brand-yellow-light"
          >
            More in {primaryCategory.name}
            <ArrowRightIcon
              aria-hidden
              className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        )}
      </div>

      {/* Rule-lined index of four */}
      <ul className="mt-8 grid grid-cols-1 gap-2 border-t border-l border-ink-200/70 sm:grid-cols-2 lg:grid-cols-4 dark:border-ink-800">
        {related.map((relatedSite, index) => {
          const domain = hostnameOf(relatedSite.url);

          return (
            <li
              key={relatedSite.id}
              className="group relative animate-in border-r border-b border-ink-200/70 fade-in slide-in-from-bottom-2 duration-500 dark:border-ink-800 dark:bg-ink-900"
              style={{
                animationDelay: `${index * 60}ms`,
                animationFillMode: "backwards",
              }}
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 z-10 h-[3px] origin-left scale-x-0 bg-brand-yellow-light transition-transform duration-300 ease-out group-focus-within:scale-x-100 group-hover:scale-x-100"
              />

              <Link
                href={`/site/${relatedSite.slug}`}
                className="flex h-full flex-col outline-none transition-colors hover:bg-cream-100 focus-visible:bg-cream-100 dark:hover:bg-ink-900/70 dark:focus-visible:bg-ink-900/70"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={relatedSite.image}
                    alt={relatedSite.name}
                    className="aspect-16/9 w-full object-cover grayscale-[35%] transition duration-500 ease-out group-hover:scale-[1.03] group-hover:grayscale-0 group-focus-visible:grayscale-0"
                  />
                  <span
                    aria-hidden
                    className="absolute bottom-0 left-0 bg-cream-50 px-2 py-1 font-mono text-[11px] tabular-nums text-ink-500 dark:bg-ink-950 dark:text-ink-300"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-2 px-4 py-4">
                  {domain && (
                    <span className="truncate font-mono text-[10px] tracking-[0.18em] text-ink-500 dark:text-ink-400">
                      {domain}
                    </span>
                  )}

                  <span className="flex items-start justify-between gap-2">
                    <span className="font-heading text-[15px] leading-snug font-semibold text-brand-blue-900 dark:text-ink-100">
                      {relatedSite.name}
                    </span>
                    <ArrowUpRightIcon
                      aria-hidden
                      className="mt-0.5 size-4 shrink-0 translate-y-1 text-ink-400 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 dark:text-ink-300"
                    />
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
