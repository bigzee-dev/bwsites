"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-1.5 text-sm font-medium dark:text-ink-200 cursor-pointer text-brand-blue-900"
    >
      <ArrowLeft className="size-4" />
      Back
    </button>
  );
}
