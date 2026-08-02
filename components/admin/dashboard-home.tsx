import Link from "next/link";
import { ArrowUpRight, Globe2, Layers, Tags, type LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { getDashboardStats } from "@/lib/admin/dashboard";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function StatCard({
  label,
  value,
  icon: Icon,
  href,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  href: string;
}) {
  return (
    <Link href={href} className="group block">
      <Card className="transition-colors group-hover:ring-ring/50">
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
          <Icon className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex items-end justify-between">
          <p className="text-3xl font-semibold tracking-tight text-foreground">{value}</p>
          <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </CardContent>
      </Card>
    </Link>
  );
}

export function DashboardHome({
  stats,
}: {
  stats: Awaited<ReturnType<typeof getDashboardStats>>;
}) {
  const { totalSites, totalCategories, totalCollections, recentSites } = stats;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total sites" value={totalSites} icon={Globe2} href="/admin/sites" />
        <StatCard label="Total categories" value={totalCategories} icon={Tags} href="/admin/categories" />
        <StatCard label="Total collections" value={totalCollections} icon={Layers} href="/admin/collections" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recently added sites</CardTitle>
        </CardHeader>
        <CardContent>
          {recentSites.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No sites yet. Add your first one to see it here.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {recentSites.map((site) => (
                <li key={site.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="flex min-w-0 items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={site.image}
                      alt={site.name}
                      className="size-9 shrink-0 rounded-md border border-border object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{site.name}</p>
                      {site.categories.length > 0 && (
                        <div className="mt-0.5 flex flex-wrap gap-1">
                          {site.categories.slice(0, 2).map((category) => (
                            <Badge key={category.id} variant="secondary" className="text-[10px]">
                              {category.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {dateFormatter.format(site.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
