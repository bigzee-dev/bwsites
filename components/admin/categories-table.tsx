"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FolderOpen, Pencil, Search, Trash2 } from "lucide-react";

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
import { CategoryFormDialog } from "@/components/admin/category-form-dialog";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { deleteCategory } from "@/lib/admin/category-actions";
import type { CategoryWithCount } from "@/lib/admin/categories";

export function CategoriesTable({ categories }: { categories: CategoryWithCount[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((category) => category.name.toLowerCase().includes(q));
  }, [categories, query]);

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
        <FolderOpen className="size-8 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium text-foreground">No categories yet</p>
          <p className="text-sm text-muted-foreground">
            Create your first category to start organizing sites.
          </p>
        </div>
        <CategoryFormDialog mode="create" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative max-w-xs">
        <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search categories..."
          className="pl-8"
        />
      </div>
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Sites</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="py-10 text-center text-sm text-muted-foreground">
                  No categories match &ldquo;{query}&rdquo;.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium text-foreground">{category.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{category._count.sites}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <CategoryFormDialog
                        mode="edit"
                        category={category}
                        trigger={
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Edit ${category.name}`}
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
                            aria-label={`Delete ${category.name}`}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        }
                        title={`Delete "${category.name}"?`}
                        description={
                          category._count.sites > 0
                            ? `This category is assigned to ${category._count.sites} site${
                                category._count.sites === 1 ? "" : "s"
                              }. Remove it from those sites before deleting.`
                            : "This action cannot be undone."
                        }
                        onConfirm={async () => {
                          const result = await deleteCategory(category.id);
                          if (result.success) router.refresh();
                          return result;
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
