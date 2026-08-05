import "server-only";
import { cache } from "react";

import { prisma } from "@/lib/prisma";

export const getSites = cache(async function getSites() {
  return prisma.site.findMany({
    include: { categories: true },
    orderBy: { createdAt: "desc" },
  });
});

export type SiteWithCategories = Awaited<ReturnType<typeof getSites>>[number];

export const getSiteBySlug = cache(async function getSiteBySlug(slug: string) {
  return prisma.site.findFirst({
    where: { slug },
    include: { categories: true },
  });
});

export const searchSites = cache(async function searchSites(
  query: string = "",
  categoryId?: string,
) {
  const sites = await prisma.site.findMany({
    where: categoryId ? { categories: { some: { id: categoryId } } } : undefined,
    include: { categories: true },
    orderBy: [{ rank: "desc" }, { name: "asc" }],
  });

  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return sites;

  return sites.filter((site) => {
    if (site.name.toLowerCase().includes(trimmed)) return true;
    if (site.tags.some((tag) => tag.toLowerCase().includes(trimmed))) return true;
    if (site.categories.some((category) => category.name.toLowerCase().includes(trimmed))) {
      return true;
    }
    return false;
  });
});
