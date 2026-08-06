"use client";

import { usePathname } from "next/navigation";

import { AdminMobileNav, NAV_ITEMS } from "@/components/admin/admin-sidebar";
import { GlobalActions } from "@/components/admin/global-actions";
import type { CategoryWithCount } from "@/lib/admin/categories";

type HeaderUser = {
  name: string;
  email: string;
};

export function AdminHeader({
  user,
  categories,
}: {
  user: HeaderUser;
  categories: CategoryWithCount[];
}) {
  const pathname = usePathname();
  const title =
    NAV_ITEMS.find((item) => item.href === pathname)?.label ?? "Admin";

  return (
    <header className="sticky flex items-center gap-3 border-b border-border px-4 py-3 sm:px-6">
      <AdminMobileNav user={user} />
      <h1 className="flex-1 truncate text-lg font-semibold text-foreground font-[family-name:var(--font-admin-display)]">
        {title}
      </h1>
      <GlobalActions categories={categories} />
    </header>
  );
}
