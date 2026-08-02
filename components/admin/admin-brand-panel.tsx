import { Compass } from "lucide-react";

export function AdminBrandPanel({
  eyebrow,
  heading,
  description,
}: {
  eyebrow: string;
  heading: string;
  description: string;
}) {
  return (
    <div className="relative isolate flex h-56 flex-col justify-between overflow-hidden bg-[linear-gradient(155deg,var(--brand-blue-900)_0%,var(--brand-blue-700)_46%,var(--brand-blue-500)_100%)] px-8 py-8 text-white sm:h-64 sm:px-12 sm:py-10 lg:h-auto lg:px-14 lg:py-14">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-brand-yellow-light/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-16 size-80 rounded-full bg-brand-blue-300/30 blur-3xl"
      />

      {/* topographic contour lines */}
      <svg
        aria-hidden
        viewBox="0 0 900 700"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <g fill="none" stroke="white" strokeWidth="1.1">
          <path
            d="M-50,120 C150,50 350,190 550,110 S850,30 950,120"
            opacity="0.28"
          />
          <path
            d="M-50,210 C180,140 380,290 560,200 S860,120 950,220"
            opacity="0.22"
          />
          <path
            d="M-50,310 C160,250 360,390 540,300 S840,220 950,320"
            opacity="0.18"
          />
          <path
            d="M-50,420 C170,350 370,480 550,400 S850,320 950,430"
            opacity="0.14"
          />
          <path
            d="M-50,540 C150,480 350,590 540,510 S840,440 950,550"
            opacity="0.1"
          />
        </g>
      </svg>

      {/* grain */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.05] mix-blend-overlay"
      >
        <filter id="admin-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#admin-grain)" />
      </svg>

      <div className="relative flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-sm">
          <Compass className="size-4.5" strokeWidth={1.75} />
        </span>
        <span className="text-sm font-medium tracking-[0.14em] text-white/80 uppercase">
          BW&nbsp;Sites
        </span>
      </div>

      <div className="relative flex max-w-md flex-col gap-3">
        <span className="inline-flex w-fit items-center gap-2 text-xs font-medium tracking-[0.18em] text-brand-yellow-light uppercase">
          <span className="h-px w-6 bg-brand-yellow-light" />
          {eyebrow}
        </span>
        <h1 className="font-[family-name:var(--font-admin-display)] text-3xl leading-[1.08] font-medium tracking-tight text-balance sm:text-4xl lg:text-[2.6rem]">
          {heading}
        </h1>
        <p className="hidden text-sm leading-relaxed text-white/70 sm:block lg:text-[0.95rem]">
          {description}
        </p>
      </div>

      <div className="relative hidden items-center gap-2 text-xs text-white/50 lg:flex">
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
        </span>
        System operational
      </div>
    </div>
  );
}
