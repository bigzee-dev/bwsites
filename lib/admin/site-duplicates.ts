import { prisma } from "@/lib/prisma";

/** Reduces a URL to host + path so http/https, "www." and trailing slashes don't hide duplicates. */
export function normalizeSiteUrl(value: string) {
  try {
    const parsed = new URL(value.trim());
    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
    const path = parsed.pathname.replace(/\/+$/, "");
    return `${host}${path}${parsed.search}`;
  } catch {
    return value.trim().toLowerCase().replace(/\/+$/, "");
  }
}

/**
 * Returns an error message if another site already uses this URL (or slug), otherwise null.
 * Pass `excludeId` when editing so the site doesn't conflict with itself.
 */
export async function findDuplicateSiteError(
  { url, slug }: { url: string; slug?: string },
  excludeId?: string,
): Promise<string | null> {
  const target = normalizeSiteUrl(url);
  const sites = await prisma.site.findMany({
    where: excludeId ? { id: { not: excludeId } } : undefined,
    select: { name: true, url: true, slug: true },
  });

  const urlMatch = sites.find((site) => normalizeSiteUrl(site.url) === target);
  if (urlMatch) return `This site already exists as "${urlMatch.name}".`;

  if (slug) {
    const slugMatch = sites.find((site) => site.slug === slug);
    if (slugMatch) return `A site with the slug "${slug}" already exists ("${slugMatch.name}").`;
  }

  return null;
}
