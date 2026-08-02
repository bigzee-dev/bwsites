/**
 * Central company details.
 *
 * Import these anywhere instead of hard-coding values, e.g.
 *   import { COMPANY_NAME, WHATSAPP_LINK } from "@/lib/constants";
 *
 * Values marked PLACEHOLDER should be replaced once the client confirms them.
 */

export const COMPANY_NAME = "E&E Driver Training Consultancy";

/** Short form used in tight spaces (nav, footer marks). */
export const COMPANY_SHORT_NAME = "E&E";

export const TAGLINE =
  "BQA & HRDC accredited driver training — delivered at your site.";

/** Raw WhatsApp number, kept in international format. */
export const WHATSAPP_NUMBER = "+26771368178";

/** wa.me expects digits only (no "+", spaces or dashes). */
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER.replace(
  /[^0-9]/g,
  "",
)}`;

/** Pre-filled enquiry text so leads arrive with context. */
export const WHATSAPP_MESSAGE_LINK = `${WHATSAPP_LINK}?text=${encodeURIComponent(
  `Hello ${COMPANY_NAME}, I'd like to enquire about your driver training courses.`,
)}`;

// PLACEHOLDER — confirm with client.
export const FACEBOOK_URL = "https://www.facebook.com/eedrivertraining";

// PLACEHOLDER — confirm with client.
export const EMAIL_ADDRESS = "info@eedrivertraining.co.bw";

export const EMAIL_LINK = `mailto:${EMAIL_ADDRESS}`;

// PLACEHOLDER — confirm with client.
export const LOCATION_ADDRESS = "Mogonono, Gaborone, Botswana";

/** Base of operations. The consultancy is mobile and trains nationwide. */
export const CITY = "Gaborone";
export const COUNTRY = "Botswana";
