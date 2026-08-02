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
import { createCategory, updateCategory } from "@/lib/admin/category-actions";
import type { CategoryWithCount } from "@/lib/admin/categories";
import { categorySchema, type CategoryInput } from "@/lib/admin/validation";

const inter = Inter({
  variable: "--font-admin-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

type CategoryFormDialogProps =
  | { mode: "create"; trigger?: ReactElement }
  | { mode: "edit"; category: CategoryWithCount; trigger: ReactElement };

export function CategoryFormDialog(props: CategoryFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const defaultName = props.mode === "edit" ? props.category.name : "";

  const form = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: defaultName },
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      form.reset({ name: defaultName });
    }
  }

  function onSubmit(values: CategoryInput) {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("name", values.name);

      const result =
        props.mode === "edit"
          ? await updateCategory(props.category.id, formData)
          : await createCategory(formData);

      if (!result.success) {
        form.setError("name", { message: result.error });
        return;
      }

      toast.success(props.mode === "edit" ? "Category updated" : "Category created");
      setOpen(false);
      router.refresh();
    });
  }

  const trigger =
    props.trigger ??
    (
      <Button type="button">
        <Plus className="size-4" />
        Add Category
      </Button>
    );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent className={`${inter.variable} font-[family-name:var(--font-admin-sans)]`}>
        <DialogHeader>
          <DialogTitle>{props.mode === "edit" ? "Edit category" : "Add category"}</DialogTitle>
          <DialogDescription>
            {props.mode === "edit"
              ? "Update the category name."
              : "Create a new category sites can be assigned to."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input autoFocus {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="size-4 animate-spin" />}
                {props.mode === "edit" ? "Save changes" : "Create category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
