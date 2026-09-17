"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FooterButton() {
  const pathname = usePathname();

  const handleClick = () => {
    if (pathname === "/search") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <Link
      href="/search"
      onClick={handleClick}
      className="group inline-flex items-center gap-4 rounded-xl bg-brand-blue-700 px-6 py-3.5 text-sm font-medium text-ink-199 transition hover:bg-brand-yellow-dark"
    >
      Search the directory
      <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-blue-900/15 transition group-hover:translate-x-0.5">
        <svg
          aria-hidden
          className="h-3 w-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </span>
    </Link>
  );
}
