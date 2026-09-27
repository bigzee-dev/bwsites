import "server-only";

import { prisma } from "@/lib/prisma";
import { inCategory } from "@/lib/site-categories";

export type SiteToCheck = {
  id: string;
  name: string;
  url: string;
};

/** The category and the sites a check run will probe, in display order. */
export async function getCategoryToCheck(categoryId: string) {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true, name: true },
  });
  if (!category) return null;

  const sites: SiteToCheck[] = await prisma.site.findMany({
    where: inCategory(categoryId),
    select: { id: true, name: true, url: true },
    orderBy: { name: "asc" },
  });
  return { ...category, sites };
}

export async function getSiteToCheck(id: string): Promise<SiteToCheck | null> {
  return prisma.site.findUnique({
    where: { id },
    select: { id: true, name: true, url: true },
  });
}
