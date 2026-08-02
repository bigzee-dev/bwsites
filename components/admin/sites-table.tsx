"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ExternalLink, Globe2, Pencil, Search, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { SiteFormDialog } from "@/components/admin/site-form-dialog";
import type { CategoryWithCount } from "@/lib/admin/categories";
import { deleteSite } from "@/lib/admin/site-actions";
import type { SiteWithCategories } from "@/lib/admin/sites";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function SitesTable({
  sites,
  categories,
}: {
  sites: SiteWithCategories[];
  categories: CategoryWithCount[];
}) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([{ id: "createdAt", desc: true }]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo<ColumnDef<SiteWithCategories>[]>(
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
            Site
            <ArrowUpDown className="size-3.5" />
          </Button>
        ),
        cell: ({ row }) => {
          const site = row.original;
          return (
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={site.image}
                alt={site.name}
                className="size-9 shrink-0 rounded-md border border-border object-cover"
              />
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{site.name}</p>
                <a
                  href={site.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 truncate text-xs text-muted-foreground hover:text-foreground"
                >
                  {site.url}
                  <ExternalLink className="size-3 shrink-0" />
                </a>
              </div>
            </div>
          );
        },
      },
      {
        id: "categories",
        header: "Categories",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.categories.length === 0 ? (
              <span className="text-xs text-muted-foreground">—</span>
            ) : (
              row.original.categories.map((category) => (
                <Badge key={category.id} variant="secondary">
                  {category.name}
                </Badge>
              ))
            )}
          </div>
        ),
      },
      {
        id: "tags",
        header: "Tags",
        cell: ({ row }) => {
          const tags = row.original.tags;
          return (
            <div className="flex max-w-52 flex-wrap gap-1">
              {tags.length === 0 ? (
                <span className="text-xs text-muted-foreground">—</span>
              ) : (
                tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))
              )}
              {tags.length > 3 && <Badge variant="outline">+{tags.length - 3}</Badge>}
            </div>
          );
        },
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
            Added
            <ArrowUpDown className="size-3.5" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {dateFormatter.format(row.original.createdAt)}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => {
          const site = row.original;
          return (
            <div className="flex justify-end gap-1">
              <SiteFormDialog
                mode="edit"
                site={site}
                categories={categories}
                trigger={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit ${site.name}`}
                  >
                    <Pencil className="size-4" />
                  </Button>
                }
              />
              <DeleteConfirmDialog
                trigger={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Delete ${site.name}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                }
                title={`Delete "${site.name}"?`}
                description="This will permanently remove the site from the directory. This action cannot be undone."
                onConfirm={async () => {
                  const result = await deleteSite(site.id);
                  if (result.success) router.refresh();
                  return result;
                }}
              />
            </div>
          );
        },
      },
    ],
    [categories, router]
  );

  const table = useReactTable({
    data: sites,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, filterValue) => {
      const q = String(filterValue).toLowerCase();
      const site = row.original;
      return (
        site.name.toLowerCase().includes(q) ||
        site.url.toLowerCase().includes(q) ||
        site.categories.some((category) => category.name.toLowerCase().includes(q)) ||
        site.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (sites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
        <Globe2 className="size-8 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium text-foreground">No sites yet</p>
          <p className="text-sm text-muted-foreground">
            Add your first site to start building the directory.
          </p>
        </div>
        <SiteFormDialog mode="create" categories={categories} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative max-w-xs">
        <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          placeholder="Search sites..."
          className="pl-8"
        />
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
                <TableCell colSpan={columns.length} className="py-10 text-center text-sm text-muted-foreground">
                  No sites match &ldquo;{globalFilter}&rdquo;.
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
    </div>
  );
}
