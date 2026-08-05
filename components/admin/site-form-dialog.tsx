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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CategoryMultiSelect } from "@/components/admin/category-multi-select";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { TagsInput } from "@/components/admin/tags-input";
import type { CategoryWithCount } from "@/lib/admin/categories";
import { createSite, updateSite } from "@/lib/admin/site-actions";
import type { SiteWithCategories } from "@/lib/admin/sites";
import { siteSchema, type SiteInput } from "@/lib/admin/validation";

const inter = Inter({
  variable: "--font-admin-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

type SiteFormDialogProps =
  | { mode: "create"; categories: CategoryWithCount[]; trigger?: ReactElement }
  | {
      mode: "edit";
      categories: CategoryWithCount[];
      site: SiteWithCategories;
      trigger: ReactElement;
    };

function getDefaultValues(props: SiteFormDialogProps): SiteInput {
  if (props.mode === "edit") {
    return {
      name: props.site.name,
      url: props.site.url,
      slug: props.site.slug ?? "",
      description: props.site.description,
      facebookUrl: props.site.facebookUrl ?? "",
      whatsapp: props.site.whatsapp ?? "",
      rank: props.site.rank,
      tags: props.site.tags,
      categoryIds: props.site.categories.map((category) => category.id),
    };
  }
  return {
    name: "",
    url: "",
    slug: "",
    description: "",
    facebookUrl: "",
    whatsapp: "",
    rank: 0,
    tags: [],
    categoryIds: [],
  };
}

export function SiteFormDialog(props: SiteFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | undefined>();

  const form = useForm<SiteInput>({
    resolver: zodResolver(siteSchema),
    defaultValues: getDefaultValues(props),
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      form.reset(getDefaultValues(props));
      setImageFile(null);
      setImageError(undefined);
    }
  }

  function onSubmit(values: SiteInput) {
    if (props.mode === "create" && !imageFile) {
      setImageError("An image is required");
      return;
    }
    setImageError(undefined);

    startTransition(async () => {
      const formData = new FormData();
      formData.set("name", values.name);
      formData.set("url", values.url);
      formData.set("slug", values.slug ?? "");
      formData.set("description", values.description);
      formData.set("facebookUrl", values.facebookUrl ?? "");
      formData.set("whatsapp", values.whatsapp ?? "");
      formData.set("rank", String(values.rank));
      values.tags.forEach((tag) => formData.append("tags", tag));
      values.categoryIds.forEach((id) => formData.append("categoryIds", id));
      if (imageFile) formData.set("image", imageFile);

      const result =
        props.mode === "edit"
          ? await updateSite(props.site.id, formData)
          : await createSite(formData);

      if (!result.success) {
        form.setError("root", { message: result.error });
        return;
      }

      toast.success(props.mode === "edit" ? "Site updated" : "Site created");
      setOpen(false);
      router.refresh();
    });
  }

  const trigger =
    props.trigger ??
    (
      <Button type="button">
        <Plus className="size-4" />
        Add Site
      </Button>
    );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent
        className={`${inter.variable} font-[family-name:var(--font-admin-sans)] max-h-[85vh] overflow-y-auto sm:max-w-lg`}
      >
        <DialogHeader>
          <DialogTitle>{props.mode === "edit" ? "Edit site" : "Add site"}</DialogTitle>
          <DialogDescription>
            {props.mode === "edit"
              ? "Update this site's details."
              : "Add a new site to the directory."}
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.co.bw" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="example-site" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-2">
              <Label htmlFor="site-image">Image</Label>
              <ImageUploadField
                file={imageFile}
                onChange={setImageFile}
                existingImageUrl={props.mode === "edit" ? props.site.image : null}
                error={imageError}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categories</FormLabel>
                  <CategoryMultiSelect
                    categories={props.categories}
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <TagsInput value={field.value} onChange={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="facebookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook URL (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://facebook.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp number (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="+267 71 234 567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rank (0-100)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      {...field}
                      value={Number.isNaN(field.value) ? "" : field.value}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? 0 : e.target.valueAsNumber,
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="size-4 animate-spin" />}
                {props.mode === "edit" ? "Save changes" : "Create site"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
