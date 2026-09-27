import "server-only";
import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { categorySiteCountInclude, withSiteCount } from "@/lib/site-categories";

export const getCategories = cache(async function getCategories() {
  const categories = await prisma.category.findMany({
    include: categorySiteCountInclude,
    orderBy: { name: "asc" },
  });
  return categories.map(withSiteCount);
});

export type CategoryWithCount = Awaited<ReturnType<typeof getCategories>>[number];

export async function getCategoriesCount() {
  return prisma.category.count();
}
