import "server-only";
import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/prisma";
import { inCategory, siteCategoriesInclude, withCategories } from "@/lib/site-categories";

export const getSites = unstable_cache(
  async function getSites() {
    const sites = await prisma.site.findMany({
      include: siteCategoriesInclude,
      orderBy: { createdAt: "desc" },
    });
    return sites.map(withCategories);
  },
  ["sites"],
  { tags: ["sites"], revalidate: 300 },
);

export type SiteWithCategories = Awaited<ReturnType<typeof getSites>>[number];

export const getSiteBySlug = unstable_cache(
  async function getSiteBySlug(slug: string) {
    const site = await prisma.site.findFirst({
      where: { slug },
      include: siteCategoriesInclude,
    });
    return site && withCategories(site);
  },
  ["site-by-slug"],
  { tags: ["sites"], revalidate: 300 },
);

export const searchSites = unstable_cache(
  async function searchSites(query: string = "", categoryId?: string) {
    const sites = (
      await prisma.site.findMany({
        where: categoryId ? inCategory(categoryId) : undefined,
        include: siteCategoriesInclude,
        orderBy: [{ rank: "desc" }, { name: "asc" }],
      })
    ).map(withCategories);

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
    const sites = await prisma.site.findMany({
      where: { id: { not: siteId }, ...inCategory(categoryId) },
      include: siteCategoriesInclude,
      orderBy: { name: "asc" },
    });
    return sites.map(withCategories);
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
 * Sites drawn at random from the given site's primary category, which is also
 * the one shown in the breadcrumb. Candidates may hold that category in either
 * slot; the given site's secondary category is deliberately ignored.
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

export const getSitesCount = unstable_cache(
  async function getSitesCount() {
    return prisma.site.count();
  },
  ["sites-count"],
  { tags: ["sites"], revalidate: 300 },
);
