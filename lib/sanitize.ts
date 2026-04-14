/**
 * lib/sanitize.ts
 *
 * Input sanitization utilities.
 *
 * SECURITY NOTE:
 *   React already escapes string values rendered in JSX, preventing XSS.
 *   This module adds a second layer for server-side handling, log safety,
 *   and future use cases (e.g. writing to a DB or sending in emails).
 *
 *   We do NOT use a heavy library like DOMPurify here because:
 *     1. We run server-side (no DOM available without jsdom).
 *     2. We only need plaintext sanitization, not HTML sanitization.
 *
 *   If you ever allow rich-text / HTML input, add DOMPurify or sanitize-html.
 */

/** Strip HTML tags and dangerous characters from a string. */
export function sanitizeText(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return raw
    .replace(/<[^>]*>/g, "")          // strip any HTML tags
    .replace(/[<>'"]/g, "")           // strip remaining angle brackets + quotes
    .trim()
    .slice(0, 2000);                   // hard cap to prevent oversized payloads
}

/** Sanitize a phone number and normalise Israeli international formats to local. */
export function sanitizePhone(raw: unknown): string {
  if (typeof raw !== "string") return "";
  const cleaned = raw.replace(/[^\d\s\-+()]/g, "").trim().slice(0, 20);
  // Normalise +972 / +9720 formats to local 0XX…
  const s = cleaned.replace(/[\s\-().]/g, "");
  if (/^\+9720/.test(s)) return "0" + s.slice(5);
  if (/^\+972/.test(s))  return "0" + s.slice(4);
  return cleaned;
}

/** Sanitize an email address — basic character allowlist. */
export function sanitizeEmail(raw: unknown): string {
  if (typeof raw !== "string") return "";
  // Allow only safe email characters
  return raw.replace(/[^a-zA-Z0-9._%+\-@]/g, "").trim().slice(0, 254);
}

/** Validate Israeli phone format (0XX-XXXXXXX or 0XXXXXXXXX). */
export function isValidIsraeliPhone(phone: string): boolean {
  const cleaned = phone.replace(/[-\s]/g, "");
  return /^0\d{8,9}$/.test(cleaned);
}

/** Basic email format validation. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}
