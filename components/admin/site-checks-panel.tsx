"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  CircleAlert,
  CircleCheck,
  ExternalLink,
  Loader2,
  RadioTower,
  Tags,
  TriangleAlert,
  Wrench,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import type { CategoryWithCount } from "@/lib/admin/categories";
import { checkSite, listSitesToCheck } from "@/lib/admin/check-actions";
import { checkRunSchema, type CheckRunInput } from "@/lib/admin/validation";

/** Sites probed at the same time — enough to keep a run short, few enough to stay polite. */
const CONCURRENCY = 5;

type RowStatus =
  | "pending"
  | "checking"
  | "online"
  | "maintenance"
  | "unavailable"
  | "error";

type CheckRow = {
  id: string;
  name: string;
  url: string;
  status: RowStatus;
  detail: string | null;
  durationMs: number | null;
};

const SETTLED: RowStatus[] = ["online", "maintenance", "unavailable", "error"];

function hostOf(url: string) {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

function StatusBadge({ status }: { status: RowStatus }) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="text-muted-foreground">
          Queued
        </Badge>
      );
    case "checking":
      return (
        <Badge variant="secondary">
          <Loader2 className="animate-spin" />
          Checking
        </Badge>
      );
    case "online":
      return (
        <Badge className="bg-emerald-600/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
          <CircleCheck />
          Online
        </Badge>
      );
    case "maintenance":
      return (
        <Badge className="bg-brand-yellow-dark/10 text-brand-yellow-dark dark:bg-brand-yellow-light/10 dark:text-brand-yellow-light">
          <Wrench />
          Maintenance
        </Badge>
      );
    case "unavailable":
      return (
        <Badge variant="destructive">
          <CircleAlert />
          Not available
        </Badge>
      );
    case "error":
      return (
        <Badge variant="outline" className="text-muted-foreground">
          <TriangleAlert />
          Check failed
        </Badge>
      );
  }
}

export function SiteChecksPanel({ categories }: { categories: CategoryWithCount[] }) {
  const [rows, setRows] = useState<CheckRow[]>([]);
  const [runCategory, setRunCategory] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);

  // Bumped on every run so a superseded run cannot write into the current results.
  const runIdRef = useRef(0);

  const form = useForm<CheckRunInput>({
    resolver: zodResolver(checkRunSchema),
    defaultValues: { categoryId: "" },
  });

  function updateRow(id: string, patch: Partial<CheckRow>) {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  async function onSubmit(values: CheckRunInput) {
    const runId = runIdRef.current + 1;
    runIdRef.current = runId;
    const isStale = () => runIdRef.current !== runId;

    setIsRunning(true);
    setRunError(null);
    setRows([]);
    setRunCategory(null);

    const listed = await listSitesToCheck(values.categoryId);

    if (isStale()) return;

    if (!listed.success) {
      setRunError(listed.error);
      setIsRunning(false);
      return;
    }

    setRunCategory(listed.categoryName);
    setRows(
      listed.sites.map((site) => ({
        ...site,
        status: "pending" as const,
        detail: null,
        durationMs: null,
      })),
    );

    if (listed.sites.length === 0) {
      setIsRunning(false);
      return;
    }

    let cursor = 0;
    const tally = { online: 0, maintenance: 0, unavailable: 0, error: 0 };

    const workers = Array.from(
      { length: Math.min(CONCURRENCY, listed.sites.length) },
      async () => {
        while (cursor < listed.sites.length && !isStale()) {
          const site = listed.sites[cursor]!;
          cursor += 1;

          updateRow(site.id, { status: "checking" });
          const outcome = await checkSite(site.id);
          if (isStale()) return;

          if (outcome.success) {
            tally[outcome.result.status] += 1;
            updateRow(site.id, {
              status: outcome.result.status,
              detail: outcome.result.detail,
              durationMs: outcome.result.durationMs,
            });
          } else {
            tally.error += 1;
            updateRow(site.id, { status: "error", detail: outcome.error, durationMs: null });
          }
        }
      },
    );

    await Promise.all(workers);

    if (isStale()) return;

    setIsRunning(false);

    const checked = tally.online + tally.maintenance + tally.unavailable + tally.error;
    const label = `Checked ${checked} site${checked === 1 ? "" : "s"}`;
    const description = [
      `${tally.online} online`,
      `${tally.unavailable} not available`,
      tally.maintenance > 0 ? `${tally.maintenance} in maintenance` : null,
      tally.error > 0 ? `${tally.error} could not be checked` : null,
    ]
      .filter(Boolean)
      .join(" · ");

    if (tally.unavailable > 0 || tally.maintenance > 0 || tally.error > 0) {
      toast.warning(label, { description });
    } else {
      toast.success(label, { description });
    }
  }

  function clearResults() {
    // Bumping the run id also detaches any run still in flight.
    runIdRef.current += 1;
    setRows([]);
    setRunCategory(null);
    setRunError(null);
    setIsRunning(false);
  }

  const settledCount = rows.filter((row) => SETTLED.includes(row.status)).length;
  const onlineCount = rows.filter((row) => row.status === "online").length;
  const maintenanceCount = rows.filter((row) => row.status === "maintenance").length;
  const unavailableCount = rows.filter((row) => row.status === "unavailable").length;
  const failedCount = rows.filter((row) => row.status === "error").length;
  const progress = rows.length > 0 ? Math.round((settledCount / rows.length) * 100) : 0;

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
        <Tags className="size-8 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium text-foreground">No categories yet</p>
          <p className="text-sm text-muted-foreground">
            Add a category and assign sites to it before running checks.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-foreground font-[family-name:var(--font-admin-display)]">
          Check Sites
        </h2>
        <p className="text-sm text-muted-foreground">
          Pick a category and every site in it is requested from the server to confirm it is
          still reachable. Nothing is saved — this is a live look only.
        </p>
      </div>

      <Form {...form}>
        {/* handleSubmit is bound inside the handler because onSubmit reads a ref. */}
        <form
          onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
          className="flex max-w-xl flex-col gap-4 rounded-lg border border-border p-4 sm:p-6"
        >
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  items={categories.map((category) => ({
                    value: category.id,
                    label: category.name,
                  }))}
                  value={field.value || null}
                  onValueChange={(value) => {
                    setRunError(null);
                    field.onChange(value ?? "");
                  }}
                  disabled={isRunning}
                >
                  <FormControl>
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                        <span className="text-xs text-muted-foreground">
                          {category._count.sites} site
                          {category._count.sites === 1 ? "" : "s"}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={isRunning}>
              {isRunning ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <RadioTower className="size-4" />
              )}
              Check Sites
            </Button>
            {rows.length > 0 && !isRunning && (
              <DeleteConfirmDialog
                trigger={
                  <Button type="button" variant="outline">
                    Clear results
                  </Button>
                }
                title="Clear these results?"
                description="The results of this run will be discarded. You can run the check again at any time."
                confirmLabel="Clear"
                onConfirm={async () => {
                  clearResults();
                  return { success: true } as const;
                }}
              />
            )}
            {isRunning && (
              <span className="text-sm text-muted-foreground">
                {rows.length > 0
                  ? `Checked ${settledCount} of ${rows.length}…`
                  : "Loading sites…"}
              </span>
            )}
          </div>
        </form>
      </Form>

      {runError && (
        <p
          role="alert"
          className="max-w-xl rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {runError}
        </p>
      )}

      {!runError && rows.length === 0 && !isRunning && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
          <RadioTower className="size-8 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-foreground">
              {runCategory ? `No sites in ${runCategory}` : "No checks run yet"}
            </p>
            <p className="text-sm text-muted-foreground">
              {runCategory
                ? "Assign sites to this category, or pick another one."
                : "Select a category above and run a check to see which sites are online."}
            </p>
          </div>
        </div>
      )}

      {rows.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="text-sm font-medium text-foreground">
              {runCategory}
              <span className="ml-2 font-normal text-muted-foreground">
                {rows.length} site{rows.length === 1 ? "" : "s"}
              </span>
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-emerald-600/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                {onlineCount} online
              </Badge>
              <Badge variant="destructive">{unavailableCount} not available</Badge>
              {maintenanceCount > 0 && (
                <Badge className="bg-brand-yellow-dark/10 text-brand-yellow-dark dark:bg-brand-yellow-light/10 dark:text-brand-yellow-light">
                  {maintenanceCount} in maintenance
                </Badge>
              )}
              {failedCount > 0 && (
                <Badge variant="outline">{failedCount} could not be checked</Badge>
              )}
            </div>
          </div>

          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={rows.length}
            aria-valuenow={settledCount}
            aria-label="Check progress"
          >
            <div
              className="h-full rounded-full bg-brand-blue-900 transition-[width] duration-300 dark:bg-brand-blue-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p aria-live="polite" className="sr-only">
            {isRunning
              ? `Checked ${settledCount} of ${rows.length} sites`
              : `Check complete. ${onlineCount} online, ${unavailableCount} not available${
                  maintenanceCount > 0 ? `, ${maintenanceCount} in maintenance` : ""
                }.`}
          </p>

          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Site</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Detail</TableHead>
                  <TableHead className="text-right">Response</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <span className="font-medium text-foreground">{row.name}</span>
                      <a
                        href={row.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="mt-0.5 flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground hover:underline"
                      >
                        {hostOf(row.url)}
                        <ExternalLink className="size-3" />
                      </a>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={row.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {row.detail ?? "—"}
                    </TableCell>
                    <TableCell className="text-right text-sm tabular-nums text-muted-foreground">
                      {row.durationMs === null ? "—" : `${(row.durationMs / 1000).toFixed(1)}s`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
