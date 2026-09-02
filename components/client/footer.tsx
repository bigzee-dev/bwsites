import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";

import { COMPANY_NAME, CITY, COUNTRY } from "@/lib/constants";

/**
 * Hash targets live on the homepage, so they are prefixed to stay valid from
 * the search and site detail routes too.
 */
const SECTIONS = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Browse all sites" },
  { href: "/#categories", label: "Categories" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#why-us", label: "About" },
  { href: "/#faq", label: "FAQs" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate mt-auto overflow-hidden bg-brand-blue-900 text-cream-100 dark:bg-ink-950">
      {/* Printer's registration bar */}
      <div
        aria-hidden
        className="h-1 w-full bg-gradient-to-r from-brand-yellow-light via-brand-yellow-dark to-brand-blue-300"
      />

      {/* Atmospheric wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 right-[-8%] -z-10 h-[460px] w-[460px] rounded-full bg-brand-blue-300/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-[-6%] -z-10 h-[380px] w-[380px] rounded-full bg-brand-yellow-dark/10 blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-2 lg:px-2">
        {/* Masthead */}
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-8 border-b border-cream-100/15 py-12">
          <div className="max-w-md">
            <Link
              href="/"
              aria-label={`${COMPANY_NAME} home`}
              className="inline-flex items-center gap-x-3"
            >
              <Image
                src="/logo/onlinespot-white.png"
                alt=""
                width={200}
                height={180}
                className="block h-12 w-auto"
              />
              <span className="font-heading text-2xl font-semibold text-cream-50">
                {COMPANY_NAME}
              </span>
            </Link>

            <p className="mt-6 text-sm leading-[1.7] text-cream-100/70 text-pretty">
              A hand-checked index of the websites Botswana actually relies on —
              maintained, useful and worth your click.
            </p>
          </div>

          <Link
            href="/search"
            className="group inline-flex items-center gap-4 rounded-xl bg-brand-blue-700 px-6 py-3.5 text-sm font-medium text-ink-199 transition hover:bg-brand-yellow-dark"
          >
            Search the directory
            <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-blue-900/15 transition group-hover:translate-x-0.5">
              <svg
                aria-hidden
                className="h-3 w-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        </div>

        {/* Colophon columns */}
        <div className="grid gap-x-10 gap-y-12 py-14 sm:grid-cols-2 lg:grid-cols-12">
          {/* Sections */}
          <nav aria-label="Footer" className="lg:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-cream-100/45">
              Sections
            </p>
            <ul className="mt-6 flex flex-col gap-3.5">
              {SECTIONS.map((section) => (
                <li key={section.href}>
                  <Link
                    href={section.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-cream-100/80 transition-colors hover:text-brand-yellow-light"
                  >
                    {section.label}
                    <ArrowUpRightIcon
                      aria-hidden
                      className="size-3.5 -translate-x-1 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Colophon */}
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-cream-100/45">
              Colophon
            </p>
            <p className="mt-6 text-sm leading-[1.7] text-cream-100/70 text-pretty">
              Every listing is reviewed by hand before it earns a place in the
              index. Spotted something we have missed?
            </p>
            <Link
              href="/#contact"
              className="mt-5 inline-flex items-center gap-2 border-b border-cream-100/30 pb-1 font-mono text-[11px] uppercase tracking-[0.2em] text-cream-50 transition-colors hover:border-brand-yellow-light hover:text-brand-yellow-light"
            >
              Suggest a site
              <ArrowUpRightIcon aria-hidden className="size-3.5" />
            </Link>

            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-cream-100/45">
              {CITY}, {COUNTRY}
            </p>
          </div>
        </div>
      </div>

      {/* Oversized wordmark, bled off the baseline */}
      <div
        aria-hidden
        className="pointer-events-none -mb-2 select-none overflow-hidden px-4 sm:px-2 lg:px-2"
      >
        <p className="mx-auto max-w-7xl whitespace-nowrap font-heading text-[19vw] font-bold leading-none tracking-tighter text-cream-100/[0.07] lg:text-[12rem]">
          {COMPANY_NAME}
        </p>
      </div>

      {/* Imprint line */}
      <div className="border-t border-cream-100/15">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-8 gap-y-2 px-4 py-6 font-mono text-[11px] uppercase tracking-[0.2em] text-cream-100/50 sm:px-2 lg:px-2">
          <p>
            © {year} {COMPANY_NAME}
          </p>
          <p>
            Made in {CITY} — {COUNTRY}
          </p>
        </div>
      </div>
    </footer>
  );
}
