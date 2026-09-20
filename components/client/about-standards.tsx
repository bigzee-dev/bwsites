import {
  BadgeCheckIcon,
  BookOpenIcon,
  MousePointerClickIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
  SignalIcon,
} from "lucide-react";

import { COMPANY_NAME } from "@/lib/constants";

/** What a site has to clear before it earns a listing. */
const STANDARDS = [
  {
    icon: ShieldCheckIcon,
    title: "Secure",
    note: "Served over HTTPS with a valid certificate, so your visit is protected.",
  },
  {
    icon: RefreshCwIcon,
    title: "Regularly updated",
    note: "Content, prices and contact details that reflect how things are today.",
  },
  {
    icon: BookOpenIcon,
    title: "Informative",
    note: "Answers the question that sent you looking in the first place.",
  },
  {
    icon: MousePointerClickIcon,
    title: "Easy to use",
    note: "Clear navigation that holds up on a phone as well as a desktop.",
  },
  {
    icon: SignalIcon,
    title: "Dependable",
    note: "Online, quick to load and responsive whenever you need it.",
  },
  {
    icon: BadgeCheckIcon,
    title: "Reputably run",
    note: "Trusted businesses, government institutions, non-profits and other established bodies.",
  },
] as const;

export function AboutStandards() {
  return (
    <section className="bg-cream-50 dark:bg-ink-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-2 lg:px-2">
        {/* Section masthead */}
        <div className="grid gap-x-10 gap-y-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-500 dark:text-ink-300">
              Our standard
            </p>
            <h2 className="mt-3 flex items-center gap-4 font-heading text-3xl font-bold text-brand-blue-900 sm:text-4xl dark:text-brand-blue-300">
              <span
                aria-hidden
                className="hidden h-8 w-1 shrink-0 rounded bg-brand-yellow-light sm:block"
              />
              What earns a listing
            </h2>
          </div>

          <div className="lg:col-span-7 lg:pt-11">
            <p className="max-w-2xl text-base leading-[1.8] text-pretty text-ink-700 dark:text-ink-200">
              Every website featured on {COMPANY_NAME} has been selected because
              we believe it meets a high standard of quality. These are the
              things we weigh before a site joins the index.
            </p>
          </div>
        </div>

        {/* Rule-lined standards index */}
        <ul className="mt-12 grid grid-cols-1 border-t border-l border-ink-200/70 sm:grid-cols-2 lg:grid-cols-3 dark:border-ink-800">
          {STANDARDS.map((standard, index) => {
            const Icon = standard.icon;

            return (
              <li
                key={standard.title}
                className="group relative animate-in fade-in slide-in-from-bottom-2 border-r border-b border-ink-200/70 px-5 py-7 duration-500 dark:border-ink-800"
                style={{
                  animationDelay: `${index * 60}ms`,
                  animationFillMode: "backwards",
                }}
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-brand-yellow-light transition-transform duration-300 ease-out group-hover:scale-x-100"
                />

                <span
                  aria-hidden
                  className="grid size-9 place-items-center rounded-full bg-brand-blue-900/10 text-brand-blue-900 dark:bg-brand-blue-300/15 dark:text-brand-blue-300"
                >
                  <Icon className="size-[18px]" strokeWidth={1.75} />
                </span>

                <p className="mt-4 font-heading text-[15px] font-semibold text-ink-900 dark:text-ink-100">
                  {standard.title}
                </p>
                <p className="mt-2 text-sm leading-[1.7] text-pretty text-ink-600 dark:text-ink-300">
                  {standard.note}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
