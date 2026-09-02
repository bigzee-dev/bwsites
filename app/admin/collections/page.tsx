import { redirect } from "next/navigation";

import { CollectionsTable } from "@/components/admin/collections-table";
import { getAdminSession } from "@/lib/admin/auth";
import { getCategories } from "@/lib/admin/categories";
import { getCollections } from "@/lib/admin/collections";
import { getSitesForSelection } from "@/lib/admin/sites";

export default async function AdminCollectionsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  const [collections, sites, categories] = await Promise.all([
    getCollections(),
    getSitesForSelection(),
    getCategories(),
  ]);

  return <CollectionsTable collections={collections} sites={sites} categories={categories} />;
}
