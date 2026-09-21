"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";

import Logo from "./logo";
import { NavbarSearch } from "./navbar-search";
import {
  NavCategoriesDisclosure,
  NavCategoriesMenu,
  type NavCategory,
} from "./navbar-categories";
import { SubmitSiteDialog } from "./submit-site-dialog";

const links = [{ href: "/about", label: "About", n: "01" }];

const WHATSAPP_LINK =
  "https://wa.me/26775376888?text=" +
  encodeURIComponent("Hi QuickLittleLoans! I'd like to apply for a loan.");
const FACEBOOK_LINK = "https://web.facebook.com/profile.php?id=61586555699940";

export function NavbarClient({ categories }: { categories: NavCategory[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`top-0 z-50 transition-all duration-500 bg-brand-blue-900  sticky`}
    >
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 sm:px-2 lg:px-2 py-2">
        <Link href="/" aria-label="Online Spot Logo" className="ring-none">
          <Logo />
        </Link>
        <div className="absolute left-1/2 hidden w-full max-w-sm -translate-x-1/2 px-4 md:block">
          <Suspense fallback={<div className="h-8 w-full" />}>
            <NavbarSearch />
          </Suspense>
        </div>

        <div className="flex shrink-0 items-center gap-2 justify-self-end">
          {/* Editorial nav  */}
          <nav className="hidden items-center gap-1 lg:flex ">
            <NavCategoriesMenu categories={categories} />
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group inline-flex items-baseline gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-ink-100 transition hover:text-clay-600 dark:hover:text-clay-300"
              >
                <span>{l.label}</span>
              </Link>
            ))}
            <SubmitSiteDialog
              trigger={
                <button
                  type="button"
                  className="ml-5 inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg bg-white/15 px-4 text-sm font-medium text-white transition hover:bg-white/25 border border-white/30"
                >
                  Submit a Site
                </button>
              }
            />
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-ink-200/70 bg-cream-50/90 text-ink-700  dark:border-ink-700 dark:bg-ink-900/60 dark:text-ink-200 lg:hidden"
          >
            <svg
              className={`h-4 w-4 transition-transform duration-300 ${
                open ? "rotate-90" : ""
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {open ? (
                <>
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </>
              ) : (
                <>
                  <path d="M4 8h16" />
                  <path d="M4 16h10" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile search: sits in the bar itself so finding a site never means
          opening the menu first. Hidden from md up, where the centered search
          in the bar above already covers it. */}
      <div className="bg-cream-50 dark:bg-ink-950 mx-auto w-full max-w-7xl px-4 pb-2 pt-3 sm:px-2 md:hidden">
        <Suspense fallback={<div className="h-8 w-full" />}>
          <NavbarSearch />
        </Suspense>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden ${
          open
            ? "max-h-[calc(100svh-6.5rem)] overflow-y-auto opacity-100"
            : "max-h-0 overflow-hidden opacity-0 pointer-events-none"
        } duration-500`}
      >
        <div className="border-t border-ink-200/60 bg-cream-50 px-4 pb-6 pt-3 dark:border-ink-800/70 dark:bg-ink-950">
          <nav className="flex flex-col divide-y divide-ink-100 dark:divide-ink-800">
            <NavCategoriesDisclosure
              categories={categories}
              index="01"
              onNavigate={() => setOpen(false)}
            />
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={(e) => {
                  setOpen(false);
                }}
                className="flex items-baseline justify-between py-4"
              >
                <span className="font-display text-xl text-ink-900 dark:text-cream-100">
                  {l.label}
                </span>
                <span className="font-mono text-xs tracking-widest text-ink-400 dark:text-ink-500">
                  {l.n}
                </span>
              </Link>
            ))}
          </nav>
          <SubmitSiteDialog
            onOpenChange={(dialogOpen) => {
              if (dialogOpen) setOpen(false);
            }}
            trigger={
              <button
                type="button"
                className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-ink-900 transition hover:text-brand-blue-300"
              >
                Submit a Site
              </button>
            }
          />
        </div>
      </div>
    </header>
  );
}
