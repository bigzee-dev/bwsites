"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function SearchError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-svh flex-1 flex-col items-center justify-center gap-4 bg-background px-4 py-24 text-center">
      <AlertTriangle className="size-10 text-destructive" />
      <div>
        <p className="font-heading text-lg font-semibold text-foreground">
          Something went wrong
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          We couldn&apos;t load these results. Please try again.
        </p>
      </div>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
