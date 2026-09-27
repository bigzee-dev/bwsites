import { HeroSearch } from "@/components/client/hero-search";
import { ScrollTopLink } from "@/components/client/scroll-top-link";
import { getCategories } from "@/lib/client/categories";
import { getSitesCount } from "@/lib/client/sites";

const reveal =
  "animate-in fade-in slide-in-from-bottom-3 duration-700 fill-mode-both motion-reduce:animate-none";

export async function Hero() {
  const [sitesCount, categories] = await Promise.all([
    getSitesCount(),
    getCategories(),
  ]);

  const stats = [
    { value: sitesCount, label: "Sites listed", href: "/search" },
    { value: categories.length, label: "Categories", href: "#categories" },
  ];

  return (
    <section className="relative isolate overflow-hidden">
      <HeroBackdrop />

      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 pb-16 pt-14 text-center sm:px-6 sm:pt-20 lg:pb-20 lg:pt-24">
        <h1
          className={`${reveal} font-heading text-[40px] leading-[0.98] font-semibold text-balance text-ink-900 sm:text-[56px] dark:text-ink-100`}
        >
          The Trusted Guide to Botswana&apos;s Online World
        </h1>

        <p
          className={`${reveal} delay-100 mt-7 max-w-xl text-base leading-[1.7] text-ink-700 text-pretty dark:text-ink-200`}
        >
          Discover reliable websites, essential services, and the best online
          resources Botswana has to offer
        </p>

        {/* Directory stats */}
        <div
          className={`${reveal} delay-200 mt-8 flex items-stretch divide-x divide-brand-blue-900/10 overflow-hidden rounded-2xl border border-brand-blue-900/10 bg-white/60 backdrop-blur-sm dark:divide-white/10 dark:border-white/10 dark:bg-white/[0.03]`}
        >
          {stats.map((stat) => {
            const StatLink = stat.href.startsWith("#") ? "a" : ScrollTopLink;

            return (
              <StatLink
                key={stat.label}
                href={stat.href}
                className="group flex flex-col items-center gap-1 px-6 py-3 transition-colors hover:bg-brand-blue-900/[0.04] focus-visible:bg-brand-blue-900/[0.04] focus-visible:outline-none sm:px-10 sm:py-4 dark:hover:bg-white/[0.05] dark:focus-visible:bg-white/[0.05]"
              >
                <span className="font-heading text-3xl font-bold tabular-nums text-brand-blue-900 sm:text-4xl dark:text-brand-yellow-light">
                  {stat.value}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-500 transition-colors group-hover:text-brand-blue-700 dark:text-ink-300 dark:group-hover:text-cream-100">
                  {stat.label}
                </span>
              </StatLink>
            );
          })}
        </div>

        <div className={`${reveal} delay-300 mt-10 flex w-full justify-center`}>
          <HeroSearch />
        </div>

        {/* Hand-set quote stack */}
        <div className={`${reveal} delay-500`}>
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
      </div>

      {/* Newspaper-style banker strip */}
      {/* <div className="border-y border-ink-200/60 bg-cream-100/50 py-5 dark:border-ink-800/70 dark:bg-ink-900/40">
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
      </div> */}
    </section>
  );
}

/**
 * Layered backdrop: base tone, a dot grid faded out from the centre,
 * concentric "signal" rings behind the headline and two brand-coloured glows.
 */
function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-cream-50 dark:bg-ink-950" />

      <div
        className="absolute inset-0 text-brand-blue-900/[0.13] dark:text-white/[0.07]"
        style={{
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 75%)",
        }}
      />

      <svg
        viewBox="0 0 800 800"
        fill="none"
        className="absolute left-1/2 top-[38%] h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 text-brand-blue-500/20 sm:h-[960px] sm:w-[960px] dark:text-brand-blue-300/15"
      >
        {[120, 200, 280, 360].map((r, i) => (
          <circle
            key={r}
            cx="400"
            cy="400"
            r={r}
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray={i % 2 ? "2 6" : undefined}
          />
        ))}
        <circle cx="680" cy="400" r="4" className="fill-brand-yellow-light" />
        <circle cx="147" cy="253" r="3" className="fill-brand-blue-500" />
      </svg>

      <div className="absolute -top-40 left-1/2 h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-brand-blue-300/20 blur-3xl dark:bg-brand-blue-900/40" />
      {/* <div className="absolute -bottom-24 right-[8%] h-[280px] w-[280px] rounded-full bg-brand-yellow-light/15 blur-3xl dark:bg-brand-yellow-dark/10" /> */}
    </div>
  );
}
