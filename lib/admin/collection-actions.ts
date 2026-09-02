"use server";

import { revalidatePath, updateTag } from "next/cache";

import { getAdminSession } from "@/lib/admin/auth";
import { collectionSchema } from "@/lib/admin/validation";
import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

type ActionResult = { success: true } | { success: false; error: string };

function isUniqueConstraintError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

function parseCollectionFormData(formData: FormData) {
  return collectionSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    rank: Number(formData.get("rank") ?? 0),
    categoriesLinkId: String(formData.get("categoriesLinkId") ?? ""),
    siteIds: formData.getAll("siteIds").map(String),
  });
}

function revalidateCollectionPaths() {
  revalidatePath("/admin");
  revalidatePath("/admin/collections");
  updateTag("collections");
}

export async function createCollection(formData: FormData): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const parsed = parseCollectionFormData(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { name, rank, categoriesLinkId, siteIds } = parsed.data;

  try {
    await prisma.collection.create({
      data: {
        name,
        rank,
        categoriesLinkId: categoriesLinkId || null,
        sites: { connect: siteIds.map((id) => ({ id })) },
      },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { success: false, error: "A collection with this name already exists." };
    }
    console.error("createCollection failed", error);
    return { success: false, error: "Failed to create collection. Please try again." };
  }

  revalidateCollectionPaths();
  return { success: true };
}

export async function updateCollection(id: string, formData: FormData): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const parsed = parseCollectionFormData(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { name, rank, categoriesLinkId, siteIds } = parsed.data;

  try {
    await prisma.collection.update({
      where: { id },
      data: {
        name,
        rank,
        categoriesLinkId: categoriesLinkId || null,
        sites: { set: siteIds.map((siteId) => ({ id: siteId })) },
      },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { success: false, error: "A collection with this name already exists." };
    }
    console.error("updateCollection failed", error);
    return { success: false, error: "Failed to update collection. Please try again." };
  }

  revalidateCollectionPaths();
  return { success: true };
}

export async function deleteCollection(id: string): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    await prisma.collection.delete({ where: { id } });
  } catch {
    return { success: false, error: "Failed to delete collection. Please try again." };
  }

  revalidateCollectionPaths();
  return { success: true };
}
