"use client";

import { useState } from "react";
import { ChevronsUpDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MAX_COLLECTION_SITES } from "@/lib/admin/validation";
import type { SiteForSelection } from "@/lib/admin/sites";

export function SiteMultiSelect({
  sites,
  value,
  onChange,
}: {
  sites: SiteForSelection[];
  value: string[];
  onChange: (ids: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = value
    .map((id) => sites.find((site) => site.id === id))
    .filter((site): site is SiteForSelection => Boolean(site));
  const atLimit = value.length >= MAX_COLLECTION_SITES;

  function toggle(id: string) {
    if (value.includes(id)) {
      onChange(value.filter((existing) => existing !== id));
    } else if (!atLimit) {
      onChange([...value, id]);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button type="button" variant="outline" className="w-full justify-between">
              <span className="text-muted-foreground">
                {atLimit ? "Maximum of 6 sites reached" : "Search sites to add..."}
              </span>
              <ChevronsUpDown className="size-4 text-muted-foreground" />
            </Button>
          }
        />
        <PopoverContent className="w-(--anchor-width) p-0" align="start">
          <Command>
            <CommandInput placeholder="Search sites by name..." />
            <CommandList>
              <CommandEmpty>No sites found.</CommandEmpty>
              <CommandGroup>
                {sites.map((site) => {
                  const isSelected = value.includes(site.id);
                  const disabled = atLimit && !isSelected;
                  return (
                    <CommandItem
                      key={site.id}
                      value={site.name}
                      disabled={disabled}
                      data-checked={isSelected ? "true" : undefined}
                      onSelect={() => toggle(site.id)}
                      className="gap-2"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={site.image}
                        alt=""
                        className="size-5 shrink-0 rounded object-cover"
                      />
                      <span className="truncate">{site.name}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <p className="text-xs text-muted-foreground">
        {value.length} of {MAX_COLLECTION_SITES} sites selected
      </p>

      {selected.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {selected.map((site) => (
            <li
              key={site.id}
              className="flex items-center gap-2.5 rounded-md border border-border px-2.5 py-1.5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={site.image}
                alt=""
                className="size-7 shrink-0 rounded object-cover"
              />
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                {site.name}
              </span>
              <button
                type="button"
                onClick={() => toggle(site.id)}
                aria-label={`Remove ${site.name}`}
                className="rounded-full text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
