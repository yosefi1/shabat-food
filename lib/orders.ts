/**
 * lib/orders.ts
 *
 * Order persistence layer.
 *
 * CURRENT IMPLEMENTATION: Appends orders to a local JSON-lines file
 * (`orders.jsonl`). This works for:
 *   ✓ Local development
 *   ✓ Self-hosted Node.js server (VPS / Docker)
 *
 * DOES NOT WORK on Vercel / serverless (read-only filesystem).
 *
 * PRODUCTION UPGRADE PATH (choose one):
 *   1. Supabase (recommended) — free tier, SQL, row-level security
 *        npm install @supabase/supabase-js
 *        await supabase.from("orders").insert({ ... })
 *
 *   2. Google Sheets via API — no extra infra, easy to read as a business owner
 *        https://developers.google.com/sheets/api/quickstart/nodejs
 *
 *   3. Vercel Postgres / Neon — zero-config on Vercel
 *        https://vercel.com/docs/storage/vercel-postgres
 *
 *   4. MongoDB Atlas — flexible schema for order items
 *
 * PRIVACY NOTE:
 *   Orders contain personal data (name, phone, email, address).
 *   Ensure the storage location is access-controlled and compliant
 *   with the Israeli Privacy Protection Law (5741-1981) and its regulations.
 */

import fs   from "fs";
import path from "path";
import type { OrderPayload } from "@/types";

export interface StoredOrder extends OrderPayload {
  orderId:   string;
  createdAt: string;      // ISO 8601
  ip?:       string;      // for fraud analysis, not exposed to customer
}

/**
 * Persist a completed order.
 * Always logs to console (visible in Vercel logs).
 * Also writes to file if `ORDERS_FILE_PATH` env var is set.
 */
export async function saveOrder(order: StoredOrder): Promise<void> {
  // FIX H1 — redact phone number; full PII must not appear in logs
  const redactedPhone = order.customer.phone.replace(/\d(?=\d{4})/g, "*");

  console.info("[order]", JSON.stringify({
    orderId:   order.orderId,
    createdAt: order.createdAt,
    name:      order.customer.name,
    phone:     redactedPhone,          // e.g. "***-***-3456"
    itemCount: order.items.length,
    total:     order.totalPrice,
  }));

  // 2. Write to file (only if path is configured and writable)
  const filePath = process.env.ORDERS_FILE_PATH;
  if (!filePath) return;

  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // JSON Lines format — one order per line, easy to parse / grep / import to spreadsheet
    const line = JSON.stringify(order) + "\n";
    fs.appendFileSync(filePath, line, "utf-8");

    console.info(`[order] Saved to ${filePath}`);
  } catch (err) {
    console.error("[order] Failed to write order to file:", err);
  }
}
