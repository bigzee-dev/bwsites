"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListFilter } from "lucide-react";

import { cn } from "@/lib/utils";
import { categoryHref, slugify } from "@/lib/slug";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { CategoryWithCount } from "@/lib/client/categories";

function CategoryList({
  categories,
  activeSlug,
  onNavigate,
}: {
  categories: CategoryWithCount[];
  activeSlug?: string;
  onNavigate?: () => void;
}) {
  if (categories.length === 0) {
    return (
      <p className="px-2 py-4 text-sm text-muted-foreground">
        No categories yet.
      </p>
    );
  }

  const linkClass = (active: boolean) =>
    cn(
      "flex items-center justify-between gap-2 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
      active
        ? "bg-brand-blue-900/10 text-brand-blue-900 dark:bg-brand-blue-300/10 dark:text-brand-blue-300"
        : "text-foreground/70 hover:bg-muted hover:text-foreground",
    );

  return (
    <nav className="flex flex-col gap-0.5 mt-4">
      <Link
        href="/search"
        onClick={onNavigate}
        className={linkClass(!activeSlug)}
      >
        All sites
      </Link>
      {categories.map((category) => {
        const slug = slugify(category.name);
        const active = slug === activeSlug;
        return (
          <Link
            key={category.id}
            href={categoryHref(category.name)}
            onClick={onNavigate}
            className={linkClass(active)}
          >
            <span className="truncate">{category.name}</span>
            <span className="shrink-0 text-xs text-muted-foreground">
              {category._count.sites}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

function useActiveSlug() {
  const pathname = usePathname();
  const prefix = "/search/";
  return pathname.startsWith(prefix)
    ? pathname.slice(prefix.length)
    : undefined;
}

export function SearchSidebar({
  categories,
}: {
  categories: CategoryWithCount[];
}) {
  const activeSlug = useActiveSlug();

  return (
    <aside className="hidden w-64 shrink-0 flex-col gap-2 lg:flex pt-12">
      <h2 className="px-2.5 font-heading text-base font-semibold tracking-wide text-ink-700 dark:text-ink-300 uppercase">
        Categories
      </h2>
      <CategoryList categories={categories} activeSlug={activeSlug} />
    </aside>
  );
}

export function SearchMobileSidebar({
  categories,
}: {
  categories: CategoryWithCount[];
}) {
  const activeSlug = useActiveSlug();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        variant="outline"
        className="lg:hidden"
        onClick={() => setOpen(true)}
      >
        <ListFilter className="size-4" />
        Categories
      </Button>
      <SheetContent side="left" className="flex w-64 flex-col gap-2 p-4">
        <SheetHeader className="p-0">
          <SheetTitle>Categories</SheetTitle>
        </SheetHeader>
        <CategoryList
          categories={categories}
          activeSlug={activeSlug}
          onNavigate={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
