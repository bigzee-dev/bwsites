import "server-only";
import { cache } from "react";

import { listAllR2Objects } from "@/lib/admin/r2";

/** Only bucket objects that a browser can actually render as a thumbnail. */
const IMAGE_EXTENSION = /\.(webp|png|jpe?g|gif|avif|svg)$/i;

/** Keys look like `sites/<uuid>-<filename>.webp`; the uuid is noise when scanning a list. */
const UUID_PREFIX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-/i;

export type R2Image = {
  /** Full bucket key — what the download route needs, and what search falls back to. */
  key: string;
  /** Human-facing filename: folder and upload uuid stripped off. */
  name: string;
  /** Folder the key sits in, e.g. `sites`. Empty for objects at the bucket root. */
  folder: string;
  /** Public URL used for the thumbnail. */
  url: string;
  size: number;
  /** ISO string so it survives the server-to-client boundary. */
  uploadedAt: string | null;
};

function toDisplayName(key: string) {
  const filename = key.slice(key.lastIndexOf("/") + 1);
  return filename.replace(UUID_PREFIX, "") || filename;
}

function toFolder(key: string) {
  const slash = key.lastIndexOf("/");
  return slash === -1 ? "" : key.slice(0, slash);
}

/** Public URLs are built per segment so keys with spaces or `#` still resolve. */
function toPublicUrl(key: string) {
  const path = key.split("/").map(encodeURIComponent).join("/");
  return `${process.env.R2_PUBLIC_URL}/${path}`;
}

/**
 * Every image in the R2 bucket, newest first.
 *
 * Cloudflare's dashboard cannot search object names, so the whole bucket is listed
 * once per request and filtered in the browser — that keeps typing in the search box
 * instant, and a few thousand keys is a small payload.
 */
export const getR2Images = cache(async function getR2Images(): Promise<R2Image[]> {
  const objects = await listAllR2Objects();

  return objects
    .filter((object) => IMAGE_EXTENSION.test(object.key))
    .map((object) => ({
      key: object.key,
      name: toDisplayName(object.key),
      folder: toFolder(object.key),
      url: toPublicUrl(object.key),
      size: object.size,
      uploadedAt: object.lastModified?.toISOString() ?? null,
    }))
    .sort((a, b) => (b.uploadedAt ?? "").localeCompare(a.uploadedAt ?? ""));
});
