import type { ReactNode } from "react";

import { AdminMobileNav, AdminSidebar } from "@/components/admin/admin-sidebar";
import { GlobalActions } from "@/components/admin/global-actions";
import type { CategoryWithCount } from "@/lib/admin/categories";

export function DashboardShell({
  title,
  user,
  categories,
  children,
}: {
  title: string;
  user: { name: string; email: string };
  categories: CategoryWithCount[];
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-1 bg-background">
      <AdminSidebar user={user} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border px-4 py-3 sm:px-6">
          <AdminMobileNav user={user} />
          <h1 className="flex-1 truncate text-lg font-semibold text-foreground font-[family-name:var(--font-admin-display)]">
            {title}
          </h1>
          <GlobalActions categories={categories} />
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
