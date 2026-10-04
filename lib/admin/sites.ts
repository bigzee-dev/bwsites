import "server-only";
import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { onlineSite, siteCategoriesInclude, withCategories } from "@/lib/site-categories";

export const getSites = cache(async function getSites() {
  const sites = await prisma.site.findMany({
    include: siteCategoriesInclude,
    orderBy: { createdAt: "desc" },
  });
  return sites.map(withCategories);
});

export type SiteWithCategories = Awaited<ReturnType<typeof getSites>>[number];

/** Only online sites count toward the directory total, matching what visitors see. */
export async function getSitesCount() {
  return prisma.site.count({ where: onlineSite });
}

export async function getOfflineSitesCount() {
  return prisma.site.count({ where: { isOnline: false } });
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
