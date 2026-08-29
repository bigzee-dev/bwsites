import Image from "next/image";
import Link from "next/link";
import { lgbutton } from "@/app/css-classes";
import { getSitesCount } from "@/lib/admin/sites";
import { getCategories } from "@/lib/client/categories";

export async function Hero() {
  const sitesCount = await getSitesCount();
  const categories = await getCategories();

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
          <h1 className="font-display text-[44px] font-semibold leading-[0.95] tracking-editorial text-ink-900 text-balance sm:text-[58px]  dark:text-ink-100">
            The Trusted Guide to Botswana's Online World
          </h1>

          <p className="mt-7 max-w-xl text-base leading-[1.7] text-ink-700 text-pretty dark:text-ink-200">
            Discover reliable websites, essential services, and the best online
            resources Botswana has to offer -
            <span className="mx-1 inline-flex min-w-6 items-center justify-center rounded-full bg-brand-blue-900 px-2 py-0.5 align-[0.05em] text-sm font-bold tabular-nums text-white dark:bg-brand-yellow-dark dark:text-ink-700">
              {sitesCount}
            </span>
            <span className="ml-0.5 text-ink-300 text-sm italic font-sans">
              sites listed
            </span>
          </p>

          <div className="border-t border-b border-accent-foreground/20 mt-6 py-5 flex flex-wrap items-center gap-x-8 gap-y-3 ">
            <Link
              href="/search"
              className={`group inline-flex items-center gap-y-3 gap-x-4 rounded-xl ${lgbutton}  text-cream-50 transition hover:bg-clay-600  dark:text-ink-100 dark:hover:bg-clay-400 `}
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
          {/* Hand-set quote stack */}
          <div className="mt-6 flex items-center  gap-4 sm:flex ">
            <div className="flex -space-x-2 bg-transparent dark:bg-cream-200 rounded-xl p-1">
              {["60A5FA", "0A0A0A", "60A5FA"].map((c, i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border-2 border-cream-50 "
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

        {/* Visual column — offset image with floating ticket */}
        <div className="relative lg:col-span-5">
          <div className="relative">
            <div className="relative aspect-[5/4] overflow-hidden ">
              <Image
                src="/our-process.png"
                alt="Botswana online services"
                fill
                className="object-cover"
                priority
                sizes="(min-width: 1024px) 40vw, 90vw"
              />
            </div>
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
                {[...categories, ...categories].map((category, index) => (
                  <span
                    key={index}
                    className="font-display text-xl font-medium tracking-tight text-ink-500 dark:text-ink-300"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
