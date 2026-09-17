"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { normalizeSubmissionUrl, submissionSchema } from "@/lib/client/validation";

type ActionResult = { success: true } | { success: false; error: string };

export async function createSubmission(formData: FormData): Promise<ActionResult> {
  const parsed = submissionSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    url: String(formData.get("url") ?? ""),
    description: String(formData.get("description") ?? ""),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { name, email, url, description } = parsed.data;

  try {
    await prisma.submission.create({
      data: {
        name,
        email,
        url: normalizeSubmissionUrl(url),
        description: description ? description : null,
      },
    });
  } catch {
    return {
      success: false,
      error: "We couldn't send your submission. Please try again.",
    };
  }

  revalidatePath("/admin/submissions");
  return { success: true };
}
