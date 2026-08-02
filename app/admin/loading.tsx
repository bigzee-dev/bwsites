import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex flex-1 items-center justify-center bg-background px-4 py-16">
      <Loader2 className="size-6 animate-spin text-brand-blue-900 dark:text-brand-blue-300" />
    </div>
  );
}
