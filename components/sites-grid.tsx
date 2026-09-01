import { Globe2 } from "lucide-react";

import { SiteCard } from "@/components/site-card";
import { getCollectionByName } from "@/lib/client/collections";

export async function SitesGrid({ collection }: { collection: string }) {
  const data = await getCollectionByName(collection);
  const sites = data?.sites ?? [];

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
      <div className="max-w-7xl mx-auto pt-8">
        <h1 className="flex gap-4 items-center font-heading text-3xl font-bold dark:text-brand-blue-300 text-brand-blue-900 ">
          <span
            aria-hidden
            className="hidden h-8 w-1 shrink-0 rounded bg-brand-yellow-light sm:block"
          />
          {data?.name ?? collection}
        </h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 py-8">
          {sites.slice(0, 4).map((site) => (
            <SiteCard key={site.id} site={site} />
          ))}
        </div>
      </div>
    </div>
  );
}
