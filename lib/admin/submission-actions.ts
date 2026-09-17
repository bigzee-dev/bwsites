"use server";

import { revalidatePath } from "next/cache";

import { getAdminSession } from "@/lib/admin/auth";
import { prisma } from "@/lib/prisma";

type ActionResult = { success: true } | { success: false; error: string };

function revalidateSubmissionPaths() {
  revalidatePath("/admin/submissions");
}

export async function deleteSubmission(id: string): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    await prisma.submission.delete({ where: { id } });
  } catch {
    return { success: false, error: "Failed to delete submission. Please try again." };
  }

  revalidateSubmissionPaths();
  return { success: true };
}

export async function deleteSubmissions(ids: string[]): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: "Unauthorized" };

  if (ids.length === 0) {
    return { success: false, error: "No submissions selected." };
  }

  try {
    await prisma.submission.deleteMany({ where: { id: { in: ids } } });
  } catch {
    return { success: false, error: "Failed to delete submissions. Please try again." };
  }

  revalidateSubmissionPaths();
  return { success: true };
}
