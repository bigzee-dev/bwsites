"use server";

import { revalidatePath, updateTag } from "next/cache";

import { getAdminSession } from "@/lib/admin/auth";
import { ImageProcessingError, optimizeImageToWebp, toWebpFilename } from "@/lib/admin/image";
import { deleteImageFromR2, uploadBufferToR2 } from "@/lib/admin/r2";
import { siteSchema } from "@/lib/admin/validation";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

type ActionResult = { success: true } | { success: false; error: string };

/** Optimizes the upload to WebP and stores it under the site slug, returning the R2 URL. */
async function storeOptimizedImage(file: File, slug: string): Promise<string> {
  const { buffer, contentType } = await optimizeImageToWebp(file);
  return uploadBufferToR2(buffer, toWebpFilename(slug), contentType);
}

function imageErrorMessage(error: unknown) {
  return error instanceof ImageProcessingError
    ? error.message
    : "Failed to upload image. Please try again.";
}

function parseSiteFormData(formData: FormData) {
  return siteSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    url: String(formData.get("url") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    description: String(formData.get("description") ?? ""),
    facebookUrl: String(formData.get("facebookUrl") ?? ""),
    whatsapp: String(formData.get("whatsapp") ?? ""),
    rank: Number(formData.get("rank") ?? 0),
    tags: formData.getAll("tags").map(String),
    categoryIds: formData.getAll("categoryIds").map(String),
  });
}

function revalidateSitePaths() {
  revalidatePath("/admin");
  revalidatePath("/admin/sites");
  revalidatePath("/admin/categories");
  updateTag("sites");
  updateTag("collections");
}

export async function createSite(formData: FormData): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const parsed = parseSiteFormData(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const imageFile = formData.get("image");
  if (!(imageFile instanceof File) || imageFile.size === 0) {
    return { success: false, error: "An image is required" };
  }

  const { name, url, slug, description, facebookUrl, whatsapp, rank, tags, categoryIds } =
    parsed.data;
  const finalSlug = slug || slugify(name);

  let imageUrl: string;
  try {
    imageUrl = await storeOptimizedImage(imageFile, finalSlug);
  } catch (error) {
    return { success: false, error: imageErrorMessage(error) };
  }

  try {
    await prisma.site.create({
      data: {
        name,
        url,
        slug: finalSlug,
        description,
        image: imageUrl,
        facebookUrl: facebookUrl || null,
        whatsapp: whatsapp || null,
        rank,
        tags,
        categories: { connect: categoryIds.map((id) => ({ id })) },
      },
    });
  } catch {
    return { success: false, error: "Failed to create site. Please try again." };
  }

  revalidateSitePaths();
  return { success: true };
}

export async function updateSite(id: string, formData: FormData): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const parsed = parseSiteFormData(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { name, url, slug, description, facebookUrl, whatsapp, rank, tags, categoryIds } =
    parsed.data;
  const finalSlug = slug || slugify(name);

  const imageFile = formData.get("image");
  let imageUrl: string | undefined;

  if (imageFile instanceof File && imageFile.size > 0) {
    try {
      imageUrl = await storeOptimizedImage(imageFile, finalSlug);
    } catch (error) {
      return { success: false, error: imageErrorMessage(error) };
    }
  }

  let previousImage: string | null = null;
  if (imageUrl) {
    const existing = await prisma.site.findUnique({ where: { id }, select: { image: true } });
    previousImage = existing?.image ?? null;
  }

  try {
    await prisma.site.update({
      where: { id },
      data: {
        name,
        url,
        slug: finalSlug,
        description,
        facebookUrl: facebookUrl || null,
        whatsapp: whatsapp || null,
        rank,
        tags,
        ...(imageUrl ? { image: imageUrl } : {}),
        categories: { set: categoryIds.map((categoryId) => ({ id: categoryId })) },
      },
    });
  } catch {
    return { success: false, error: "Failed to update site. Please try again." };
  }

  if (previousImage && previousImage !== imageUrl) {
    try {
      await deleteImageFromR2(previousImage);
    } catch {
      // Old image failed to delete; not fatal to the update.
    }
  }

  revalidateSitePaths();
  return { success: true };
}

export async function deleteSite(id: string): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: "Unauthorized" };

  let deletedImage: string | null = null;

  try {
    const deleted = await prisma.site.delete({ where: { id } });
    deletedImage = deleted.image;
  } catch {
    return { success: false, error: "Failed to delete site. Please try again." };
  }

  if (deletedImage) {
    try {
      await deleteImageFromR2(deletedImage);
    } catch {
      // Image failed to delete; not fatal since the site record is already gone.
    }
  }

  revalidateSitePaths();
  return { success: true };
}
