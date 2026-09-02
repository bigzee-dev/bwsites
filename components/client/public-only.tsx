"use client";

import { usePathname } from "next/navigation";

/**
 * The admin dashboard ships its own shell, so public chrome rendered from the
 * root layout is kept off /admin routes.
 */
export function PublicOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return <>{children}</>;
}
