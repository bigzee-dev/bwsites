"use client";

import { useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setSiteOnline } from "@/lib/admin/site-actions";
import { cn } from "@/lib/utils";

type Status = "online" | "offline";

const STATUS_ITEMS: { value: Status; label: string }[] = [
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
];

function StatusDot({ status }: { status: Status }) {
  return (
    <span
      aria-hidden
      className={cn(
        "size-2 shrink-0 rounded-full",
        status === "online" ? "bg-emerald-500" : "bg-muted-foreground/50"
      )}
    />
  );
}

export function SiteStatusSelect({
  site,
}: {
  site: { id: string; name: string; isOnline: boolean };
}) {
  const router = useRouter();
  const [optimisticOnline, setOptimisticOnline] = useOptimistic(site.isOnline);
  const [confirmOpen, setConfirmOpen] = useState(false);
  // The status the admin picked but has not confirmed yet. Kept after the dialog
  // closes so its text does not flip during the close animation.
  const [targetStatus, setTargetStatus] = useState<Status>("offline");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const current: Status = optimisticOnline ? "online" : "offline";
  const goingOffline = targetStatus === "offline";

  function handleValueChange(value: Status | null) {
    if (!value || value === current) return;
    setError(null);
    setTargetStatus(value);
    setConfirmOpen(true);
  }

  function handleOpenChange(open: boolean) {
    if (isPending) return;
    setConfirmOpen(open);
    if (!open) setError(null);
  }

  function handleConfirm() {
    const nextOnline = targetStatus === "online";
    setError(null);

    startTransition(async () => {
      setOptimisticOnline(nextOnline);
      const result = await setSiteOnline(site.id, nextOnline);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setConfirmOpen(false);
      toast.success(nextOnline ? `${site.name} is back online` : `${site.name} is now offline`, {
        description: nextOnline
          ? "It is visible in the directory again."
          : "It is hidden from the directory until you bring it back online.",
      });
      router.refresh();
    });
  }

  return (
    <>
      <Select
        items={STATUS_ITEMS}
        value={current}
        onValueChange={handleValueChange}
        disabled={isPending}
      >
        <SelectTrigger
          size="sm"
          className="w-28"
          aria-label={`Status of ${site.name}`}
        >
          {isPending ? (
            <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
          ) : (
            <StatusDot status={current} />
          )}
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUS_ITEMS.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              <StatusDot status={item.value} />
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <AlertDialog open={confirmOpen} onOpenChange={handleOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {goingOffline
                ? `Take "${site.name}" offline?`
                : `Bring "${site.name}" back online?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {goingOffline
                ? "Visitors will no longer see this site in search results, categories, collections or the directory total. Nothing is deleted, and you can bring it back online at any time."
                : "This site will appear in search results, categories and collections again, and will count toward the directory total."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant={goingOffline ? "destructive" : "default"}
              disabled={isPending}
              onClick={handleConfirm}
            >
              {isPending && <Loader2 className="size-4 animate-spin" />}
              {goingOffline ? "Take offline" : "Bring online"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
