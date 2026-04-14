import { supabase } from "@/lib/supabase";
import type { OrderPayload } from "@/types";

export interface StoredOrder extends OrderPayload {
  orderId:   string;
  createdAt: string;
  ip?:       string;
}

/**
 * Persist a completed order to Supabase.
 * Always logs a redacted summary to the console (visible in Vercel logs).
 */
export async function saveOrder(order: StoredOrder): Promise<void> {
  const redactedPhone = order.customer.phone.replace(/\d(?=\d{4})/g, "*");

  console.info("[order]", JSON.stringify({
    orderId:   order.orderId,
    createdAt: order.createdAt,
    name:      order.customer.name,
    phone:     redactedPhone,
    itemCount: order.items.length,
    total:     order.totalPrice,
  }));

  const { error } = await supabase.from("orders").insert({
    order_id:         order.orderId,
    created_at:       order.createdAt,
    customer_name:    order.customer.name,
    customer_phone:   order.customer.phone,
    customer_email:   order.customer.email,
    customer_address: `${order.customer.address}, ${order.customer.city}`,
    items:            order.items,
    total_price:      order.totalPrice,
    notes:            order.customer.notes ?? null,
    ip:               order.ip ?? null,
  });

  if (error) {
    console.error("[order] Failed to save to Supabase:", error.message);
    throw new Error("Failed to save order");
  }

  console.info(`[order] Saved to Supabase — ${order.orderId}`);
}
