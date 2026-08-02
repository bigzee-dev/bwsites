"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Globe,
  LayoutDashboard,
  Layers,
  Menu,
  Search,
  Tags,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AdminLogoutButton } from "@/components/admin/admin-logout-button";

export const NAV_ITEMS = [
  { href: "/admin", label: "Home", icon: LayoutDashboard },
  { href: "/admin/sites", label: "Sites", icon: Globe },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/collections", label: "Collections", icon: Layers },
  { href: "/admin/searches", label: "Searches", icon: Search },
];

type SidebarUser = {
  name: string;
  email: string;
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "A";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase();
}

function SidebarBrand() {
  return (
    <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
      <div className="flex size-7 items-center justify-center rounded-md bg-brand-blue-900 text-xs font-bold text-white dark:bg-brand-blue-300 dark:text-brand-blue-900">
        BW
      </div>
      <span className="font-[family-name:var(--font-admin-display)] text-sm font-semibold tracking-tight text-sidebar-foreground">
        BW Sites Admin
      </span>
    </div>
  );
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-0.5 p-3 pt-7">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <Icon className="size-4" strokeWidth={1.75} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarUserFooter({ user }: { user: SidebarUser }) {
  return (
    <div className="flex flex-col gap-3 border-t border-sidebar-border p-3">
      <div className="flex items-center gap-2.5 px-1">
        <Avatar size="sm">
          <AvatarFallback className="bg-brand-blue-900/10 text-xs font-semibold text-brand-blue-900 dark:bg-brand-blue-300/10 dark:text-brand-blue-300">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-sidebar-foreground font-[family-name:var(--font-admin-display)]">
            {user.name}
          </p>
          <p className="truncate text-xs text-sidebar-foreground/60">
            {user.email}
          </p>
        </div>
      </div>
      <AdminLogoutButton />
    </div>
  );
}

export function AdminSidebar({ user }: { user: SidebarUser }) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <SidebarBrand />
      <SidebarNav />
      <SidebarUserFooter user={user} />
    </aside>
  );
}

export function AdminMobileNav({ user }: { user: SidebarUser }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
      >
        <Menu className="size-5" />
      </Button>
      <SheetContent side="left" className="flex w-64 flex-col bg-sidebar p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <SidebarBrand />
        <SidebarNav onNavigate={() => setOpen(false)} />
        <SidebarUserFooter user={user} />
      </SheetContent>
    </Sheet>
  );
}
