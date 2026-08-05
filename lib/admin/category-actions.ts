"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { getAdminSession } from "@/lib/admin/auth";
import { categorySchema } from "@/lib/admin/validation";
import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

type ActionResult = { success: true } | { success: false; error: string };

function isUniqueConstraintError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

function revalidateCategoryPaths() {
  revalidatePath("/admin");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/sites");
  revalidateTag("categories");
  revalidateTag("sites");
}

export async function createCategory(formData: FormData): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const parsed = categorySchema.safeParse({ name: String(formData.get("name") ?? "") });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await prisma.category.create({ data: { name: parsed.data.name } });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { success: false, error: "A category with this name already exists." };
    }
    return { success: false, error: "Failed to create category. Please try again." };
  }

  revalidateCategoryPaths();
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const parsed = categorySchema.safeParse({ name: String(formData.get("name") ?? "") });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await prisma.category.update({ where: { id }, data: { name: parsed.data.name } });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { success: false, error: "A category with this name already exists." };
    }
    return { success: false, error: "Failed to update category. Please try again." };
  }

  revalidateCategoryPaths();
  return { success: true };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const category = await prisma.category.findUnique({
    where: { id },
    select: { _count: { select: { sites: true } } },
  });

  if (!category) {
    return { success: false, error: "Category not found." };
  }

  if (category._count.sites > 0) {
    return {
      success: false,
      error: `Cannot delete — this category is assigned to ${category._count.sites} site${
        category._count.sites === 1 ? "" : "s"
      }. Remove it from those sites first.`,
    };
  }

  try {
    await prisma.category.delete({ where: { id } });
  } catch {
    return { success: false, error: "Failed to delete category. Please try again." };
  }

  revalidateCategoryPaths();
  return { success: true };
}
