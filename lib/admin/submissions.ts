import "server-only";
import { cache } from "react";

import { prisma } from "@/lib/prisma";

export const getSubmissions = cache(async function getSubmissions() {
  return prisma.submission.findMany({
    orderBy: { createdAt: "desc" },
  });
});

export type SubmissionRecord = Awaited<ReturnType<typeof getSubmissions>>[number];

export async function getSubmissionsCount() {
  return prisma.submission.count();
}
