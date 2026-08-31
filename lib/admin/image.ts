import "server-only";
import sharp from "sharp";

/**
 * Manually uploaded images are stored the same way screenshots are: a WebP no wider
 * than the card image slot, so the browser never downloads a 4MB phone photo to render
 * a 1280px card.
 */
const MAX_IMAGE_WIDTH = 1280;
const WEBP_QUALITY = 80;

export class ImageProcessingError extends Error {}

export type OptimizedImage = { buffer: Buffer; contentType: "image/webp" };

/** Turns an uploaded or admin-typed filename into a `<name>.webp` filename. */
export function toWebpFilename(filename: string) {
  const base = filename.replace(/\.[a-zA-Z0-9]+$/, "").trim();
  return `${base || "image"}.webp`;
}

/** Converts an uploaded image file to downscaled WebP bytes ready for R2. */
export async function optimizeImageToWebp(file: File): Promise<OptimizedImage> {
  const input = Buffer.from(await file.arrayBuffer());

  let buffer: Buffer;
  try {
    buffer = await sharp(input)
      // Phone photos carry their orientation in EXIF; rotate() bakes it into the pixels
      // before the metadata is dropped on the way to WebP.
      .rotate()
      .resize({ width: MAX_IMAGE_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();
  } catch {
    throw new ImageProcessingError("That file could not be read as an image");
  }

  return { buffer, contentType: "image/webp" };
}
