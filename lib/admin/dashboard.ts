import "server-only";

import { getCategoriesCount } from "@/lib/admin/categories";
import { getCollectionsCount } from "@/lib/admin/collections";
import { getOfflineSitesCount, getRecentSites, getSitesCount } from "@/lib/admin/sites";

export async function getDashboardStats() {
  const [totalSites, offlineSites, totalCategories, totalCollections, recentSites] =
    await Promise.all([
      getSitesCount(),
      getOfflineSitesCount(),
      getCategoriesCount(),
      getCollectionsCount(),
      getRecentSites(5),
    ]);

  return { totalSites, offlineSites, totalCategories, totalCollections, recentSites };
}
