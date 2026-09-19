import { Skeleton } from "@/components/ui/skeleton";

export default function AdminChecksLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-44 w-full max-w-xl" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
