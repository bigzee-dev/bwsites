"use server";

import { revalidatePath, updateTag } from "next/cache";

import { getAdminSession } from "@/lib/admin/auth";
import { toWebpFilename } from "@/lib/admin/image";
import { deleteImageFromR2, uploadBufferToR2 } from "@/lib/admin/r2";
import { ScreenshotError, captureScreenshot, toWebp } from "@/lib/admin/screenshot";
import { SiteContentError, generateSiteContent } from "@/lib/admin/site-content";
import { autoSiteSchema } from "@/lib/admin/validation";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

type ActionResult =
  | { success: true; warning?: string }
  | { success: false; error: string };

async function uniqueSlug(name: string) {
  const base = slugify(name);
  let slug = base;
  let suffix = 2;

  while (await prisma.site.findUnique({ where: { slug }, select: { id: true } })) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

export async function autoCreateSite(formData: FormData): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const parsed = autoSiteSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    url: String(formData.get("url") ?? ""),
    imageName: String(formData.get("imageName") ?? ""),
    categoryId: String(formData.get("categoryId") ?? ""),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { name, url, imageName, categoryId } = parsed.data;

  // Run both before uploading anything, so a failure on either side leaves no
  // orphaned object in R2.
  let content: Awaited<ReturnType<typeof generateSiteContent>>;
  let screenshot: Buffer;
  try {
    [content, screenshot] = await Promise.all([
      generateSiteContent(url),
      captureScreenshot(url),
    ]);
  } catch (error) {
    if (error instanceof SiteContentError || error instanceof ScreenshotError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to prepare the site. Please try again." };
  }

  let imageUrl: string;
  let isBlankScreenshot = false;
  try {
    const { webp, isBlank } = await toWebp(screenshot);
    isBlankScreenshot = isBlank;
    imageUrl = await uploadBufferToR2(webp, toWebpFilename(imageName), "image/webp");
  } catch (error) {
    if (error instanceof ScreenshotError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to store the screenshot. Please try again." };
  }

  try {
    await prisma.site.create({
      data: {
        name,
        url,
        slug: await uniqueSlug(name),
        description: content.description,
        image: imageUrl,
        tags: content.tags,
        categories: { connect: { id: categoryId } },
      },
    });
  } catch {
    // The image is already in R2 but no site references it — clean it up.
    try {
      await deleteImageFromR2(imageUrl);
    } catch {
      // Not fatal; the site was not created either way.
    }
    return { success: false, error: "Failed to create site. Please try again." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/sites");
  revalidatePath("/admin/categories");
  updateTag("sites");
  updateTag("collections");

  return {
    success: true,
    warning: isBlankScreenshot
      ? "The screenshot came back blank — the site may be blocking automated capture. Replace the image from the Sites page."
      : undefined,
  };
}
