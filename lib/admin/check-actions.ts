"use server";

import { getAdminSession } from "@/lib/admin/auth";
import { getCategoryToCheck, getSiteToCheck, type SiteToCheck } from "@/lib/admin/checks";
import { checkSiteUrl, type SiteCheckResult } from "@/lib/admin/site-status";
import { checkRunSchema } from "@/lib/admin/validation";

type ListResult =
  | { success: true; categoryName: string; sites: SiteToCheck[] }
  | { success: false; error: string };

type CheckResult =
  | { success: true; result: SiteCheckResult }
  | { success: false; error: string };

/** The sites a run will cover — fetched up front so every row can be listed at once. */
export async function listSitesToCheck(categoryId: string): Promise<ListResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const parsed = checkRunSchema.safeParse({ categoryId });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  let category: Awaited<ReturnType<typeof getCategoryToCheck>>;
  try {
    category = await getCategoryToCheck(parsed.data.categoryId);
  } catch {
    return { success: false, error: "Failed to load the sites. Please try again." };
  }

  if (!category) {
    return { success: false, error: "That category no longer exists." };
  }

  return { success: true, categoryName: category.name, sites: category.sites };
}

/** Probes one site. Called once per row so statuses can settle independently. */
export async function checkSite(siteId: string): Promise<CheckResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: "Unauthorized" };

  let site: SiteToCheck | null;
  try {
    site = await getSiteToCheck(siteId);
  } catch {
    return { success: false, error: "Failed to load the site. Please try again." };
  }

  if (!site) {
    return { success: false, error: "That site no longer exists." };
  }

  try {
    return { success: true, result: await checkSiteUrl(site.url) };
  } catch {
    return { success: false, error: "The check could not be completed." };
  }
}
