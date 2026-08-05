import "server-only";
import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/prisma";

export const getCollectionByName = unstable_cache(
  async function getCollectionByName(name: string) {
    return prisma.collection.findUnique({
      where: { name },
      include: { sites: { include: { categories: true }, orderBy: { name: "asc" } } },
    });
  },
  ["collection-by-name"],
  { tags: ["collections", "sites"], revalidate: 300 },
);

export type CollectionWithSites = Awaited<ReturnType<typeof getCollectionByName>>;
