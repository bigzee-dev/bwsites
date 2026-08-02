import "server-only";
import { cache } from "react";

import { prisma } from "@/lib/prisma";

export const getCollectionByName = cache(async function getCollectionByName(name: string) {
  return prisma.collection.findUnique({
    where: { name },
    include: { sites: { include: { categories: true }, orderBy: { name: "asc" } } },
  });
});

export type CollectionWithSites = Awaited<ReturnType<typeof getCollectionByName>>;
