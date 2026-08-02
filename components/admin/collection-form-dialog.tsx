"use client";

import { useState, useTransition, type ReactElement } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { Inter } from "next/font/google";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SiteMultiSelect } from "@/components/admin/site-multi-select";
import { createCollection, updateCollection } from "@/lib/admin/collection-actions";
import type { CollectionWithSites } from "@/lib/admin/collections";
import type { SiteForSelection } from "@/lib/admin/sites";
import { collectionSchema, type CollectionInput } from "@/lib/admin/validation";

const inter = Inter({
  variable: "--font-admin-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

type CollectionFormDialogProps =
  | { mode: "create"; sites: SiteForSelection[]; trigger?: ReactElement }
  | {
      mode: "edit";
      sites: SiteForSelection[];
      collection: CollectionWithSites;
      trigger: ReactElement;
    };

function getDefaultValues(props: CollectionFormDialogProps): CollectionInput {
  if (props.mode === "edit") {
    return {
      name: props.collection.name,
      siteIds: props.collection.sites.map((site) => site.id),
    };
  }
  return { name: "", siteIds: [] };
}

export function CollectionFormDialog(props: CollectionFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<CollectionInput>({
    resolver: zodResolver(collectionSchema),
    defaultValues: getDefaultValues(props),
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      form.reset(getDefaultValues(props));
    }
  }

  function onSubmit(values: CollectionInput) {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("name", values.name);
      values.siteIds.forEach((id) => formData.append("siteIds", id));

      const result =
        props.mode === "edit"
          ? await updateCollection(props.collection.id, formData)
          : await createCollection(formData);

      if (!result.success) {
        form.setError("root", { message: result.error });
        return;
      }

      toast.success(props.mode === "edit" ? "Collection updated" : "Collection created");
      setOpen(false);
      router.refresh();
    });
  }

  const trigger =
    props.trigger ??
    (
      <Button type="button">
        <Plus className="size-4" />
        Create Collection
      </Button>
    );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent
        className={`${inter.variable} font-[family-name:var(--font-admin-sans)] max-h-[85vh] overflow-y-auto sm:max-w-lg`}
      >
        <DialogHeader>
          <DialogTitle>{props.mode === "edit" ? "Edit collection" : "Create collection"}</DialogTitle>
          <DialogDescription>
            {props.mode === "edit"
              ? "Update the collection name and its sites."
              : "Group up to six sites together to feature on the homepage."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {form.formState.errors.root && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {form.formState.errors.root.message}
              </p>
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Top Sites" autoFocus {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="siteIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sites</FormLabel>
                  <SiteMultiSelect sites={props.sites} value={field.value} onChange={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="size-4 animate-spin" />}
                {props.mode === "edit" ? "Save changes" : "Create collection"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
