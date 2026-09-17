"use client";

import { useState, useTransition, type ReactElement } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createSubmission } from "@/lib/client/submission-actions";
import { submissionSchema, type SubmissionInput } from "@/lib/client/validation";

const EMPTY_VALUES: SubmissionInput = {
  name: "",
  email: "",
  url: "",
  description: "",
};

export function SubmitSiteDialog({
  trigger,
  onOpenChange,
}: {
  trigger?: ReactElement;
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<SubmissionInput>({
    resolver: zodResolver(submissionSchema),
    defaultValues: EMPTY_VALUES,
  });

  function handleOpenChange(next: boolean) {
    if (isPending) return;
    setOpen(next);
    onOpenChange?.(next);
    if (next) {
      setSubmitted(false);
      setError(null);
      form.reset(EMPTY_VALUES);
    }
  }

  function onSubmit(values: SubmissionInput) {
    setError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("name", values.name);
      formData.set("email", values.email);
      formData.set("url", values.url);
      formData.set("description", values.description ?? "");

      const result = await createSubmission(formData);

      if (!result.success) {
        setError(result.error);
        return;
      }

      form.reset(EMPTY_VALUES);
      setSubmitted(true);
    });
  }

  function submitAnother() {
    setSubmitted(false);
    setError(null);
    form.reset(EMPTY_VALUES);
  }

  const defaultTrigger = (
    <Button
      type="button"
      className="rounded-full bg-brand-yellow-light px-4 font-semibold text-ink-900 hover:bg-brand-yellow-dark"
    >
      <Plus className="size-4" />
      Submit a Site
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger ?? defaultTrigger} />
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-lg">
        {submitted ? (
          <>
            <DialogHeader>
              <div className="flex size-11 items-center justify-center rounded-full bg-forest-100 text-forest-700 dark:bg-forest-900 dark:text-forest-200">
                <CheckCircle2 className="size-6" strokeWidth={1.75} />
              </div>
              <DialogTitle>Thank you &mdash; submission received</DialogTitle>
              <DialogDescription>
                Our team will review the site and get in touch if we need more
                details.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={submitAnother}>
                Submit another
              </Button>
              <DialogClose render={<Button type="button" />}>Done</DialogClose>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Submit a site</DialogTitle>
              <DialogDescription>
                Know a Botswana website worth featuring? Tell us about it and
                we&rsquo;ll take a look.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
                noValidate
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your name</FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="name"
                            placeholder="Jane Moeti"
                            disabled={isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            autoComplete="email"
                            placeholder="jane@example.com"
                            disabled={isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl>
                        <Input
                          inputMode="url"
                          placeholder="example.co.bw"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          placeholder="What does the site do, and why should it be listed?"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional, but it helps us review faster.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {error && (
                  <p role="alert" className="text-sm text-destructive">
                    {error}
                  </p>
                )}
                <DialogFooter>
                  <DialogClose
                    render={
                      <Button type="button" variant="outline" disabled={isPending} />
                    }
                  >
                    Cancel
                  </DialogClose>
                  <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="size-4 animate-spin" />}
                    {isPending ? "Submitting..." : "Submit site"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
