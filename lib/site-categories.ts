import type { Category, Prisma } from "@/app/generated/prisma/client";

export const siteCategoriesInclude = {
  primaryCategory: true,
  secondaryCategory: true,
} satisfies Prisma.SiteInclude;

/** Matches sites that have the category in either slot. */
export function inCategory(categoryId: string) {
  return {
    OR: [{ primaryCategoryId: categoryId }, { secondaryCategoryId: categoryId }],
  } satisfies Prisma.SiteWhereInput;
}

/**
 * Adds `categories` as `[primary, secondary?]`, so `categories[0]` is always
 * the primary category.
 */
export function withCategories<
  T extends { primaryCategory: Category; secondaryCategory: Category | null },
>(site: T): T & { categories: Category[] } {
  const { primaryCategory, secondaryCategory } = site;
  return {
    ...site,
    categories: secondaryCategory ? [primaryCategory, secondaryCategory] : [primaryCategory],
  };
}

/** Folds the two relation counts back into the single `_count.sites` the UI reads. */
export function withSiteCount<
  T extends { _count: { primarySites: number; secondarySites: number } },
>(category: T) {
  const { _count, ...rest } = category;
  return { ...rest, _count: { sites: _count.primarySites + _count.secondarySites } };
}

export const categorySiteCountInclude = {
  _count: { select: { primarySites: true, secondarySites: true } },
} satisfies Prisma.CategoryInclude;

/** Sites the admin has taken offline stay in the database but are hidden from visitors. */
export const onlineSite = { isOnline: true } satisfies Prisma.SiteWhereInput;

/** Like `categorySiteCountInclude`, but only counts sites visitors can see. */
export const categoryOnlineSiteCountInclude = {
  _count: {
    select: {
      primarySites: { where: onlineSite },
      secondarySites: { where: onlineSite },
    },
  },
} satisfies Prisma.CategoryInclude;
