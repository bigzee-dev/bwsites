import FooterSiteBtn from "@/components/client/footersitebtn";
import { ScrollTopLink } from "@/components/client/scroll-top-link";
import { COUNTRY } from "@/lib/constants";

export function AboutMission() {
  return (
    <section className="relative isolate overflow-hidden bg-ink-900 text-cream-100">
      {/* Atmospheric wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 right-[-8%] -z-10 h-[460px] w-[460px] rounded-full bg-brand-blue-300/20 blur-3xl"
      />

      {/* Oversized quotation mark, bled off the left edge */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-4 left-4 -z-10 font-heading text-[18rem] leading-none font-bold text-cream-100/[0.05] select-none"
      >
        &rdquo;
      </span>

      <div className="mx-auto grid max-w-7xl gap-x-12 gap-y-10 px-4 py-16 sm:px-2 lg:grid-cols-12 lg:px-2 lg:py-20">
        <div className="lg:col-span-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-cream-100/45">
            Our mission
          </p>

          <p className="mt-6 font-heading text-[28px] leading-[1.2] font-bold text-balance text-cream-50 sm:text-[40px]">
            To make discovering {COUNTRY}&rsquo;s best online resources{" "}
            <span className="text-brand-yellow-light">fast, easy</span> and{" "}
            <span className="text-brand-yellow-light">trustworthy</span>.
          </p>
        </div>
      </div>
    </section>
  );
}
