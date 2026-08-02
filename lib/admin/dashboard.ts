import "server-only";

import { getCategoriesCount } from "@/lib/admin/categories";
import { getCollectionsCount } from "@/lib/admin/collections";
import { getRecentSites, getSitesCount } from "@/lib/admin/sites";

export async function getDashboardStats() {
  const [totalSites, totalCategories, totalCollections, recentSites] = await Promise.all([
    getSitesCount(),
    getCategoriesCount(),
    getCollectionsCount(),
    getRecentSites(5),
  ]);

  return { totalSites, totalCategories, totalCollections, recentSites };
}
