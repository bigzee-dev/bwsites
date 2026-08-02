"use client";

import Link from "next/link";
import { scrollToHash } from "@/lib/scroll";
import type { ComponentPropsWithoutRef } from "react";

type Props = Omit<ComponentPropsWithoutRef<typeof Link>, "href"> & {
  hash: string;
};

export function HashLink({ hash, children, ...props }: Props) {
  return (
    <Link {...props} href={hash} onClick={(e) => scrollToHash(e, hash)}>
      {children}
    </Link>
  );
}
