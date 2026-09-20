"use client";

import { useState } from "react";
import { SubmitSiteDialog } from "./submit-site-dialog";
import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";

export default function FooterSiteBtn() {
  const [open, setOpen] = useState(false);

  return (
    <SubmitSiteDialog
      onOpenChange={(dialogOpen) => {
        if (dialogOpen) setOpen(false);
      }}
      trigger={
        <button className="mt-5 inline-flex items-center gap-2 border-b border-cream-100/30 pb-1 font-mono text-[11px] uppercase tracking-[0.2em] text-cream-50 transition-colors hover:border-brand-yellow-light hover:text-brand-yellow-light cursor-pointer">
          Suggest a site
          <ArrowUpRightIcon aria-hidden className="size-3.5" />
        </button>
      }
    />
  );
}
