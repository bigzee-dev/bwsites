import { Skeleton } from "@/components/ui/skeleton";

export function SearchSkeleton() {
  return (
    <div className="flex min-h-svh flex-1 flex-col bg-background">
      <div className="h-[86px] w-full shrink-0 bg-brand-blue-900" />
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-2 lg:flex-row lg:gap-8 lg:py-8">
        <div className="hidden w-64 shrink-0 flex-col gap-2 lg:flex">
          <Skeleton className="h-4 w-24" />
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <Skeleton className="mb-6 h-8 w-56" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
