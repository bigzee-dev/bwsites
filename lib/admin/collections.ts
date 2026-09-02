import "server-only";
import { cache } from "react";

import { prisma } from "@/lib/prisma";

export const getCollections = cache(async function getCollections() {
  return prisma.collection.findMany({
    include: { sites: { orderBy: { name: "asc" } }, categoriesLink: true },
    orderBy: [{ rank: "asc" }, { name: "asc" }],
  });
});

export type CollectionWithSites = Awaited<ReturnType<typeof getCollections>>[number];

export async function getCollectionsCount() {
  return prisma.collection.count();
}
