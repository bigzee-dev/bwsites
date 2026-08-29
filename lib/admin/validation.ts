import { z } from "zod";

export const siteSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120, "Name is too long"),
  url: z.string().trim().min(1, "URL is required").url("Enter a valid URL"),
  slug: z
    .string()
    .trim()
    .max(160, "Slug is too long")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only")
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(1000, "Description is too long"),
  facebookUrl: z
    .string()
    .trim()
    .url("Enter a valid Facebook URL")
    .optional()
    .or(z.literal("")),
  whatsapp: z.string().trim().optional().or(z.literal("")),
  rank: z
    .number()
    .int()
    .min(0, "Rank must be at least 0")
    .max(100, "Rank must be at most 100"),
  tags: z.array(z.string().trim().min(1)),
  categoryIds: z.array(z.string().min(1)).min(1, "Select at least one category"),
});

export type SiteInput = z.infer<typeof siteSchema>;

export const autoSiteSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120, "Name is too long"),
  url: z.string().trim().min(1, "URL is required").url("Enter a valid URL"),
  imageName: z
    .string()
    .trim()
    .min(1, "Image name is required")
    .max(80, "Image name is too long")
    .regex(
      /^[a-zA-Z0-9._-]+$/,
      "Use letters, numbers, dots, hyphens, and underscores only",
    ),
  categoryId: z.string().min(1, "Select a category"),
});

export type AutoSiteInput = z.infer<typeof autoSiteSchema>;

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(60, "Name is too long"),
});

export type CategoryInput = z.infer<typeof categorySchema>;

export const MAX_COLLECTION_SITES = 6;

export const collectionSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80, "Name is too long"),
  siteIds: z
    .array(z.string().min(1))
    .max(MAX_COLLECTION_SITES, `A collection can have at most ${MAX_COLLECTION_SITES} sites`),
});

export type CollectionInput = z.infer<typeof collectionSchema>;
