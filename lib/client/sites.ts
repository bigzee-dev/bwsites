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
