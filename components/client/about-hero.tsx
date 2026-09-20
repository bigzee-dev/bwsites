import { getCategories } from "@/lib/client/categories";
import { getSitesCount } from "@/lib/client/sites";
import { CITY, COMPANY_NAME, COUNTRY } from "@/lib/constants";

/**
 * Editorial masthead for /about. The figures are read live so the page never
 * claims a catalogue size the directory no longer has.
 */
export async function AboutHero() {
  const [sitesCount, categories] = await Promise.all([
    getSitesCount(),
    getCategories(),
  ]);

  const stats = [
    { value: String(sitesCount), label: "Sites indexed" },
    { value: String(categories.length), label: "Categories" },
    { value: "Every one", label: "Checked by hand" },
  ];

  return (
    <section className="relative isolate overflow-hidden">
      {/* Backdrop layers */}
      <div aria-hidden className="absolute inset-0 -z-20 bg-cream-50 dark:bg-ink-950" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[6%] -z-10 h-[420px] w-[420px] rounded-full bg-clay-200/40 blur-3xl dark:bg-clay-900/40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-[4%] -z-10 h-[360px] w-[360px] rounded-full bg-forest-200/30 blur-3xl dark:bg-forest-900/30"
      />

      <div className="mx-auto max-w-7xl px-4 pt-10 pb-14 sm:px-2 lg:px-2 lg:pt-16 lg:pb-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-500 dark:text-ink-300">
          About — {COMPANY_NAME}
        </p>

        <div className="mt-7 grid gap-x-10 gap-y-8 lg:grid-cols-12">
          <h1 className="font-heading text-[40px] leading-[0.98] font-semibold text-balance text-ink-900 sm:text-[56px] lg:col-span-7 dark:text-ink-100">
            A guide to Botswana&rsquo;s digital world
          </h1>

          <div className="lg:col-span-5 lg:pt-4">
            <p className="max-w-xl text-base leading-[1.7] text-pretty text-ink-700 dark:text-ink-200">
              <span className="font-semibold text-brand-blue-900 dark:text-brand-blue-300">
                {COMPANY_NAME}
              </span>{" "}
              helps people discover the country&rsquo;s most useful, reliable and
              trustworthy websites — gathered in one place, and reviewed before
              they earn a listing.
            </p>
          </div>
        </div>

        {/* Newspaper figures */}
        <dl className="mt-14 grid grid-cols-1 border-t border-b border-ink-200/70 sm:grid-cols-3 dark:border-ink-800/70">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="border-t border-ink-200/70 py-6 first:border-t-0 sm:border-t-0 sm:border-l sm:px-8 sm:first:border-l-0 sm:first:pl-0 dark:border-ink-800/70"
            >
              <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-500 dark:text-ink-300">
                {stat.label}
              </dt>
              <dd className="mt-2 font-heading text-4xl font-bold tabular-nums text-brand-blue-900 dark:text-brand-blue-300">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Dateline */}
      <div className="border-y border-ink-200/60 bg-cream-100/50 py-4 dark:border-ink-800/70 dark:bg-ink-900/40">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-8 gap-y-2 px-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-500 sm:px-2 lg:px-2 dark:text-ink-300">
          <p>
            {CITY}, {COUNTRY}
          </p>
          <p>Curated locally — kept current</p>
        </div>
      </div>
    </section>
  );
}
