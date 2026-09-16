import {
  AntennaIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  BanknoteIcon,
  BookOpenIcon,
  BriefcaseIcon,
  BusIcon,
  CalendarDaysIcon,
  CameraIcon,
  CarIcon,
  ChurchIcon,
  ClapperboardIcon,
  CompassIcon,
  CpuIcon,
  DumbbellIcon,
  GavelIcon,
  GraduationCapIcon,
  HandHeartIcon,
  HardHatIcon,
  HotelIcon,
  HouseIcon,
  LandmarkIcon,
  MusicIcon,
  NewspaperIcon,
  PickaxeIcon,
  PlaneIcon,
  ScissorsIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  SproutIcon,
  StethoscopeIcon,
  TagIcon,
  TrophyIcon,
  TruckIcon,
  UtensilsIcon,
  WrenchIcon,
  type LucideIcon,
} from "lucide-react";

import { ScrollTopLink } from "@/components/client/scroll-top-link";
import { getCategories } from "@/lib/client/categories";
import { categoryHref } from "@/lib/slug";

/**
 * Categories are admin-authored, so icons are matched on keywords instead of an
 * exact list. First match wins - keep specific rules above broad ones.
 */
const ICON_RULES: ReadonlyArray<readonly [RegExp, LucideIcon]> = [
  [/news|media|press|publish|magazine|journal/, NewspaperIcon],
  [/radio|broadcast|telecom|internet|network|mobile/, AntennaIcon],
  [/travel|airline|aviation|flight|tour/, PlaneIcon],
  [/hotel|lodge|guest|accommodat|hospitality|safari|camp/, HotelIcon],
  [/gov|ministr|council|municipal|embass|parastatal|authorit/, LandmarkIcon],
  [/bank|financ|insur|invest|money|loan|micro|forex/, BanknoteIcon],
  [/school|educat|univers|college|training|academ|tutor/, GraduationCapIcon],
  [/health|medic|clinic|hospital|pharmac|doctor|dental/, StethoscopeIcon],
  [/shop|retail|store|market|mall|commerce/, ShoppingBagIcon],
  [/propert|real estate|housing|rent|estate/, HouseIcon],
  [/transport|logistics|courier|delivery|freight|shipping/, TruckIcon],
  [/taxi|car|vehicle|auto|motor|dealership/, CarIcon],
  [/food|restaurant|catering|cafe|dining|bakery|butcher/, UtensilsIcon],
  [
    /job|career|recruit|employ|staffing|business|consult|profession/,
    BriefcaseIcon,
  ],
  [/sport|football|soccer|athlet/, TrophyIcon],
  [/gym|fitness|wellness|wellbeing/, DumbbellIcon],
  [/law|legal|attorney|advocate|court|justice/, GavelIcon],
  [/tech|software|digital|comput|web|data|hosting/, CpuIcon],
  [/construct|building|engineer|contractor|architect|hardware/, HardHatIcon],
  [/farm|agric|crop|livestock|garden|nursery/, SproutIcon],
  [/security|safety|guard|protect/, ShieldCheckIcon],
  [/mining|mine|quarry|diamond|mineral|energy/, PickaxeIcon],
  [/entertain|film|cinema|video|studio/, ClapperboardIcon],
  [/music|audio|sound|band/, MusicIcon],
  [/photo|imaging|creative|design|art/, CameraIcon],
  [/ngo|charit|donat|community|profit|social/, HandHeartIcon],
  [/church|religio|faith|ministry|worship/, ChurchIcon],
  [/event|wedding|conference|venue|planner/, CalendarDaysIcon],
  [/beauty|salon|hair|spa|barber|fashion/, ScissorsIcon],
  [/repair|maintenance|plumb|electric|mechanic|handyman/, WrenchIcon],
  [/book|librar|read|literat/, BookOpenIcon],
  [/transit|commut|route|shuttle|bus/, BusIcon],
  [/guide|director|explore|discover|local/, CompassIcon],
];

function iconFor(name: string): LucideIcon {
  const haystack = name.toLowerCase();
  for (const [pattern, Icon] of ICON_RULES) {
    if (pattern.test(haystack)) return Icon;
  }
  return TagIcon;
}

export async function CategoryLinks() {
  const categories = await getCategories();

  if (categories.length === 0) return null;

  return (
    <section
      id="categories"
      className="relative isolate overflow-hidden border-y border-ink-200/60 bg-cream-50 dark:border-ink-800/70 dark:bg-ink-900"
    >
      {/* Atmospheric wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 right-[-8%] -z-10 h-[460px] w-[460px] rounded-full bg-brand-blue-300/20 blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-2 lg:px-2 lg:py-16">
        {/* Section masthead */}
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-500 dark:text-ink-300">
              The Index
            </p>
            <h2 className="mt-3 flex items-center gap-4 font-heading text-3xl font-bold text-brand-blue-900 dark:text-brand-blue-300 sm:text-4xl">
              <span
                aria-hidden
                className="hidden h-8 w-1 shrink-0 rounded bg-brand-yellow-light sm:block"
              />
              Browse by Category
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-[1.7] text-ink-700 text-pretty dark:text-ink-200">
              Every site we list is filed under the sections Botswana actually
              looks for. Pick one to see what is worth visiting inside it.
            </p>
          </div>

          <a
            href="/search"
            className="group inline-flex items-center gap-2 border-b border-ink-300 pb-1 font-sans text-[12px] uppercase tracking-[0.2em] text-ink-700 transition-colors hover:border-brand-yellow-light hover:text-brand-blue-900 dark:border-ink-700 dark:text-ink-200 dark:hover:text-brand-yellow-light"
          >
            Browse all sites
            <ArrowRightIcon
              aria-hidden
              className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </div>

        {/* Rule-lined directory grid */}
        <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 dark:border-ink-800">
          {categories.map((category, index) => {
            const Icon = iconFor(category.name);
            const count = category._count.sites;

            return (
              <li
                key={category.id}
                className="group relative animate-in fade-in slide-in-from-bottom-2  duration-500 "
                style={{
                  animationDelay: `${Math.min(index, 11) * 45}ms`,
                  animationFillMode: "backwards",
                }}
              >
                <ScrollTopLink
                  href={categoryHref(category.name)}
                  className="flex h-full items-center gap-2.5 pl-0 pr-5 py-3.5 outline-none transition-colors  focus-visible:bg-cream-100  dark:hover:text-ink-400 group-hover:text-brand-blue-900 dark:text-ink-200 text-brand-blue-700 "
                >
                  <span
                    aria-hidden
                    className="grid  shrink-0 place-items-center  transition-colors"
                  >
                    <Icon className="size-[18px]" strokeWidth={1.75} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-heading text-[15px] font-semibold ">
                      {category.name}
                    </span>
                  </span>
                </ScrollTopLink>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
