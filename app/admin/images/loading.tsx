import { Skeleton } from "@/components/ui/skeleton";

export default function AdminImagesLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-72 w-full" />
    </div>
  );
}
