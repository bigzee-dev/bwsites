import { redirect } from "next/navigation";

import { SiteChecksPanel } from "@/components/admin/site-checks-panel";
import { getAdminSession } from "@/lib/admin/auth";
import { getCategories } from "@/lib/admin/categories";

export default async function AdminChecksPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  const categories = await getCategories();

  return <SiteChecksPanel categories={categories} />;
}
