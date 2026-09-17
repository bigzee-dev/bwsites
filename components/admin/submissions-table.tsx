"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  type ColumnDef,
  type RowSelectionState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ExternalLink, Inbox, Search as SearchIcon, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { SubmissionDetailDialog } from "@/components/admin/submission-detail-dialog";
import { deleteSubmission, deleteSubmissions } from "@/lib/admin/submission-actions";
import type { SubmissionRecord } from "@/lib/admin/submissions";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function SubmissionsTable({ submissions }: { submissions: SubmissionRecord[] }) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([{ id: "createdAt", desc: true }]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionRecord | null>(null);

  const columns = useMemo<ColumnDef<SubmissionRecord>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={!table.getIsAllPageRowsSelected() && table.getIsSomePageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label={`Select submission from ${row.original.name}`}
          />
        ),
        enableSorting: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="-ml-2.5"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Submitted by
            <ArrowUpDown className="size-3.5" />
          </Button>
        ),
        cell: ({ row }) => {
          const submission = row.original;
          return (
            <button
              type="button"
              onClick={() => setSelectedSubmission(submission)}
              className="min-w-0 cursor-pointer text-left outline-none focus-visible:underline"
            >
              <p className="truncate font-medium text-foreground">{submission.name}</p>
              <p className="truncate text-xs text-muted-foreground">{submission.email}</p>
            </button>
          );
        },
      },
      {
        accessorKey: "url",
        header: "Website",
        cell: ({ row }) => (
          <a
            href={row.original.url}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="flex max-w-64 items-center gap-1 truncate text-sm text-muted-foreground hover:text-foreground"
          >
            <span className="truncate">{row.original.url}</span>
            <ExternalLink className="size-3 shrink-0" />
          </a>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <p className="line-clamp-2 max-w-72 text-sm text-muted-foreground">
            {row.original.description || "—"}
          </p>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="-ml-2.5"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Received
            <ArrowUpDown className="size-3.5" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="text-sm whitespace-nowrap text-muted-foreground">
            {dateFormatter.format(row.original.createdAt)}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => {
          const submission = row.original;
          return (
            <div className="flex justify-end" onClick={(event) => event.stopPropagation()}>
              <DeleteConfirmDialog
                trigger={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Delete submission from ${submission.name}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                }
                title="Delete submission?"
                description={`This will permanently remove the submission from ${submission.name} (${submission.url}). This action cannot be undone.`}
                onConfirm={async () => {
                  const result = await deleteSubmission(submission.id);
                  if (result.success) {
                    setSelectedSubmission((current) =>
                      current?.id === submission.id ? null : current,
                    );
                    router.refresh();
                  }
                  return result;
                }}
              />
            </div>
          );
        },
      },
    ],
    [router],
  );

  const table = useReactTable({
    data: submissions,
    columns,
    state: { sorting, globalFilter, rowSelection },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => row.id,
    globalFilterFn: (row, _columnId, filterValue) => {
      const q = String(filterValue).toLowerCase();
      const { name, email, url, description } = row.original;
      return [name, email, url, description ?? ""].some((value) =>
        value.toLowerCase().includes(q),
      );
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const selectedIds = Object.keys(rowSelection);

  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
        <Inbox className="size-8 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium text-foreground">No submissions yet</p>
          <p className="text-sm text-muted-foreground">
            Sites submitted by visitors will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <SearchIcon className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            placeholder="Filter submissions..."
            className="pl-8"
          />
        </div>
        {selectedIds.length > 0 && (
          <DeleteConfirmDialog
            trigger={
              <Button type="button" variant="destructive" size="sm">
                <Trash2 className="size-4" />
                Delete {selectedIds.length} selected
              </Button>
            }
            title={`Delete ${selectedIds.length} submission${selectedIds.length === 1 ? "" : "s"}?`}
            description="This will permanently remove the selected submissions. This action cannot be undone."
            onConfirm={async () => {
              const result = await deleteSubmissions(selectedIds);
              if (result.success) {
                setRowSelection({});
                setSelectedSubmission(null);
                router.refresh();
              }
              return result;
            }}
          />
        )}
      </div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  No submissions match &ldquo;{globalFilter}&rdquo;.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-selected={row.getIsSelected()}
                  onClick={() => setSelectedSubmission(row.original)}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      onClick={
                        cell.column.id === "select"
                          ? (event) => event.stopPropagation()
                          : undefined
                      }
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <SubmissionDetailDialog
        submission={selectedSubmission}
        open={selectedSubmission !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedSubmission(null);
        }}
      />
    </div>
  );
}
