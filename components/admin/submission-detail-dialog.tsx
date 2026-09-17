"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Inter } from "next/font/google";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SubmissionRecord } from "@/lib/admin/submissions";

const inter = Inter({
  variable: "--font-admin-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-border py-3 last:border-b-0 sm:flex-row sm:gap-4">
      <p className="text-[0.7rem] font-medium tracking-[0.12em] text-muted-foreground uppercase sm:w-32 sm:shrink-0 sm:pt-0.5">
        {label}
      </p>
      <div className="min-w-0 flex-1 text-sm break-words text-foreground">
        {children}
      </div>
    </div>
  );
}

export function SubmissionDetailDialog({
  submission,
  open,
  onOpenChange,
}: {
  submission: SubmissionRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  // Keep the last submission around so the content does not vanish mid close animation.
  const [lastSubmission, setLastSubmission] = useState(submission);
  if (submission && submission !== lastSubmission) {
    setLastSubmission(submission);
  }
  const shown = submission ?? lastSubmission;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${inter.variable} max-h-[calc(100svh-2rem)] overflow-y-auto font-[family-name:var(--font-admin-sans)] sm:max-w-lg`}
      >
        {shown && (
          <>
            <DialogHeader>
              <DialogTitle>Submission details</DialogTitle>
              <DialogDescription>
                Received {dateFormatter.format(shown.createdAt)}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col">
              <DetailRow label="Name">{shown.name}</DetailRow>
              <DetailRow label="Email">
                <a
                  href={`mailto:${shown.email}`}
                  className="text-brand-blue-900 underline-offset-4 hover:underline dark:text-brand-blue-300"
                >
                  {shown.email}
                </a>
              </DetailRow>
              <DetailRow label="Website">
                <a
                  href={shown.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-brand-blue-900 underline-offset-4 hover:underline dark:text-brand-blue-300"
                >
                  {shown.url}
                  <ExternalLink className="size-3.5 shrink-0" />
                </a>
              </DetailRow>
              <DetailRow label="Description">
                {shown.description ? (
                  <p className="whitespace-pre-wrap">{shown.description}</p>
                ) : (
                  <span className="text-muted-foreground">
                    No description provided.
                  </span>
                )}
              </DetailRow>
            </div>
            <DialogFooter>
              <DialogClose render={<Button type="button" variant="outline" />}>
                Close
              </DialogClose>
              <a
                href={shown.url}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants()}
              >
                Visit site
                <ExternalLink className="size-4" />
              </a>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
