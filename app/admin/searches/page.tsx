import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/admin/dashboard-shell";
import { SearchQueriesTable } from "@/components/admin/search-queries-table";
import { getAdminSession } from "@/lib/admin/auth";
import { getCategories } from "@/lib/admin/categories";
import { getSearchQueries } from "@/lib/admin/search-queries";

export default async function AdminSearchesPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  const [categories, searchQueries] = await Promise.all([
    getCategories(),
    getSearchQueries(),
  ]);

  return (
    <DashboardShell title="Searches" user={session.user} categories={categories}>
      <SearchQueriesTable searchQueries={searchQueries} />
    </DashboardShell>
  );
}
