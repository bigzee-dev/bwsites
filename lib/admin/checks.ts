import "server-only";

import { prisma } from "@/lib/prisma";

export type SiteToCheck = {
  id: string;
  name: string;
  url: string;
};

/** The category and the sites a check run will probe, in display order. */
export async function getCategoryToCheck(categoryId: string) {
  return prisma.category.findUnique({
    where: { id: categoryId },
    select: {
      id: true,
      name: true,
      sites: {
        select: { id: true, name: true, url: true },
        orderBy: { name: "asc" },
      },
    },
  });
}

export async function getSiteToCheck(id: string): Promise<SiteToCheck | null> {
  return prisma.site.findUnique({
    where: { id },
    select: { id: true, name: true, url: true },
  });
}
