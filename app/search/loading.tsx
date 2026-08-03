import { Skeleton } from "@/components/ui/skeleton";

export default function SearchLoading() {
  return (
    <div className=" w-full">
      <Skeleton className="mb-6 h-8 w-56" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
