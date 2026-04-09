import { NextRequest, NextResponse } from "next/server";
import { OrderPayload, ApiResponse } from "@/types";

/* ─────────────────────────────────────────────────────────────────────────────
 *  POST /api/checkout
 *
 *  Receives an OrderPayload, validates it, and (in production) initiates a
 *  payment flow through a gateway such as Grow / Meshulam / Cardcom.
 *  ─────────────────────────────────────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  let body: OrderPayload;

  /* ── 1. Parse body ── */
  try {
    body = await req.json();
  } catch {
    return error("גוף הבקשה אינו תקין", 400);
  }

  /* ── 2. Validate ── */
  const { customer, items, totalPrice } = body;

  if (!customer?.name?.trim())
    return error("שם הלקוח חסר", 400);

  if (!customer?.phone?.trim())
    return error("טלפון הלקוח חסר", 400);

  if (!customer?.address?.trim())
    return error("כתובת חסרה", 400);

  if (!Array.isArray(items) || items.length === 0)
    return error("ההזמנה ריקה", 400);

  if (typeof totalPrice !== "number" || totalPrice <= 0)
    return error("סכום ההזמנה אינו תקין", 400);

  /* ── 3. Generate order ID ── */
  const orderId = `SB-${Date.now()}-${Math.floor(Math.random() * 9000) + 1000}`;

  /* ── 4. Payment gateway integration ─────────────────────────────────────────
   *
   *  TODO: Replace this block with your chosen gateway SDK call.
   *
   *  Example — Meshulam:
   *    const { pageUrl } = await meshulam.createPaymentPage({
   *      sum:         totalPrice,
   *      description: `הזמנת שבת פוד ${orderId}`,
   *      successUrl:  `${process.env.BASE_URL}/checkout/success?orderId=${orderId}`,
   *      failUrl:     `${process.env.BASE_URL}/checkout/fail`,
   *      customer:    { name: customer.name, phone: customer.phone },
   *    });
   *    return NextResponse.json({ success: true, orderId, paymentUrl: pageUrl });
   *
   *  Example — Grow:
   *    const session = await grow.payments.create({ amount: totalPrice * 100, ... });
   *    return NextResponse.json({ success: true, orderId, sessionId: session.id });
   *
   * ─────────────────────────────────────────────────────────────────────────── */

  /* ── 5. Persist order (placeholder) ─────────────────────────────────────────
   *
   *  TODO: Save to your database / CRM / Google Sheets / email here.
   *    await db.orders.create({ orderId, customer, items, totalPrice, createdAt: new Date() });
   *    await sendConfirmationEmail(customer.email, orderId);
   *
   * ─────────────────────────────────────────────────────────────────────────── */

  /* ── 6. Return success ── */
  const response: ApiResponse = {
    success: true,
    orderId,
    message: `ההזמנה שלך התקבלה בהצלחה! נחזור אליך בקרוב לאישור. מספר הזמנה: ${orderId}`,
  };

  return NextResponse.json(response, { status: 201 });
}

/* ── Helper ── */
function error(message: string, status = 400) {
  const body: ApiResponse = { success: false, message };
  return NextResponse.json(body, { status });
}
