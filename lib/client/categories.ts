import "server-only";
import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/prisma";
import { categoryOnlineSiteCountInclude, withSiteCount } from "@/lib/site-categories";
import { slugify } from "@/lib/slug";

export const getCategories = unstable_cache(
  async function getCategories() {
    const categories = await prisma.category.findMany({
      include: categoryOnlineSiteCountInclude,
      orderBy: { name: "asc" },
    });
    return categories.map(withSiteCount);
  },
  ["categories"],
  { tags: ["categories"], revalidate: 300 },
);

export type CategoryWithCount = Awaited<ReturnType<typeof getCategories>>[number];

export const getCategoryBySlug = unstable_cache(
  async function getCategoryBySlug(slug: string) {
    const categories = await getCategories();
    return categories.find((category) => slugify(category.name) === slug) ?? null;
  },
  ["category-by-slug"],
  { tags: ["categories"], revalidate: 300 },
);
