"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

/**
 * In production the target route's `loading.tsx` is prefetched, so the router
 * swaps it in the moment the link is clicked. That skeleton is much shorter
 * than a long page like the homepage, so the browser clamps the scroll offset
 * to the new maximum and the viewport lands on the footer until the real
 * content arrives and Next.js finally scrolls to the top. Resetting the scroll
 * before the swap keeps the transition steady.
 */
export function ScrollTopLink(props: ComponentPropsWithoutRef<typeof Link>) {
  const { onNavigate, ...rest } = props;

  return (
    <Link
      {...rest}
      onNavigate={(event) => {
        onNavigate?.(event);
        window.scrollTo(0, 0);
      }}
    />
  );
}
