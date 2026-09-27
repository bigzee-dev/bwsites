"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, SearchIcon } from "lucide-react";

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(
      trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search",
    );
  }

  return (
    <form
      role="search"
      action="/search"
      method="get"
      autoComplete="off"
      onSubmit={handleSubmit}
      className="group/search relative w-full max-w-2xl"
    >
      {/* Soft halo that wakes up on focus */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-1 rounded-[22px] bg-linear-to-r from-brand-blue-300/0 via-brand-yellow-light/0 to-brand-blue-300/0 opacity-0 blur-md transition duration-500 group-focus-within/search:from-brand-blue-300/40 group-focus-within/search:via-brand-yellow-light/30 group-focus-within/search:to-brand-blue-300/40 group-focus-within/search:opacity-100"
      />

      <div className="relative flex items-center gap-2 rounded-2xl border border-brand-blue-900/15 bg-white/90 p-1.5 shadow-[0_18px_50px_-20px_rgba(1,74,117,0.45)] backdrop-blur-sm transition-colors group-focus-within/search:border-brand-blue-500/60 dark:border-white/10 dark:bg-ink-900/80 dark:shadow-[0_18px_50px_-20px_rgba(0,0,0,0.8)] dark:group-focus-within/search:border-brand-yellow-light/50">
        <SearchIcon
          aria-hidden
          className="ml-3 size-5 shrink-0 text-brand-blue-500 transition-colors group-focus-within/search:text-brand-blue-900 dark:text-ink-300 dark:group-focus-within/search:text-brand-yellow-light"
        />

        <input
          type="search"
          name="q"
          aria-label="Search sites"
          placeholder="Search banks, hotels, news..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="h-12 min-w-0 flex-1 bg-transparent text-base text-ink-900 outline-none placeholder:text-ink-400 [&::-webkit-search-cancel-button]:hidden dark:text-cream-50 dark:placeholder:text-ink-300"
        />

        <button
          type="submit"
          className="group/btn inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-brand-blue-900 px-4 text-sm font-semibold text-white transition hover:bg-brand-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-yellow-light active:scale-[0.98] sm:px-6 "
        >
          <span className="hidden sm:inline">Search</span>
          <ArrowRightIcon
            aria-hidden
            className="size-4 transition-transform group-hover/btn:translate-x-0.5"
          />
          <span className="sr-only sm:hidden">Search</span>
        </button>
      </div>
    </form>
  );
}
