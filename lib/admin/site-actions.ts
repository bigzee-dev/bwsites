"use server";

import { revalidatePath } from "next/cache";

import { getAdminSession } from "@/lib/admin/auth";
import { deleteImageFromR2, uploadImageToR2 } from "@/lib/admin/r2";
import { siteSchema } from "@/lib/admin/validation";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

type ActionResult = { success: true } | { success: false; error: string };

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

  let imageUrl: string;
  try {
    imageUrl = await uploadImageToR2(imageFile);
  } catch {
    return { success: false, error: "Failed to upload image. Please try again." };
  }

  const { name, url, slug, description, facebookUrl, whatsapp, rank, tags, categoryIds } =
    parsed.data;

  try {
    await prisma.site.create({
      data: {
        name,
        url,
        slug: slug || slugify(name),
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

  const imageFile = formData.get("image");
  let imageUrl: string | undefined;

  if (imageFile instanceof File && imageFile.size > 0) {
    try {
      imageUrl = await uploadImageToR2(imageFile);
    } catch {
      return { success: false, error: "Failed to upload image. Please try again." };
    }
  }

  const { name, url, slug, description, facebookUrl, whatsapp, rank, tags, categoryIds } =
    parsed.data;

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
        slug: slug || slugify(name),
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
