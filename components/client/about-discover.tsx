import { ArrowRightIcon, SearchIcon } from "lucide-react";

import { ScrollTopLink } from "@/components/client/scroll-top-link";
import { COMPANY_NAME, COUNTRY } from "@/lib/constants";

/** Example terms from the copy - each one runs a real search. */
const EXAMPLE_TERMS = [
  "Tourism",
  "Banking",
  "Jobs",
  "Education",
  "Health",
] as const;

export function AboutDiscover() {
  return (
    <section className="relative isolate overflow-hidden border-y border-ink-200/60 bg-cream-100/50 dark:border-ink-800/70 dark:bg-ink-900/40">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-[-6%] -z-10 h-[380px] w-[380px] rounded-full bg-brand-yellow-dark/10 blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-2 lg:px-2">
        <div className="grid gap-x-10 gap-y-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-500 dark:text-ink-300">
              What you will find
            </p>
            <h2 className="mt-3 flex items-center gap-4 font-heading text-3xl font-bold text-brand-blue-900 sm:text-4xl dark:text-brand-blue-300">
              <span
                aria-hidden
                className="hidden h-8 w-1 shrink-0 rounded bg-brand-yellow-light sm:block"
              />
              Search a category, not the whole web
            </h2>
          </div>

          <div className="lg:col-span-7 lg:pt-11">
            <p className="max-w-2xl text-base leading-[1.8] text-pretty text-ink-700 dark:text-ink-200">
              Whether you are looking for government services, tourism
              information, financial institutions, educational resources,
              healthcare providers, online shopping, business services, or any
              other category, {COMPANY_NAME} makes it easy to discover the best
              websites {COUNTRY} has to offer.
            </p>

            <p className="mt-5 max-w-2xl text-base leading-[1.8] text-pretty text-ink-700 dark:text-ink-200">
              Instead of searching through pages of search engine results,
              simply search for a category or service and {COMPANY_NAME} will
              present a carefully curated selection of websites that we believe
              are the best choices for that need.
            </p>
          </div>
        </div>

        {/* Example searches - live links into the directory */}
        <div className="mt-12 flex flex-wrap items-center gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-500 dark:text-ink-300">
            Try
          </span>

          {EXAMPLE_TERMS.map((term, index) => (
            <ScrollTopLink
              key={term}
              href={`/search?q=${encodeURIComponent(term.toLowerCase())}`}
              className="group inline-flex animate-in fade-in slide-in-from-bottom-2 items-center gap-2.5 rounded-full border border-ink-200/80 bg-cream-50 py-2.5 pr-4 pl-3.5 text-sm font-medium text-brand-blue-900 transition-colors duration-500 hover:border-brand-yellow-light hover:bg-brand-yellow-light/15 dark:border-ink-700 dark:bg-ink-900 dark:text-brand-blue-300 dark:hover:border-brand-yellow-dark dark:hover:bg-brand-yellow-dark/15"
              style={{
                animationDelay: `${index * 60}ms`,
                animationFillMode: "backwards",
              }}
            >
              <SearchIcon
                aria-hidden
                className="size-3.5 text-ink-400 transition-colors group-hover:text-brand-yellow-dark dark:text-ink-400"
              />
              {term}
            </ScrollTopLink>
          ))}

          <ScrollTopLink
            href="/#categories"
            className="group ml-1 inline-flex items-center gap-2 border-b border-ink-300 pb-1 font-sans text-[12px] uppercase tracking-[0.2em] text-ink-700 transition-colors hover:border-brand-yellow-light hover:text-brand-blue-900 dark:border-ink-700 dark:text-ink-200 dark:hover:text-brand-yellow-light"
          >
            All categories
            <ArrowRightIcon
              aria-hidden
              className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </ScrollTopLink>
        </div>
      </div>
    </section>
  );
}
