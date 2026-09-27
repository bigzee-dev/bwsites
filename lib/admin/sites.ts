import "server-only";
import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { siteCategoriesInclude, withCategories } from "@/lib/site-categories";

export const getSites = cache(async function getSites() {
  const sites = await prisma.site.findMany({
    include: siteCategoriesInclude,
    orderBy: { createdAt: "desc" },
  });
  return sites.map(withCategories);
});

export type SiteWithCategories = Awaited<ReturnType<typeof getSites>>[number];

export async function getSitesCount() {
  return prisma.site.count();
}

export async function getRecentSites(limit: number) {
  const sites = await prisma.site.findMany({
    include: siteCategoriesInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return sites.map(withCategories);
}

export const getSitesForSelection = cache(async function getSitesForSelection() {
  return prisma.site.findMany({
    select: { id: true, name: true, image: true },
    orderBy: { name: "asc" },
  });
});

export type SiteForSelection = Awaited<ReturnType<typeof getSitesForSelection>>[number];
