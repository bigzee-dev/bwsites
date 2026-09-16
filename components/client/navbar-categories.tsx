"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDownIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type NavCategory = {
  id: string;
  name: string;
  href: string;
};

/** Long pages clamp the scroll offset while the next route's skeleton is in, so reset it up front. */
function scrollTop() {
  window.scrollTo(0, 0);
}

/**
 * Desktop: the categories live in a wide panel that columns out instead of a
 * single tall strip, since the list is admin-authored and keeps growing.
 */
export function NavCategoriesMenu({
  categories,
}: {
  categories: NavCategory[];
}) {
  const [open, setOpen] = useState(false);

  if (categories.length === 0) return null;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-ink-100 outline-none transition hover:text-clay-300 focus-visible:ring-2 focus-visible:ring-brand-yellow-light/70 data-[popup-open]:text-clay-300 cursor-pointer">
        <span>Categories</span>
        <ChevronDownIcon
          aria-hidden
          className={`size-3.5 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
          strokeWidth={2}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-[min(92vw,44rem)] overflow-x-hidden overflow-y-hidden rounded-xl border border-ink-200/70 bg-cream-50 p-0 shadow-[0_28px_60px_-28px_rgba(1,74,117,0.5)] ring-0 dark:border-ink-800 dark:bg-ink-900"
      >
        <div className="max-h-[min(62vh,26rem)] overflow-y-auto p-3">
          <div className="grid grid-cols-2 gap-x-2 lg:grid-cols-3">
            {categories.map((category) => (
              <DropdownMenuItem
                key={category.id}
                render={<Link href={category.href} onNavigate={scrollTop} />}
                className="cursor-pointer rounded-md px-3 py-2 font-heading text-[13.5px] font-semibold text-brand-blue-700 transition-colors focus:bg-brand-blue-900/[0.07] focus:text-brand-blue-900 dark:text-ink-200 dark:focus:bg-brand-blue-300/10 dark:focus:text-brand-blue-300"
              >
                <span className="min-w-0 flex-1 truncate">{category.name}</span>
              </DropdownMenuItem>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Mobile: an in-flow disclosure rather than a nested overlay, so the hamburger
 * panel stays the only layer on screen.
 */
export function NavCategoriesDisclosure({
  categories,
  index,
  onNavigate,
}: {
  categories: NavCategory[];
  index: string;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);

  if (categories.length === 0) return null;

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-baseline justify-between gap-4 py-4 text-left"
      >
        <span className="flex items-center gap-2 font-display text-xl text-ink-900 dark:text-cream-100">
          Categories
          <ChevronDownIcon
            aria-hidden
            className={`size-4 text-ink-400 transition-transform duration-300 dark:text-ink-500 ${
              open ? "rotate-180" : ""
            }`}
            strokeWidth={2}
          />
        </span>
        <span className="font-mono text-xs tracking-widest text-ink-400 dark:text-ink-500">
          {index}
        </span>
      </button>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-400 ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 pb-4">
            <Link
              href="/search"
              onNavigate={scrollTop}
              onClick={onNavigate}
              className="col-span-2 border-b border-ink-200/70 pb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-500 dark:border-ink-800 dark:text-ink-300"
            >
              Browse all sites
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={category.href}
                onNavigate={scrollTop}
                onClick={onNavigate}
                className="truncate rounded-md py-2 font-heading text-[13.5px] font-semibold text-brand-blue-700 transition-colors hover:text-brand-blue-900 dark:text-ink-200 dark:hover:text-brand-blue-300"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
