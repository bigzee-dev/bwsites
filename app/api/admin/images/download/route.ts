import { getAdminSession } from "@/lib/admin/auth";
import { getR2Object } from "@/lib/admin/r2";

/**
 * Streams a bucket object back as an attachment.
 *
 * The thumbnails point straight at the public R2 URL, but a plain `<a download>` is
 * ignored on a cross-origin href — the browser navigates to the image instead of
 * saving it. Proxying through here lets us set Content-Disposition ourselves.
 */
export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const key = new URL(request.url).searchParams.get("key");
  if (!key) {
    return new Response("Missing image key", { status: 400 });
  }

  let object;
  try {
    object = await getR2Object(key);
  } catch {
    return new Response("Image not found", { status: 404 });
  }

  if (!object.Body) {
    return new Response("Image not found", { status: 404 });
  }

  const filename = key.slice(key.lastIndexOf("/") + 1);
  // Non-ASCII filenames need the RFC 5987 form; the quoted one is the fallback.
  const asciiFilename = filename.replace(/[^\x20-\x7e]/g, "_").replace(/"/g, "");

  return new Response(object.Body.transformToWebStream(), {
    headers: {
      "Content-Type": object.ContentType ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename="${asciiFilename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
      ...(object.ContentLength
        ? { "Content-Length": String(object.ContentLength) }
        : {}),
      "Cache-Control": "private, no-store",
    },
  });
}
