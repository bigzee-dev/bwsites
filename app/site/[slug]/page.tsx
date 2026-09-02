import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Link2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { Navbar } from "@/components/client/navbar";
import { cn } from "@/lib/utils";
import { getSiteBySlug } from "@/lib/client/sites";
import { categoryHref } from "@/lib/slug";
import BackButton from "@/components/client/backbutton";
import { RelatedSites } from "@/components/related-sites";
import ReactMarkdown from "react-markdown";

type SitePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: SitePageProps): Promise<Metadata> {
  const { slug } = await params;
  const site = await getSiteBySlug(slug);

  if (!site) return {};

  return {
    title: site.name,
    description: site.description,
  };
}

export default async function SitePage({ params }: SitePageProps) {
  const { slug } = await params;
  const site = await getSiteBySlug(slug);

  if (!site) notFound();

  const primaryCategory = site.categories[0];

  return (
    <div className="flex flex-1 flex-col ">
      <main className="w-full flex-1">
        <Navbar />

        <div className="bg-cream-50 dark:bg-ink-950">
          <div className="mx-auto max-w-5xl px-4 py-8 pb-16 sm:px-2">
            <BackButton />

            <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-foreground/10">
              <img
                src={site.image}
                alt={site.name}
                className="aspect-[15/7] w-full"
              />
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-3">
              <div className="flex flex-col gap-6 lg:col-span-2">
                <div>
                  <Breadcrumb className="mt-0.5 mb-4">
                    <BreadcrumbList className="lowercase">
                      <BreadcrumbItem>
                        <BreadcrumbLink render={<Link href="/search" />}>
                          all
                        </BreadcrumbLink>
                      </BreadcrumbItem>

                      {primaryCategory && (
                        <>
                          <BreadcrumbSeparator />
                          <BreadcrumbItem>
                            <BreadcrumbLink
                              render={
                                <Link
                                  href={categoryHref(primaryCategory.name)}
                                />
                              }
                            >
                              {primaryCategory.name}
                            </BreadcrumbLink>
                          </BreadcrumbItem>
                        </>
                      )}

                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>{site.name}</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>

                  <h1 className="font-heading text-3xl font-bold text-brand-blue-900 sm:text-4xl dark:text-brand-blue-300">
                    {site.name}
                  </h1>
                  <div className="mt-1">
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono truncate text-xs dark:text-ink-300 text-ink-600 hover:text-foreground hover:underline"
                    >
                      {site.url}
                    </a>
                  </div>

                  {site.categories.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {site.categories.map((category) => (
                        <Badge
                          key={category.id}
                          className="bg-brand-yellow-light/20 border-brand-yellow-dark dark:text-ink-300 text-ink-600 font-sans"
                        >
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="font-sans text-base leading-relaxed dark:text-ink-200 text-ink-700 text-pretty">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-4">{children}</p>,
                    }}
                  >
                    {site.description}
                  </ReactMarkdown>
                </div>
              </div>

              <div className="flex h-fit flex-col gap-3 rounded-xl bg-card p-5 ring-1 ring-foreground/10 lg:col-span-1">
                <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Visit {site.name}
                </span>

                <a
                  href={site.url}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "w-full bg-brand-blue-700 dark:bg-brand-blue-500 text-ink-50",
                  )}
                >
                  <ExternalLink className="size-4" />
                  Open website
                </a>

                {site.facebookUrl && (
                  <a
                    href={site.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "w-full",
                    )}
                  >
                    <Link2 className="size-4" />
                    Facebook page
                  </a>
                )}

                {site.whatsapp && (
                  <a
                    href={`https://wa.me/${site.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "w-full",
                    )}
                  >
                    <FaWhatsapp className="size-4" />
                    WhatsApp
                  </a>
                )}
              </div>
            </div>

            <RelatedSites site={site} />
          </div>
        </div>
      </main>
    </div>
  );
}
