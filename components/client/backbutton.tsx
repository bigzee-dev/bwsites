"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue-900 cursor-pointer dark:text-brand-blue-300"
    >
      <ArrowLeft className="size-4" />
      Back
    </button>
  );
}
