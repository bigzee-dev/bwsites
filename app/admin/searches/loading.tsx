import { Skeleton } from "@/components/ui/skeleton";

export default function AdminSearchesLoading() {
  return (
    <div className="flex min-h-svh flex-1 bg-background">
      <div className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:block" />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3 sm:px-6">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-72 w-full" />
        </div>
      </div>
    </div>
  );
}
