import "server-only";
import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/prisma";

export const getSites = unstable_cache(
  async function getSites() {
    return prisma.site.findMany({
      include: { categories: true },
      orderBy: { createdAt: "desc" },
    });
  },
  ["sites"],
  { tags: ["sites"], revalidate: 300 },
);

export type SiteWithCategories = Awaited<ReturnType<typeof getSites>>[number];

export const getSiteBySlug = unstable_cache(
  async function getSiteBySlug(slug: string) {
    return prisma.site.findFirst({
      where: { slug },
      include: { categories: true },
    });
  },
  ["site-by-slug"],
  { tags: ["sites"], revalidate: 300 },
);

export const searchSites = unstable_cache(
  async function searchSites(query: string = "", categoryId?: string) {
    const sites = await prisma.site.findMany({
      where: categoryId
        ? { categories: { some: { id: categoryId } } }
        : undefined,
      include: { categories: true },
      orderBy: [{ rank: "desc" }, { name: "asc" }],
    });

    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return sites;

    return sites.filter((site) => {
      if (site.name.toLowerCase().includes(trimmed)) return true;
      if (site.tags.some((tag) => tag.toLowerCase().includes(trimmed)))
        return true;
      if (
        site.categories.some((category) =>
          category.name.toLowerCase().includes(trimmed),
        )
      ) {
        return true;
      }
      return false;
    });
  },
  ["search-sites"],
  { tags: ["sites"], revalidate: 300 },
);

const getRelatedSiteCandidates = unstable_cache(
  async function getRelatedSiteCandidates(siteId: string, categoryId: string) {
    return prisma.site.findMany({
      where: {
        id: { not: siteId },
        categories: { some: { id: categoryId } },
      },
      include: { categories: true },
      orderBy: { name: "asc" },
    });
  },
  ["related-site-candidates"],
  { tags: ["sites", "categories"], revalidate: 300 },
);

function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Sites drawn at random from the given site's primary category - the first one
 * the admin attached, which is also the one shown in the breadcrumb. Sites in
 * the other categories are deliberately excluded.
 *
 * The candidate query is cached; the shuffle runs per render so the selection
 * changes on every visit.
 */
export async function getRelatedSites(
  site: Pick<SiteWithCategories, "id" | "categories">,
  limit = 4,
) {
  const primaryCategory = site.categories[0];
  if (!primaryCategory) return [];

  const candidates = await getRelatedSiteCandidates(
    site.id,
    primaryCategory.id,
  );

  return shuffle(candidates).slice(0, limit);
}
