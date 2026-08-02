import "server-only";
import { cache } from "react";

import { prisma } from "@/lib/prisma";

export const getSearchQueries = cache(async function getSearchQueries() {
  return prisma.searchQuery.findMany({
    orderBy: { createdAt: "desc" },
  });
});

export type SearchQueryRecord = Awaited<ReturnType<typeof getSearchQueries>>[number];
