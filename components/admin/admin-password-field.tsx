"use client";

import { useState, type ComponentProps } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function AdminPasswordField({
  id,
  label,
  className,
  ...props
}: {
  id: string;
  label: string;
} & ComponentProps<typeof Input>) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <Label
        htmlFor={id}
        className="text-[0.7rem] font-medium tracking-[0.12em] text-muted-foreground uppercase"
      >
        {label}
      </Label>
      <div className="relative">
        <Lock
          className="pointer-events-none absolute top-1/2 left-0 size-4 -translate-y-1/2 text-muted-foreground/70"
          strokeWidth={1.75}
        />
        <Input
          id={id}
          type={visible ? "text" : "password"}
          className={cn(
            "h-10 rounded-none border-0 border-b-2 border-border bg-transparent px-0 pr-8 pl-6 text-[0.95rem] shadow-none transition-colors placeholder:text-muted-foreground/50 focus-visible:border-brand-blue-900 focus-visible:ring-0 dark:focus-visible:border-brand-blue-300",
            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          tabIndex={-1}
          className="absolute top-1/2 right-0 -translate-y-1/2 text-muted-foreground/70 transition-colors hover:text-foreground"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? (
            <EyeOff className="size-4" strokeWidth={1.75} />
          ) : (
            <Eye className="size-4" strokeWidth={1.75} />
          )}
        </button>
      </div>
    </div>
  );
}
