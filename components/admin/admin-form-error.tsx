import { AlertCircle } from "lucide-react";

export function AdminFormError({ message }: { message: string }) {
  return (
    <div className="animate-in fade-in slide-in-from-top-1 flex items-start gap-2.5 border-l-2 border-destructive bg-destructive/5 px-3 py-2.5 text-sm text-destructive duration-200">
      <AlertCircle className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
      <p className="leading-snug">{message}</p>
    </div>
  );
}
