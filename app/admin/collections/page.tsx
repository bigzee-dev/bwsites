import { redirect } from "next/navigation";

import { CollectionsTable } from "@/components/admin/collections-table";
import { getAdminSession } from "@/lib/admin/auth";
import { getCollections } from "@/lib/admin/collections";
import { getSitesForSelection } from "@/lib/admin/sites";

export default async function AdminCollectionsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  const [collections, sites] = await Promise.all([
    getCollections(),
    getSitesForSelection(),
  ]);

  return <CollectionsTable collections={collections} sites={sites} />;
}
