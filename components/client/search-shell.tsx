import type { ReactNode } from "react";

import { Navbar } from "@/components/client/navbar";
import { SearchMobileSidebar, SearchSidebar } from "@/components/client/search-sidebar";
import type { CategoryWithCount } from "@/lib/client/categories";

export function SearchShell({
  categories,
  activeSlug,
  children,
}: {
  categories: CategoryWithCount[];
  activeSlug?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-1 flex-col bg-background">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-2 lg:flex-row lg:gap-8 lg:py-8">
        <SearchSidebar categories={categories} activeSlug={activeSlug} />
        <SearchMobileSidebar categories={categories} activeSlug={activeSlug} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
