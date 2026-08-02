import { redirect } from "next/navigation";

import { CategoriesTable } from "@/components/admin/categories-table";
import { DashboardShell } from "@/components/admin/dashboard-shell";
import { getAdminSession } from "@/lib/admin/auth";
import { getCategories } from "@/lib/admin/categories";

export default async function AdminCategoriesPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  const categories = await getCategories();

  return (
    <DashboardShell title="Categories" user={session.user} categories={categories}>
      <CategoriesTable categories={categories} />
    </DashboardShell>
  );
}
