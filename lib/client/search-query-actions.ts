"use server";

import { prisma } from "@/lib/prisma";

export async function logSearchQuery(query: string) {
  const trimmed = query.trim();
  if (!trimmed) return;

  try {
    await prisma.searchQuery.create({ data: { query: trimmed } });
  } catch {
    // Logging failures should never block search results.
  }
}
