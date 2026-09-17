import { z } from "zod";

/** Accepts URLs typed with or without a protocol, e.g. "example.co.bw". */
export function normalizeSubmissionUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function isValidSubmissionUrl(value: string) {
  try {
    const url = new URL(normalizeSubmissionUrl(value));
    return url.hostname.includes(".");
  } catch {
    return false;
  }
}

export const submissionSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120, "Name is too long"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .max(160, "Email is too long")
    .email("Enter a valid email address"),
  url: z
    .string()
    .trim()
    .min(1, "Website URL is required")
    .max(300, "URL is too long")
    .refine(isValidSubmissionUrl, "Enter a valid URL, e.g. example.co.bw"),
  description: z
    .string()
    .trim()
    .max(1000, "Description is too long")
    .optional()
    .or(z.literal("")),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;
