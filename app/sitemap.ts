import type { MetadataRoute } from "next";

import { getCategories } from "@/lib/client/categories";
import { getSites } from "@/lib/client/sites";
import { SITE_URL } from "@/lib/constants";
import { slugify } from "@/lib/slug";

/**
 * Generated per request, never at build time: the build container has no route
 * to the database, and the underlying queries are already cached for 5 minutes.
 */
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, sites] = await Promise.all([getCategories(), getSites()]);

  const newestSite = sites.reduce<Date | undefined>((latest, site) => {
    return !latest || site.updatedAt > latest ? site.updatedAt : latest;
  }, undefined);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: newestSite ?? new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/search`,
      lastModified: newestSite ?? new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories
    .filter((category) => category._count.sites > 0)
    .map((category) => ({
      url: `${SITE_URL}/search/${slugify(category.name)}`,
      lastModified: category.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  const siteRoutes: MetadataRoute.Sitemap = sites.map((site) => ({
    url: `${SITE_URL}/site/${site.slug}`,
    lastModified: site.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...siteRoutes];
}
