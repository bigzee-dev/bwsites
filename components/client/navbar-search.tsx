"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function NavbarSearch({
  className,
  inputClassName,
  buttonClassName,
}: {
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(urlQuery);
  const [syncedQuery, setSyncedQuery] = useState(urlQuery);

  if (urlQuery !== syncedQuery) {
    setSyncedQuery(urlQuery);
    setQuery(urlQuery);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(
      trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search",
    );
  }

  return (
    <form role="search" onSubmit={handleSubmit} className={cn(className)}>
      <Field orientation="horizontal">
        <Input
          type="search"
          name="q"
          placeholder="Search sites..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className={cn(
            "bg-white/5 text-ink-100 placeholder:text-neutral-400 border-ink-300 focus-visible:ring-ink-200",
            inputClassName,
          )}
        />
        <Button
          type="submit"
          className={cn("bg-white text-ink-700 shrink-0", buttonClassName)}
        >
          Search
        </Button>
      </Field>
    </form>
  );
}
