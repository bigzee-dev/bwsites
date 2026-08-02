import { Skeleton } from "@/components/ui/skeleton";

export default function AdminSitesLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}
