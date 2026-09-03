import Link from "next/link";
import { FaFacebookF } from "react-icons/fa";
import { FaExternalLinkAlt } from "react-icons/fa";
import { BsWhatsapp } from "react-icons/bs";
import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SiteWithCategories } from "@/lib/client/sites";

export function SiteCard({ site }: { site: SiteWithCategories }) {
  return (
    <Card className="h-full transition-shadow hover:shadow-md bg-cream-50 dark:bg-neutral-900 pt-0 border border-ink-200/80 dark:border-ink-800">
      <Link
        href={`/site/${site.slug}`}
        className="pb-0 border-b border-ink-200/80 dark:border-ink-600"
      >
        <img src={site.image} alt={site.name} className="aspect-16/8 w-full" />
      </Link>
      <CardHeader className="rounded-tr-none rounded-tl-none pt-0">
        <CardTitle className="flex items-center justify-between gap-2">
          {site.slug ? (
            <Link
              href={`/site/${site.slug}`}
              className="truncate font-heading font-bold text-brand-blue-900 dark:text-ink-200 "
            >
              {site.name}
            </Link>
          ) : (
            <span className="truncate font-heading font-semibold text-brand-blue-900">
              {site.name}
            </span>
          )}
          <div className="flex shrink-0 items-center gap-2 text-muted-foreground">
            {site.facebookUrl && (
              <a
                href={site.facebookUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`${site.name} on Facebook`}
                className="hover:text-foreground"
              >
                <FaFacebookF className="size-4" />
              </a>
            )}
            {site.whatsapp && (
              <a
                href={`https://wa.me/${site.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                aria-label={`Message ${site.name} on WhatsApp`}
                className="hover:text-foreground"
              >
                <BsWhatsapp className="size-4" />
              </a>
            )}
            <a
              href={site.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`Visit ${site.name}`}
              className="hover:text-foreground"
            >
              <FaExternalLinkAlt className="size-4" />
            </a>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="line-clamp-2 text-sm text-ink-700 dark:text-ink-100 text-pretty">
          <ReactMarkdown>{site.description}</ReactMarkdown>
        </div>
        <Link
          href={`/site/${site.slug}`}
          className="truncate font-heading font-medium text-blue-600 dark:text-blue-500/70 hover:underline"
        >
          Read more
        </Link>
        {/* {site.categories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {site.categories.map((category) => (
              <Badge
                key={category.id}
                variant="default"
                className="bg-brand-blue-900"
              >
                {category.name}
              </Badge>
            ))}
          </div>
        )} */}
        {/* {site.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {site.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )} */}
      </CardContent>
    </Card>
  );
}
