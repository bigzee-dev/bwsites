import { redirect } from "next/navigation";

import { CategoriesTable } from "@/components/admin/categories-table";
import { getAdminSession } from "@/lib/admin/auth";
import { getCategories } from "@/lib/admin/categories";

export default async function AdminCategoriesPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  const categories = await getCategories();

  return <CategoriesTable categories={categories} />;
}
