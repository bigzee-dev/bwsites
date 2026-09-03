"use client";

import Link from "next/link";

export function Test() {
  return (
    <Link
      href="/search/media"
      scroll={false}
      onClick={() => {
        window.scrollTo(0, 0);
      }}
    >
      LINK TEST
    </Link>
  );
}
