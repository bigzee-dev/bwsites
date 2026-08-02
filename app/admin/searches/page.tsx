import { redirect } from "next/navigation";

import { SearchQueriesTable } from "@/components/admin/search-queries-table";
import { getAdminSession } from "@/lib/admin/auth";
import { getSearchQueries } from "@/lib/admin/search-queries";

export default async function AdminSearchesPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  const searchQueries = await getSearchQueries();

  return <SearchQueriesTable searchQueries={searchQueries} />;
}
