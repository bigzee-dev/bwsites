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

export async function getSitesCount() {
  return prisma.site.count();
}

export async function getRecentSites(limit: number) {
  return prisma.site.findMany({
    include: { categories: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export const getSitesForSelection = cache(async function getSitesForSelection() {
  return prisma.site.findMany({
    select: { id: true, name: true, image: true },
    orderBy: { name: "asc" },
  });
});

export type SiteForSelection = Awaited<ReturnType<typeof getSitesForSelection>>[number];
