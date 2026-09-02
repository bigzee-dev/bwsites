import "server-only";
import { unstable_cache } from "next/cache";

import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const collectionInclude = {
  sites: { include: { categories: true }, orderBy: { name: "asc" } },
  categoriesLink: true,
} satisfies Prisma.CollectionInclude;

const collectionCacheOptions = {
  tags: ["collections", "sites", "categories"],
  revalidate: 300,
};

export const getCollectionByName = unstable_cache(
  async function getCollectionByName(name: string) {
    return prisma.collection.findUnique({
      where: { name },
      include: collectionInclude,
    });
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
    return prisma.collection.findFirst({
      where: { rank },
      include: collectionInclude,
      orderBy: { name: "asc" },
    });
  },
  ["collection-by-rank"],
  collectionCacheOptions,
);

export type CollectionWithSites = Awaited<ReturnType<typeof getCollectionByName>>;
