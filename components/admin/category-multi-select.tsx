"use client";

import { useState } from "react";
import { ChevronsUpDown, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
import type { CategoryWithCount } from "@/lib/admin/categories";

export function CategoryMultiSelect({
  categories,
  value,
  onChange,
}: {
  categories: CategoryWithCount[];
  value: string[];
  onChange: (ids: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = categories.filter((category) => value.includes(category.id));

  function toggle(id: string) {
    if (value.includes(id)) {
      onChange(value.filter((existing) => existing !== id));
    } else {
      onChange([...value, id]);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button type="button" variant="outline" className="w-full justify-between">
              <span className={selected.length === 0 ? "text-muted-foreground" : undefined}>
                {selected.length > 0 ? `${selected.length} selected` : "Select categories"}
              </span>
              <ChevronsUpDown className="size-4 text-muted-foreground" />
            </Button>
          }
        />
        <PopoverContent className="w-(--anchor-width) p-0" align="start">
          <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandList>
              <CommandEmpty>No categories found.</CommandEmpty>
              <CommandGroup>
                {categories.map((category) => {
                  const isSelected = value.includes(category.id);
                  return (
                    <CommandItem
                      key={category.id}
                      value={category.name}
                      data-checked={isSelected ? "true" : undefined}
                      onSelect={() => toggle(category.id)}
                    >
                      {category.name}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((category) => (
            <Badge key={category.id} variant="secondary" className="gap-1">
              {category.name}
              <button
                type="button"
                onClick={() => toggle(category.id)}
                aria-label={`Remove ${category.name}`}
                className="rounded-full text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
