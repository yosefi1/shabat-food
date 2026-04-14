/**
 * lib/schemas.ts
 *
 * Single source of truth for all data shapes and validation rules.
 *
 * WHY ZOD:
 *   - Schema defined once → TypeScript types derived automatically
 *   - Same schema runs on both client (form UX) and server (API security)
 *   - Impossible for client and server rules to drift apart
 *   - Detailed, field-level error messages out of the box
 *   - Replaces 60+ lines of manual if-checks with a declarative schema
 */

import { z } from "zod";

/**
 * Normalise an Israeli phone number to local format (0XXXXXXXXX).
 * Handles:
 *   0501234567        → 0501234567  (already local)
 *   +972501234567     → 0501234567  (standard international)
 *   +9720501234567    → 0501234567  (common mistake: 0 retained after country code)
 *   050-123-4567      → 0501234567  (dashes/spaces stripped)
 */
export function normalizePhone(raw: string): string {
  const s = raw.replace(/[\s\-().]/g, "");          // strip formatting chars
  if (/^\+9720/.test(s)) return "0" + s.slice(5);   // +9720XX… → 0XX…
  if (/^\+972/.test(s))  return "0" + s.slice(4);   // +972XX…  → 0XX…
  return s;
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Delivery slots — defined here so schema and UI stay in sync
 * ─────────────────────────────────────────────────────────────────────────── */
export const DELIVERY_SLOTS = [
  "שישי 07:00 – 09:00",
  "שישי 09:00 – 11:00",
  "שישי 11:00 – 13:00",
] as const;

/* ─────────────────────────────────────────────────────────────────────────────
 * Customer / shipping details
 * ─────────────────────────────────────────────────────────────────────────── */
export const customerSchema = z.object({
  name: z
    .string()
    .min(2,   "נא להזין שם מלא (לפחות 2 תווים)")
    .max(100, "השם ארוך מדי"),

  /* Accepts local (0501234567), international (+972501234567),
     and the common mistake of adding a leading 0 after the country code (+9720501234567).
     All are normalised to the 0XXXXXXXXX local format before validation. */
  phone: z
    .string()
    .refine(
      (v) => /^0\d{8,9}$/.test(normalizePhone(v)),
      "נא להזין מספר טלפון ישראלי תקין (לדוגמה: 050-0000000 או +972-50-000-0000)"
    ),

  email: z
    .string()
    .email("נא להזין כתובת אימייל תקינה")
    .max(254, "כתובת האימייל ארוכה מדי"),

  address: z
    .string()
    .min(5,   "נא להזין כתובת מלאה (רחוב ומספר בית)")
    .max(200, "הכתובת ארוכה מדי"),

  city: z
    .string()
    .min(2,  "נא להזין עיר")
    .max(100,"שם העיר ארוך מדי"),

  /* FIX C2 — validate against allowed enum, not just non-empty string */
  deliveryTime: z.enum(DELIVERY_SLOTS, {
    message: "נא לבחור מועד משלוח תקין",
  }),

  notes: z
    .string()
    .max(500, "ההערות ארוכות מדי (מקסימום 500 תווים)")
    .optional()
    .default(""),

  /* Must be explicitly true — checked on both client and server */
  consent: z
    .boolean()
    .refine((v) => v === true, {
      message: "יש לאשר את תנאי השימוש ומדיניות הפרטיות",
    }),
});

/* ─────────────────────────────────────────────────────────────────────────────
 * Cart item (mirrors MenuItem + quantity)
 * Strict allowlist of keys prevents prototype pollution / extra fields.
 * ─────────────────────────────────────────────────────────────────────────── */
const cartItemSchema = z
  .object({
    id:          z.string().max(50),
    name:        z.string().max(200),
    description: z.string().max(1000).optional().default(""),
    price:       z.number().min(0).max(999_999),
    image:       z.string().max(500),
    category:    z.string().max(50),
    badge:       z.enum(["bestseller", "popular", "new"]).optional(),
    quantity:    z.number().int().min(1).max(999),
  })
  .strict(); // rejects any extra keys

/* ─────────────────────────────────────────────────────────────────────────────
 * Full order payload
 * ─────────────────────────────────────────────────────────────────────────── */
export const orderSchema = z.object({
  customer:   customerSchema,
  items:      z.array(cartItemSchema).min(1, "ההזמנה ריקה"),
  totalPrice: z.number().min(0).max(999_999),
});

/* ─────────────────────────────────────────────────────────────────────────────
 * TypeScript types — derived from schemas, never written by hand.
 * Import these instead of writing `interface CustomerDetails { ... }`.
 * ─────────────────────────────────────────────────────────────────────────── */
export type CustomerDetails = z.infer<typeof customerSchema>;
export type OrderPayload     = z.infer<typeof orderSchema>;

/* ─────────────────────────────────────────────────────────────────────────────
 * Helper: flatten Zod errors into a simple field → message map.
 * Used in the checkout page to feed the existing `errors` state.
 * ─────────────────────────────────────────────────────────────────────────── */
export function flattenZodErrors(
  error: z.ZodError | undefined
): Partial<Record<string, string>> {
  const out: Partial<Record<string, string>> = {};
  if (!error) return out;
  // Use .issues (canonical property) not .errors (getter alias that can be non-iterable)
  for (const issue of error.issues) {
    const field = issue.path[issue.path.length - 1]?.toString() ?? "_";
    if (!out[field]) out[field] = issue.message;
  }
  return out;
}
