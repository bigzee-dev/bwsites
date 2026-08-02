import { redirect } from "next/navigation";

import { SitesTable } from "@/components/admin/sites-table";
import { getAdminSession } from "@/lib/admin/auth";
import { getCategories } from "@/lib/admin/categories";
import { getSites } from "@/lib/admin/sites";

export default async function AdminSitesPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  const [sites, categories] = await Promise.all([getSites(), getCategories()]);

  return <SitesTable sites={sites} categories={categories} />;
}
