import "server-only";
import sharp from "sharp";

const SCREENSHOT_ENDPOINT = "https://api.allscreenshots.com/v1/screenshots";

/**
 * Capture viewport. 1280x640 is 2:1, matching the `aspect-16/8` box the site card
 * renders images into, so nothing gets stretched. It is also narrower than the API
 * default (1920x1080), so desktop layouts spread their content less.
 */
const VIEWPORT_WIDTH = 1280;
const VIEWPORT_HEIGHT = 640;

/** Capture at 2x and downscale, which is sharper than capturing at 1x. */
const DEVICE_SCALE_FACTOR = 2;

/** Width of the stored WebP. */
const MAX_IMAGE_WIDTH = 1280;
const WEBP_QUALITY = 80;

export class ScreenshotError extends Error {}

/** Captures a screenshot of `url` via allscreenshots.com and returns the raw PNG bytes. */
export async function captureScreenshot(url: string): Promise<Buffer> {
  const apiKey = process.env.ALLSCREENSHOTSAPI?.trim();
  if (!apiKey) {
    throw new ScreenshotError("Screenshot API key is not configured");
  }

  let response: Response;
  try {
    response = await fetch(SCREENSHOT_ENDPOINT, {
      method: "POST",
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        viewport: {
          width: VIEWPORT_WIDTH,
          height: VIEWPORT_HEIGHT,
          deviceScaleFactor: DEVICE_SCALE_FACTOR,
        },
        blockCookieBanners: true,
      }),
    });
  } catch {
    throw new ScreenshotError("Could not reach the screenshot service");
  }

  if (!response.ok) {
    throw new ScreenshotError(
      `Screenshot service returned ${response.status}. Check the URL and try again.`,
    );
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.byteLength === 0) {
    throw new ScreenshotError("Screenshot service returned an empty image");
  }

  return buffer;
}

/**
 * Some sites block headless browsers and hand back a blank page. Pixel variance near
 * zero means a flat image, which we would rather reject than publish as a site card.
 */
const MIN_PIXEL_STDEV = 1;

/** Scales a captured screenshot down to a web-friendly WebP. */
export async function toWebp(screenshot: Buffer): Promise<Buffer> {
  let webp: Buffer;
  try {
    webp = await sharp(screenshot)
      .resize({ width: MAX_IMAGE_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();
  } catch {
    throw new ScreenshotError("Could not convert the screenshot to WebP");
  }

  const { channels } = await sharp(webp).stats();
  const stdev = channels.reduce((sum, c) => sum + c.stdev, 0) / channels.length;
  if (stdev < MIN_PIXEL_STDEV) {
    throw new ScreenshotError(
      "The screenshot came back blank — the site may be blocking automated capture. Add it manually from the Sites page.",
    );
  }

  return webp;
}
