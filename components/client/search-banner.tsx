"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SearchBanner() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = query.trim();
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");

    // The banner is a jumping-off point, not a filter - leave it empty so
    // returning to the homepage never shows a stale term.
    setQuery("");
  }

  return (
    <section className="relative isolate overflow-hidden bg-brand-blue-900">
      {/* Atmospheric wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-[-6%] -z-10 h-[380px] w-[380px] rounded-full bg-brand-yellow-dark/10 blur-3xl"
      />

      {/* Oversized magnifier, bled off the right edge */}
      <svg
        aria-hidden
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        className="pointer-events-none absolute top-1/2 -right-20 -z-10 hidden h-[420px] w-[420px] -translate-y-1/2 -rotate-12 text-cream-100/[0.08] lg:block"
      >
        <circle cx="82" cy="82" r="58" />
        <path d="M124 124 L176 176" strokeLinecap="round" />
      </svg>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-2 lg:px-2 lg:py-16">
        <div className="max-w-xl">
          <h2 className="flex items-center gap-4 font-heading text-3xl font-bold text-cream-50 sm:text-4xl">
            <span
              aria-hidden
              className="hidden h-8 w-1 shrink-0 rounded bg-brand-yellow-light sm:block"
            />
            Search for a site
          </h2>

          <form
            role="search"
            action="/search"
            method="get"
            autoComplete="off"
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Input
              type="search"
              name="q"
              aria-label="Search sites"
              placeholder="Try 'banks', 'hotels', 'news'..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-12 flex-1 border-cream-100/25 bg-white/10 text-cream-50 placeholder:text-cream-100/50 focus-visible:border-brand-yellow-light focus-visible:ring-brand-yellow-light/30"
            />
            <Button
              type="submit"
              className="h-12 shrink-0 gap-2 bg-brand-yellow-light px-8 text-brand-blue-900 hover:bg-brand-yellow-dark"
            >
              <SearchIcon aria-hidden className="size-4" />
              Search
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
