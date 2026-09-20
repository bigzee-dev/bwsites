import { Skeleton } from "@/components/ui/skeleton";

export default function AboutLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-16 pb-24 sm:px-2 lg:px-2">
      <Skeleton className="h-3 w-40" />
      <Skeleton className="mt-7 h-14 w-full max-w-2xl" />
      <Skeleton className="mt-3 h-14 w-full max-w-xl" />
      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-20 w-full" />
        ))}
      </div>
      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-36 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
