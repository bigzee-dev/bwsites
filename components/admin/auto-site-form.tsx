"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CategoryWithCount } from "@/lib/admin/categories";
import { autoCreateSite } from "@/lib/admin/auto-site-actions";
import { autoSiteSchema, type AutoSiteInput } from "@/lib/admin/validation";

const EMPTY_VALUES: AutoSiteInput = {
  name: "",
  url: "",
  imageName: "",
  categoryId: "",
};

export function AutoSiteForm({ categories }: { categories: CategoryWithCount[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<AutoSiteInput>({
    resolver: zodResolver(autoSiteSchema),
    defaultValues: EMPTY_VALUES,
  });

  function onSubmit(values: AutoSiteInput) {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("name", values.name);
      formData.set("url", values.url);
      formData.set("imageName", values.imageName);
      formData.set("categoryId", values.categoryId);

      const result = await autoCreateSite(formData);

      if (!result.success) {
        form.setError("root", { message: result.error });
        return;
      }

      if (result.warning) {
        toast.warning("Site created", { description: result.warning });
      } else {
        toast.success("Site created");
      }

      form.reset(EMPTY_VALUES);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-foreground font-[family-name:var(--font-admin-display)]">
          Automatically Create a Site
        </h2>
        <p className="text-sm text-muted-foreground">
          A screenshot of the URL is captured and converted to WebP, Claude reads the
          site and writes the description and tags, and the site is added to the
          directory.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex max-w-xl flex-col gap-4 rounded-lg border border-border p-4 sm:p-6"
        >
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
                <FormLabel>Site name</FormLabel>
                <FormControl>
                  <Input placeholder="Do Business Botswana" {...field} />
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
                <FormLabel>Site URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.co.bw" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image name</FormLabel>
                <FormControl>
                  <Input placeholder="do-business-botswana" {...field} />
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Saved as{" "}
                  <span className="font-medium">
                    &lt;id&gt;-{field.value || "name"}.webp
                  </span>
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

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
                  onValueChange={(value) => field.onChange(value ?? "")}
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Wand2 className="size-4" />
              )}
              Create site
            </Button>
            {isPending && (
              <span className="text-sm text-muted-foreground">
                Capturing screenshot and writing the description…
              </span>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
