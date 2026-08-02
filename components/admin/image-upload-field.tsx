"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ImagePlus, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ImageUploadField({
  file,
  onChange,
  existingImageUrl,
  error,
}: {
  file: File | null;
  onChange: (file: File | null) => void;
  existingImageUrl?: string | null;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const displayUrl = previewUrl ?? existingImageUrl ?? null;

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    onChange(selected ?? null);
  }

  function handleRemove() {
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-1.5">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      {displayUrl ? (
        <div className="relative overflow-hidden rounded-lg border border-input">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayUrl}
            alt="Site preview"
            className="h-40 w-full object-cover"
          />
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            className="absolute top-2 right-2"
            onClick={handleRemove}
            aria-label="Remove image"
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex h-40 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-input text-sm text-muted-foreground transition-colors hover:border-ring hover:text-foreground",
            error && "border-destructive text-destructive",
          )}
        >
          <ImagePlus className="size-6" />
          Click to upload an image
        </button>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="self-start"
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="size-3.5" />
        Replace image
      </Button>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
