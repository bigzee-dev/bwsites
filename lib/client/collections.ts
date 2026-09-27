import "server-only";
import { unstable_cache } from "next/cache";

import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { siteCategoriesInclude, withCategories } from "@/lib/site-categories";

const collectionInclude = {
  sites: { include: siteCategoriesInclude, orderBy: { name: "asc" } },
  categoriesLink: true,
} satisfies Prisma.CollectionInclude;

type CollectionSite = Parameters<typeof withCategories>[0];

function withSiteCategories<S extends CollectionSite, T extends { sites: S[] }>(
  collection: T & { sites: S[] },
): Omit<T, "sites"> & { sites: ReturnType<typeof withCategories<S>>[] } {
  return { ...collection, sites: collection.sites.map(withCategories) };
}

const collectionCacheOptions = {
  tags: ["collections", "sites", "categories"],
  revalidate: 300,
};

export const getCollectionByName = unstable_cache(
  async function getCollectionByName(name: string) {
    const collection = await prisma.collection.findUnique({
      where: { name },
      include: collectionInclude,
    });
    return collection && withSiteCategories(collection);
  },
  ["collection-by-name"],
  collectionCacheOptions,
);

/**
 * Ranks are not unique, so the lowest-named collection wins a tie. Returns null
 * when no collection carries the rank.
 */
export const getCollectionByRank = unstable_cache(
  async function getCollectionByRank(rank: number) {
    const collection = await prisma.collection.findFirst({
      where: { rank },
      include: collectionInclude,
      orderBy: { name: "asc" },
    });
    return collection && withSiteCategories(collection);
  },
  ["collection-by-rank"],
  collectionCacheOptions,
);

export type CollectionWithSites = Awaited<ReturnType<typeof getCollectionByName>>;
