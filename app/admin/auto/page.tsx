import { redirect } from "next/navigation";

import { AutoSiteForm } from "@/components/admin/auto-site-form";
import { getAdminSession } from "@/lib/admin/auth";
import { getCategories } from "@/lib/admin/categories";

export default async function AdminAutoPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  const categories = await getCategories();

  return <AutoSiteForm categories={categories} />;
}
