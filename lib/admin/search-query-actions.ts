"use server";

import { revalidatePath } from "next/cache";

import { getAdminSession } from "@/lib/admin/auth";
import { prisma } from "@/lib/prisma";

type ActionResult = { success: true } | { success: false; error: string };

function revalidateSearchQueryPaths() {
  revalidatePath("/admin/searches");
}

export async function deleteSearchQuery(id: string): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    await prisma.searchQuery.delete({ where: { id } });
  } catch {
    return { success: false, error: "Failed to delete search query. Please try again." };
  }

  revalidateSearchQueryPaths();
  return { success: true };
}

export async function deleteSearchQueries(ids: string[]): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: "Unauthorized" };

  if (ids.length === 0) {
    return { success: false, error: "No search queries selected." };
  }

  try {
    await prisma.searchQuery.deleteMany({ where: { id: { in: ids } } });
  } catch {
    return { success: false, error: "Failed to delete search queries. Please try again." };
  }

  revalidateSearchQueryPaths();
  return { success: true };
}
