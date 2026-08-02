"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { scrollToHash } from "@/lib/scroll";
import Logo from "./logo";
import { NavbarSearch } from "./navbar-search";

const links = [
  { href: "#how-it-works", label: "How It works", n: "02" },
  { href: "#why-us", label: "About", n: "03" },
  { href: "#faq", label: "FAQs", n: "04" },
  { href: "#contact", label: "Contact us", n: "05" },
];

const WHATSAPP_LINK =
  "https://wa.me/26775376888?text=" +
  encodeURIComponent("Hi QuickLittleLoans! I'd like to apply for a loan.");
const FACEBOOK_LINK = "https://web.facebook.com/profile.php?id=61586555699940";

export function Navbar() {
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
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 sm:px-2 lg:px-2 py-5">
        <Link href="/" aria-label="MicroLending home" className="shrink-0">
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
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={(e) => scrollToHash(e, l.href)}
                className="group inline-flex items-baseline gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-ink-100 transition hover:text-clay-600 dark:text-ink-200 dark:hover:text-clay-300"
              >
                <span>{l.label}</span>
              </Link>
            ))}
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

      {/* Mobile menu */}
      <div
        className={`lg:hidden ${
          open
            ? "max-h-[480px] opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        } overflow-hidden duration-500`}
      >
        <div className="border-t border-ink-200/60 bg-cream-50 px-4 pb-6 pt-3 dark:border-ink-800/70 dark:bg-ink-950">
          <Suspense fallback={<div className="h-8 w-full" />}>
            <NavbarSearch
              className="pb-3 md:hidden"
              inputClassName="text-ink-900 placeholder:text-ink-400 border-ink-200 focus-visible:ring-ink-300 dark:text-ink-100 dark:border-ink-700"
              buttonClassName="bg-brand-blue-900 text-white dark:bg-brand-blue-300 dark:text-brand-blue-900"
            />
          </Suspense>
          <nav className="flex flex-col divide-y divide-ink-100 dark:divide-ink-800">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={(e) => {
                  scrollToHash(e, l.href);
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
          <Link
            href="#contact"
            onClick={(e) => {
              scrollToHash(e, "#contact");
              setOpen(false);
            }}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 px-4 py-3 text-sm font-medium text-cream-50 dark:bg-cream-100 dark:text-ink-950"
          >
            Apply now
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
