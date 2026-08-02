"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CategoryFormDialog } from "@/components/admin/category-form-dialog";
import { SiteFormDialog } from "@/components/admin/site-form-dialog";
import type { CategoryWithCount } from "@/lib/admin/categories";

export function GlobalActions({ categories }: { categories: CategoryWithCount[] }) {
  return (
    <div className="flex items-center gap-2">
      <CategoryFormDialog
        mode="create"
        trigger={
          <Button type="button" variant="outline">
            <Plus className="size-4" />
            <span className="hidden sm:inline">Add Category</span>
          </Button>
        }
      />
      <SiteFormDialog
        mode="create"
        categories={categories}
        trigger={
          <Button type="button">
            <Plus className="size-4" />
            <span className="hidden sm:inline">Add Site</span>
          </Button>
        }
      />
    </div>
  );
}
