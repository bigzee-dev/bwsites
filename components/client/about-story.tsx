import Image from "next/image";
import { XIcon } from "lucide-react";

import { COMPANY_NAME, COUNTRY } from "@/lib/constants";

/**
 * The failure modes that make an ordinary search result untrustworthy. Kept as
 * a rule-lined index so the section reads like a newspaper column rather than a
 * card grid.
 */
const FRICTIONS = [
  { title: "Outdated", note: "Pages last updated several years ago." },
  { title: "Poorly maintained", note: "Broken links and dead-end pages." },
  { title: "Slow to load", note: "A long wait on a mobile connection." },
  { title: "No longer operational", note: "Sites left behind by their owners." },
  { title: "Missing SSL", note: "Not even the most basic security in place." },
  { title: "Service has slipped", note: "Businesses that no longer deliver." },
] as const;

export function AboutStory() {
  return (
    <>
      <section className="bg-cream-50 dark:bg-ink-950">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-2 lg:px-2">
          {/* Section masthead */}
          <div className="grid gap-x-10 gap-y-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-500 dark:text-ink-300">
                Why we built it
              </p>
              <h2 className="mt-3 flex items-center gap-4 font-heading text-3xl font-bold text-brand-blue-900 sm:text-4xl dark:text-brand-blue-300">
                <span
                  aria-hidden
                  className="hidden h-8 w-1 shrink-0 rounded bg-brand-yellow-light sm:block"
                />
                The problem with plain search
              </h2>
            </div>

            <div className="lg:col-span-7 lg:pt-11">
              <p className="max-w-2xl text-base leading-[1.8] text-pretty text-ink-700 dark:text-ink-200">
                Finding quality local websites through traditional search
                engines can often be frustrating. Search results frequently
                include websites that are outdated, poorly maintained, slow to
                load, no longer operational, missing basic security such as SSL
                certificates, or belong to businesses and organizations that no
                longer provide a quality service. This makes it difficult for
                users to quickly find the information or services they need.
              </p>
            </div>
          </div>

          {/* Rule-lined index of frictions */}
          <ul className="mt-12 grid grid-cols-1 border-t border-l border-ink-200/70 sm:grid-cols-2 lg:grid-cols-3 dark:border-ink-800">
            {FRICTIONS.map((friction, index) => (
              <li
                key={friction.title}
                className="animate-in fade-in slide-in-from-bottom-2 border-r border-b border-ink-200/70 px-5 py-6 duration-500 dark:border-ink-800"
                style={{
                  animationDelay: `${index * 60}ms`,
                  animationFillMode: "backwards",
                }}
              >
                <span className="font-mono text-[11px] tabular-nums text-ink-400 dark:text-ink-500">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-3 flex items-start gap-2 font-heading text-[15px] font-semibold text-ink-900 dark:text-ink-100">
                  <XIcon
                    aria-hidden
                    className="mt-0.5 size-4 shrink-0 text-brand-yellow-dark"
                    strokeWidth={2.4}
                  />
                  {friction.title}
                </p>
                <p className="mt-2 text-sm leading-[1.7] text-ink-600 dark:text-ink-300">
                  {friction.note}
                </p>
              </li>
            ))}
          </ul>

          {/* Pull quote */}
          <blockquote className="mt-14 border-l-4 border-brand-yellow-light pl-6 sm:pl-8">
            <p className="font-heading text-2xl leading-snug font-semibold text-balance text-brand-blue-900 sm:text-3xl dark:text-brand-blue-300">
              {COMPANY_NAME} was created to solve this problem.
            </p>
          </blockquote>
        </div>
      </section>

      {/* Local knowledge */}
      <section className="relative isolate overflow-hidden border-y border-ink-200/60 bg-cream-100/50 dark:border-ink-800/70 dark:bg-ink-900/40">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-48 right-[-8%] -z-10 h-[460px] w-[460px] rounded-full bg-brand-blue-300/20 blur-3xl"
        />

        <div className="mx-auto grid max-w-7xl gap-x-12 gap-y-10 px-4 py-16 sm:px-2 lg:grid-cols-12 lg:px-2">
          <div className="lg:col-span-5">
            <div className="relative aspect-[5/4] overflow-hidden rounded-2xl ring-1 ring-ink-200/70 dark:ring-ink-800">
              <Image
                src="/our-process.png"
                alt={`How ${COMPANY_NAME} researches and reviews websites in ${COUNTRY}`}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 90vw"
              />
            </div>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-500 dark:text-ink-300">
              Researched — Evaluated — Curated
            </p>
          </div>

          <div className="lg:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-500 dark:text-ink-300">
              Our approach
            </p>
            <h2 className="mt-3 flex items-center gap-4 font-heading text-3xl font-bold text-brand-blue-900 sm:text-4xl dark:text-brand-blue-300">
              <span
                aria-hidden
                className="hidden h-8 w-1 shrink-0 rounded bg-brand-yellow-light sm:block"
              />
              Curated by people who live here
            </h2>

            <p className="mt-7 max-w-2xl text-base leading-[1.8] text-pretty text-ink-700 dark:text-ink-200">
              Rather than relying solely on automated search engine rankings,
              our team carefully researches, evaluates, and curates websites
              from across {COUNTRY}. Because we live and work here, we
              understand the local digital landscape and regularly interact with
              the websites, businesses, and organizations that serve our
              communities.
            </p>

            <p className="mt-5 max-w-2xl text-base leading-[1.8] text-pretty text-ink-700 dark:text-ink-200">
              We know which websites consistently provide valuable information,
              deliver quality services, remain actively maintained, and offer a
              reliable user experience.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
