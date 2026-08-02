import "server-only";
import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

export const getCategories = cache(async function getCategories() {
  return prisma.category.findMany({
    include: { _count: { select: { sites: true } } },
    orderBy: { name: "asc" },
  });
});

export type CategoryWithCount = Awaited<ReturnType<typeof getCategories>>[number];

export const getCategoryBySlug = cache(async function getCategoryBySlug(slug: string) {
  const categories = await getCategories();
  return categories.find((category) => slugify(category.name) === slug) ?? null;
});
