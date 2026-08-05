import Image from "next/image";
import Link from "next/link";

import { lgbutton } from "@/app/css-classes";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Backdrop layers */}
      <div className="absolute inset-0 -z-20 bg-cream-50 dark:bg-ink-950" />
      <div className="absolute inset-0 -z-10 grain pointer-events-none" />
      <div className="absolute -top-32 right-[10%] -z-10 h-[420px] w-[420px] rounded-full bg-clay-200/40 blur-3xl dark:bg-clay-900/40" />
      <div className="absolute -bottom-32 left-[5%] -z-10 h-[360px] w-[360px] rounded-full bg-forest-200/30 blur-3xl dark:bg-forest-900/30" />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-10 sm:px-2 lg:grid-cols-12 lg:gap-10 lg:px-2 lg:pb-8 lg:pt-16">
        {/* Editorial copy column */}
        <div className="lg:col-span-7">
          <h1 className="font-display text-[44px] font-semibold leading-[0.95] tracking-editorial text-ink-900 text-balance sm:text-[54px] lg:text-[66px] xl:text-[78px] dark:text-cream-100">
            The Trusted Guide to Botswana's Online World
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-[1.55] text-ink-700 text-pretty dark:text-ink-200">
            Discover reliable websites, essential services, and the best online
            resources Botswana has to offer.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 ">
            <Link
              href="/search"
              className={`group inline-flex items-center gap-y-3 gap-x-4 rounded-full ${lgbutton}  text-cream-50 transition hover:bg-clay-600  dark:text-ink-100 dark:hover:bg-clay-400 `}
            >
              Search for a site
              <span className="grid h-6 w-6 place-items-center rounded-full bg-cream-50/15 transition group-hover:translate-x-0.5 dark:bg-ink-950/20">
                <svg
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
            <Link
              href="#how-it-works"
              className="link-underline inline-flex items-center gap-2 py-3 text-sm font-medium text-ink-900 dark:text-cream-100"
            >
              How it works
              <span className="font-mono text-[11px] text-clay-600 dark:text-clay-300">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* Visual column — offset image with floating ticket */}
        <div className="relative lg:col-span-5">
          <div className="relative">
            {/* Decorative deckle */}
            {/* <div className="absolute left-3 top-3 hidden h-24 w-24 border-l-2 border-t-2 border-clay-500 lg:block" />
            <div className="absolute bottom-3 right-3 hidden h-24 w-24 border-b-2 border-r-2 border-forest-700 lg:block dark:border-forest-300" /> */}

            <div className="relative aspect-[5/4] overflow-hidden ">
              <Image
                src="/our-process.png"
                alt="Botswana online services"
                fill
                className="object-cover"
                priority
                sizes="(min-width: 1024px) 40vw, 90vw"
              />
              {/* Duotone wash for editorial feel */}
              {/* <div className="absolute inset-0 mix-blend-multiply bg-gradient-to-br from-clay-600/30 via-transparent to-forest-800/30 dark:from-clay-400/20 dark:to-forest-200/10" />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-950/70 via-ink-950/20 to-transparent" /> */}
            </div>

            {/* Receipt-style ticket */}
            {/* <div
              className="absolute -right-2 top-6 hidden w-56 -rotate-2 border border-ink-200 bg-cream-50 p-4 shadow-editorial dark:border-ink-700 dark:bg-ink-900 sm:block"
              style={{
                clipPath:
                  "polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)",
              }}
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink-500 dark:text-ink-300">
                  Loan receipt
                </span>
                <span className="font-mono text-[10px] text-clay-600 dark:text-clay-300">
                  No. 04821
                </span>
              </div>
              <div className="mt-3 border-t border-dashed border-ink-200 pt-3 dark:border-ink-700">
                <div className="flex items-baseline justify-between text-xs text-ink-600 dark:text-ink-300">
                  <span>Principal</span>
                  <span className="font-mono text-ink-900 dark:text-cream-100">
                    P3,500.00
                  </span>
                </div>
                <div className="mt-1 flex items-baseline justify-between text-xs text-ink-600 dark:text-ink-300">
                  <span>Term</span>
                  <span className="font-mono text-ink-900 dark:text-cream-100">
                    14 days
                  </span>
                </div>
                <div className="mt-3 flex items-baseline justify-between border-t border-dashed border-ink-200 pt-2 dark:border-ink-700">
                  <span className="font-display text-sm italic text-ink-900 dark:text-cream-100">
                    approved
                  </span>
                  <span className="font-mono text-[10px] text-forest-700 dark:text-forest-300">
                    ✓ 09:47 CAT
                  </span>
                </div>
              </div>
            </div> */}
          </div>

          {/* Hand-set quote stack */}
          <div className="mt-8 flex items-center justify-center gap-4 sm:flex ">
            <div className="flex -space-x-2">
              {["60A5FA", "0A0A0A", "60A5FA"].map((c, i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border-2 border-cream-50 dark:border-ink-950"
                  style={{
                    background: `linear-gradient(135deg, #${c}, #${c}88)`,
                  }}
                />
              ))}
            </div>
            <p className="font-mono text-sm  text-ink-700 dark:text-ink-200 ">
              Trusted by thousands across Botswana.
            </p>
          </div>
        </div>
      </div>

      {/* Newspaper-style banker strip */}
      <div className="border-y border-ink-200/60 bg-cream-100/50 py-5 dark:border-ink-800/70 dark:bg-ink-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-2 lg:px-3">
          <div className="flex items-center gap-5 text-[12px] uppercase tracking-[0.3em] text-ink-500 dark:text-ink-300">
            <span className="block sm:hidden font-mono shrink-0">
              Categories⟶
            </span>
            <span className="hidden sm:block font-mono shrink-0">
              Categories ⟶
            </span>
            <div className="mask-fade-x overflow-hidden">
              <div className="flex w-max animate-marquee items-center gap-12 whitespace-nowrap">
                {[...Array(2)].flatMap((_, dup) =>
                  [
                    "Quick Cash Loans",
                    "Personal Loans",
                    "Pay Day Loans",
                    "Business Loans",
                    "Purchase Orders Financing",
                    "Micro Loans",
                  ].map((name) => (
                    <span
                      key={`${dup}-${name}`}
                      className="font-display text-xl font-medium tracking-tight text-ink-500 dark:text-ink-300"
                    >
                      {name}
                    </span>
                  )),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
