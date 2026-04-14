/**
 * POST /api/checkout
 *
 * SECURITY LAYERS (in order):
 *   1. Rate limiting      — max 5 requests / 10 min per IP
 *   2. Content-Type guard — rejects non-JSON bodies
 *   3. Payload size guard — rejects bodies > 50 KB
 *   4. JSON parsing       — catches malformed JSON
 *   5. Sanitization       — strips HTML / dangerous chars from every string
 *   6. Zod validation     — enforces schema, types, lengths, and business rules
 *   7. Persistence        — order saved + emails sent
 */

import { randomUUID }   from "crypto";
import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types";
import { orderSchema }      from "@/lib/schemas";
import { checkRateLimit }   from "@/lib/rateLimit";
import { sanitizeText, sanitizePhone, sanitizeEmail } from "@/lib/sanitize";
import { saveOrder }        from "@/lib/orders";
import { sendOrderEmails }  from "@/lib/email";

const MAX_BODY_BYTES = 50_000;

export async function POST(req: NextRequest) {

  /* ── 1. Rate limiting ──────────────────────────────────────────────────── */
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(`checkout:${ip}`, 5, 10 * 60 * 1000)) {
    return fail("יותר מדי בקשות. נסו שוב בעוד מספר דקות.", 429);
  }

  /* ── 2. Content-Type guard ─────────────────────────────────────────────── */
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return fail("סוג תוכן לא נתמך", 415);
  }

  /* ── 3. Payload size guard ─────────────────────────────────────────────── */
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return fail("הבקשה גדולה מדי", 413);
  }

  /* ── 4. Parse JSON ─────────────────────────────────────────────────────── */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let raw: any;
  try {
    raw = await req.json();
  } catch {
    return fail("גוף הבקשה אינו JSON תקין", 400);
  }

  /* ── 5. Sanitize — strip HTML/scripts BEFORE Zod touches the data ──────── */
  //
  // Zod validates business rules; sanitization is a separate defence layer
  // that ensures we never store XSS payloads even if Zod validation passes.
  //
  const sanitized = {
    customer: {
      name:         sanitizeText(raw?.customer?.name),
      phone:        sanitizePhone(raw?.customer?.phone),
      email:        sanitizeEmail(raw?.customer?.email),
      address:      sanitizeText(raw?.customer?.address),
      city:         sanitizeText(raw?.customer?.city),
      deliveryTime: sanitizeText(raw?.customer?.deliveryTime),
      notes:        sanitizeText(raw?.customer?.notes ?? "").slice(0, 500),
      consent:      Boolean(raw?.customer?.consent),
    },
    items:      Array.isArray(raw?.items)
      ? raw.items.map((item: unknown) => {
          if (typeof item !== "object" || !item) return item;
          const i = item as Record<string, unknown>;
          return {
            ...i,
            name:        sanitizeText(i.name),
            description: sanitizeText(i.description ?? ""),
          };
        })
      : raw?.items,
    totalPrice: raw?.totalPrice,
  };

  /* ── 6. Zod validation ─────────────────────────────────────────────────── */
  //
  // orderSchema covers: types, min/max lengths, phone regex, email format,
  // consent must be true, items array non-empty, no extra keys (.strict()).
  //
  const parsed = orderSchema.safeParse(sanitized);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    console.warn("[checkout] Validation failed:", parsed.error.issues);
    return fail(firstError?.message ?? "נתונים לא תקינים", 400);
  }

  const { customer, items, totalPrice } = parsed.data;

  /* ── 7. Generate order ID ──────────────────────────────────────────────── */
  // FIX H2 — crypto.randomUUID() is cryptographically secure; unpredictable
  // and collision-resistant. Old format (timestamp + 4-digit random) was guessable.
  const orderId   = `ORD-${randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase()}`;
  const createdAt = new Date().toISOString();

  /* ── 8. Persist ────────────────────────────────────────────────────────── */
  await saveOrder({ orderId, createdAt, customer, items, totalPrice, ip });

  /* ── 9. Send emails (fire-and-forget) ──────────────────────────────────── */
  sendOrderEmails(orderId, { customer, items, totalPrice }).catch(() => {});

  /* ── 10. Respond ───────────────────────────────────────────────────────── */
  const response: ApiResponse = {
    success: true,
    orderId,
    message: `תודה ${customer.name}! ההזמנה התקבלה ואישור נשלח לאימייל. מספר הזמנה: ${orderId}`,
  };
  return NextResponse.json(response, { status: 201 });
}

function fail(message: string, status: number) {
  return NextResponse.json<ApiResponse>({ success: false, message }, { status });
}
