import { redirect } from "next/navigation";

import { SubmissionsTable } from "@/components/admin/submissions-table";
import { getAdminSession } from "@/lib/admin/auth";
import { getSubmissions } from "@/lib/admin/submissions";

export default async function AdminSubmissionsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  const submissions = await getSubmissions();

  return <SubmissionsTable submissions={submissions} />;
}
