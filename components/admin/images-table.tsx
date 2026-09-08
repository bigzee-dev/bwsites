"use client";

import { useMemo, useState } from "react";
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  ImageOff,
  Search,
  TriangleAlert,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { R2Image } from "@/lib/admin/images";

const PAGE_SIZE = 50;

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export function ImagesTable({
  images,
  error,
}: {
  images: R2Image[];
  error?: string | null;
}) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "uploadedAt", desc: true },
  ]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo<ColumnDef<R2Image>[]>(
    () => [
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
            Image
            <ArrowUpDown className="size-3.5" />
          </Button>
        ),
        cell: ({ row }) => {
          const image = row.original;
          return (
            <div className="flex items-center gap-3">
              <a
                href={image.url}
                target="_blank"
                rel="noreferrer"
                title="Open full size"
                className="shrink-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={image.name}
                  loading="lazy"
                  decoding="async"
                  className="h-12 w-20 rounded-md border border-border bg-muted object-cover transition-opacity hover:opacity-90"
                />
              </a>
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{image.name}</p>
                <p className="truncate text-xs text-muted-foreground">{image.key}</p>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "size",
        header: ({ column }) => (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="-ml-2.5"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Size
            <ArrowUpDown className="size-3.5" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="text-sm whitespace-nowrap text-muted-foreground">
            {formatFileSize(row.original.size)}
          </span>
        ),
      },
      {
        accessorKey: "uploadedAt",
        header: ({ column }) => (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="-ml-2.5"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Uploaded
            <ArrowUpDown className="size-3.5" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="text-sm whitespace-nowrap text-muted-foreground">
            {row.original.uploadedAt
              ? dateFormatter.format(new Date(row.original.uploadedAt))
              : "—"}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => {
          const image = row.original;
          return (
            <div className="flex justify-end">
              <a
                href={`/api/admin/images/download?key=${encodeURIComponent(image.key)}`}
                download={image.name}
                aria-label={`Download ${image.name}`}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                <Download className="size-3.5" />
                Download
              </a>
            </div>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: images,
    columns,
    state: { sorting, globalFilter },
    initialState: { pagination: { pageSize: PAGE_SIZE } },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getRowId: (row) => row.key,
    // Every whitespace-separated term must appear, so "hotel webp" narrows twice.
    globalFilterFn: (row, _columnId, filterValue) => {
      const haystack = row.original.key.toLowerCase();
      return String(filterValue)
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean)
        .every((term) => haystack.includes(term));
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-destructive/40 py-16 text-center">
        <TriangleAlert className="size-8 text-destructive" />
        <div>
          <p className="text-sm font-medium text-foreground">Could not load the bucket</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
        <ImageOff className="size-8 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium text-foreground">No images yet</p>
          <p className="text-sm text-muted-foreground">
            Images uploaded with a site will appear here.
          </p>
        </div>
      </div>
    );
  }

  const { pageIndex } = table.getState().pagination;
  const matchCount = table.getFilteredRowModel().rows.length;
  const pageCount = table.getPageCount();
  const firstOnPage = matchCount === 0 ? 0 : pageIndex * PAGE_SIZE + 1;
  const lastOnPage = Math.min((pageIndex + 1) * PAGE_SIZE, matchCount);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            placeholder="Search images by name..."
            className="pl-8"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {matchCount === 0
            ? `No matches in ${images.length} images`
            : `Showing ${firstOnPage}–${lastOnPage} of ${matchCount} ${globalFilter ? "matches" : "images"}`}
        </p>
      </div>

      <div className="rounded-lg border border-border">
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
                  No images match &ldquo;{globalFilter}&rdquo;.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Page {pageIndex + 1} of {pageCount}
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              <ChevronLeft className="size-3.5" />
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              Next
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
