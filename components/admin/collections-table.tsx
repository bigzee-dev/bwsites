"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Layers, Pencil, Search, Trash2 } from "lucide-react";

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
import { CollectionFormDialog } from "@/components/admin/collection-form-dialog";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { deleteCollection } from "@/lib/admin/collection-actions";
import type { CollectionWithSites } from "@/lib/admin/collections";
import type { SiteForSelection } from "@/lib/admin/sites";

export function CollectionsTable({
  collections,
  sites,
}: {
  collections: CollectionWithSites[];
  sites: SiteForSelection[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return collections;
    return collections.filter((collection) => collection.name.toLowerCase().includes(q));
  }, [collections, query]);

  if (collections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
        <Layers className="size-8 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium text-foreground">No collections yet</p>
          <p className="text-sm text-muted-foreground">
            Create your first collection to feature sites on the homepage.
          </p>
        </div>
        <CollectionFormDialog mode="create" sites={sites} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search collections..."
            className="pl-8"
          />
        </div>
        <CollectionFormDialog mode="create" sites={sites} />
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
                  No collections match &ldquo;{query}&rdquo;.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((collection) => (
                <TableRow key={collection.id}>
                  <TableCell className="font-medium text-foreground">{collection.name}</TableCell>
                  <TableCell>
                    <div className="flex max-w-md flex-wrap items-center gap-1.5">
                      <Badge variant="secondary">{collection.sites.length}/6</Badge>
                      {collection.sites.slice(0, 3).map((site) => (
                        <Badge key={site.id} variant="outline">
                          {site.name}
                        </Badge>
                      ))}
                      {collection.sites.length > 3 && (
                        <Badge variant="outline">+{collection.sites.length - 3}</Badge>
                      )}
                      {collection.sites.length === 0 && (
                        <span className="text-xs text-muted-foreground">No sites yet</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <CollectionFormDialog
                        mode="edit"
                        collection={collection}
                        sites={sites}
                        trigger={
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Edit ${collection.name}`}
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
                            aria-label={`Delete ${collection.name}`}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        }
                        title={`Delete "${collection.name}"?`}
                        description="This will permanently delete this collection. The sites in it will not be affected. This action cannot be undone."
                        onConfirm={async () => {
                          const result = await deleteCollection(collection.id);
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
