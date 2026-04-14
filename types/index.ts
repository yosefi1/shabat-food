/**
 * types/index.ts
 *
 * Central type exports for the app.
 *
 * CustomerDetails and OrderPayload are derived from Zod schemas
 * in lib/schemas.ts — do NOT define them manually here. Keeping
 * them schema-derived means the TypeScript type and runtime validation
 * rules can never drift apart.
 */

/* Re-export schema-derived types so the rest of the app can keep
   importing from "@/types" without knowing about the schema. */
export type { CustomerDetails, OrderPayload } from "@/lib/schemas";

/* ── Menu / catalog types ─────────────────────────────────────────────────── */
export interface MenuItem {
  id:          string;
  name:        string;
  description: string;
  price:       number;
  image:       string;
  category:    string;
  badge?:      "bestseller" | "popular" | "new";
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Category {
  id:    string;
  name:  string;
  emoji: string;
}

/* ── API response ─────────────────────────────────────────────────────────── */
export interface ApiResponse {
  success:   boolean;
  orderId?:  string;
  message:   string;
  error?:    string;
}
