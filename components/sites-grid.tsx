import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon, Globe2 } from "lucide-react";

import { SiteCard } from "@/components/site-card";
import {
  getCollectionByName,
  getCollectionByRank,
} from "@/lib/client/collections";
import { categoryHref } from "@/lib/slug";

type SitesGridProps =
  | { collection: string; rank?: never }
  | { rank: number; collection?: never };

export async function SitesGrid(props: SitesGridProps) {
  const data =
    props.rank !== undefined
      ? await getCollectionByRank(props.rank)
      : await getCollectionByName(props.collection);

  if (!data) return null;

  const sites = data.sites;
  const categoriesLink = data.categoriesLink;

  if (sites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
        <Globe2 className="size-8 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium text-foreground">No sites yet</p>
          <p className="text-sm text-muted-foreground">Check back soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream-50 dark:bg-ink-950">
      <div className="max-w-7xl mx-auto py-8">
        <h1 className="flex gap-4 items-center font-heading text-3xl font-bold dark:text-brand-blue-300 text-brand-blue-900 ">
          <span
            aria-hidden
            className="hidden h-8 w-1 shrink-0 rounded bg-brand-yellow-light sm:block"
          />
          {data.name}
        </h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 py-8">
          {sites.slice(0, 4).map((site) => (
            <SiteCard key={site.id} site={site} />
          ))}
        </div>
        {categoriesLink && (
          <div className="flex justify-center mt-2 pb-8">
            <a
              href={categoryHref(categoriesLink.name)}
              className="group inline-flex items-center gap-2 border-b border-ink-300 pb-1 font-sans font-medium text-[12px] uppercase tracking-[0.2em] text-ink-700 transition-colors hover:border-brand-yellow-light hover:text-brand-blue-900 dark:border-ink-700 dark:text-ink-200 dark:hover:text-brand-yellow-light"
            >
              See more {categoriesLink.name} sites
              <ArrowRightIcon
                aria-hidden
                className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
