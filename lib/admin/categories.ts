import "server-only";
import { cache } from "react";

import { prisma } from "@/lib/prisma";

export const getCategories = cache(async function getCategories() {
  return prisma.category.findMany({
    include: { _count: { select: { sites: true } } },
    orderBy: { name: "asc" },
  });
});

export type CategoryWithCount = Awaited<ReturnType<typeof getCategories>>[number];

export async function getCategoriesCount() {
  return prisma.category.count();
}
