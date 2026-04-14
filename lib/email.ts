/**
 * lib/email.ts
 *
 * Email utilities using Nodemailer over SMTP.
 *
 * SETUP REQUIRED (before this works in production):
 *   1. Add the following to your .env.local:
 *        SMTP_HOST=smtp.gmail.com          # or your provider
 *        SMTP_PORT=587
 *        SMTP_USER=your@email.com
 *        SMTP_PASS=your-app-password
 *        EMAIL_FROM="שבת פוד <orders@shabbatfood.co.il>"
 *        EMAIL_BUSINESS=owner@shabbatfood.co.il
 *
 *   2. For Gmail, use an App Password (not your regular password):
 *        https://support.google.com/accounts/answer/185833
 *
 *   3. For production, consider a transactional email service for better
 *        deliverability: Resend, SendGrid, Amazon SES, or Postmark.
 *
 * PRIVACY NOTE:
 *   Customer email addresses are used only for order confirmation.
 *   They are not shared with third parties or used for marketing.
 *   See Privacy Policy for details.
 */

import nodemailer from "nodemailer";
import type { OrderPayload } from "@/types";

/**
 * FIX C1 — Escape HTML special characters before injecting user data into
 * email templates. Even after sanitizeText, `&` and other chars can produce
 * broken or unexpected HTML. This is a second, mandatory safety layer.
 */
function esc(str: unknown): string {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Build the transporter lazily so it only fails at send-time, not import-time. */
function createTransporter() {
  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST   || "smtp.gmail.com",
    port:   Number(process.env.SMTP_PORT) || 587,
    secure: false,                  // STARTTLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/** HTML email template for the customer receipt. */
function buildCustomerEmail(orderId: string, payload: OrderPayload): string {
  const { customer, items, totalPrice } = payload;
  const deliveryFee = totalPrice >= 200 ? 0 : 25;
  const grandTotal  = totalPrice + deliveryFee;

  const itemRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f5edd9;">${esc(item.name)}</td>
        <td style="padding:8px;border-bottom:1px solid #f5edd9;text-align:center;">×${esc(item.quantity)}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f5edd9;text-align:left;">
          ${item.price > 0 ? `₪${(item.price * item.quantity).toLocaleString("he-IL")}` : "לפי הצעת מחיר"}
        </td>
      </tr>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FDFAF3;font-family:Arial,sans-serif;direction:rtl;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.08);">
    <tr>
      <td style="background:#2C1810;padding:28px 32px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:24px;">🕯️ שבת פוד</h1>
        <p style="color:#D4A574;margin:8px 0 0;font-size:14px;">אישור הזמנה</p>
      </td>
    </tr>
    <tr>
      <td style="padding:32px;">
        <p style="color:#2C1810;font-size:16px;margin:0 0 8px;">שלום ${esc(customer.name)},</p>
        <p style="color:#8B5A2B;font-size:14px;margin:0 0 24px;">ההזמנה שלך התקבלה בהצלחה! מספר הזמנה: <strong style="color:#2C1810;">${esc(orderId)}</strong></p>

        <h2 style="color:#2C1810;font-size:16px;border-bottom:2px solid #F5EBE0;padding-bottom:8px;">פרטי ההזמנה</h2>
        <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#2C1810;">
          ${itemRows}
          <tr>
            <td colspan="2" style="padding:8px 0;color:#8B5A2B;">משלוח</td>
            <td style="padding:8px 0;text-align:left;color:${deliveryFee === 0 ? "#16a34a" : "#2C1810"};">
              ${deliveryFee === 0 ? "חינם" : `₪${deliveryFee}`}
            </td>
          </tr>
          ${totalPrice > 0 ? `
          <tr>
            <td colspan="2" style="padding:12px 0 0;font-weight:bold;font-size:16px;color:#2C1810;">סה&quot;כ לתשלום</td>
            <td style="padding:12px 0 0;text-align:left;font-weight:bold;font-size:16px;color:#2C1810;">₪${grandTotal.toLocaleString("he-IL")}</td>
          </tr>` : ""}
        </table>

        <h2 style="color:#2C1810;font-size:16px;border-bottom:2px solid #F5EBE0;padding-bottom:8px;margin-top:24px;">פרטי משלוח</h2>
        <table style="font-size:14px;color:#8B5A2B;line-height:2;">
          <tr><td style="width:100px;color:#2C1810;font-weight:bold;">כתובת:</td><td>${esc(customer.address)}, ${esc(customer.city)}</td></tr>
          <tr><td style="color:#2C1810;font-weight:bold;">מועד:</td><td>${esc(customer.deliveryTime)}</td></tr>
          ${customer.notes ? `<tr><td style="color:#2C1810;font-weight:bold;">הערות:</td><td>${esc(customer.notes)}</td></tr>` : ""}
        </table>

        <p style="margin:24px 0 0;font-size:13px;color:#B87D40;background:#FDF8F5;padding:12px 16px;border-radius:8px;border-right:3px solid #D4A574;">
          ניצור איתך קשר לאישור סופי לפני המשלוח. לשאלות: <a href="tel:050-000-0000" style="color:#B87D40;">050-000-0000</a>
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 32px;background:#F5EBE0;text-align:center;font-size:12px;color:#8B5A2B;">
        © ${new Date().getFullYear()} שבת פוד &nbsp;|&nbsp;
        <a href="${process.env.NEXT_PUBLIC_BASE_URL ?? "https://shabbatfood.co.il"}/legal/privacy" style="color:#8B5A2B;">מדיניות פרטיות</a>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Plain-text summary for the business owner notification. */
function buildOwnerEmail(orderId: string, payload: OrderPayload): string {
  const { customer, items, totalPrice } = payload;
  const lines = [
    `הזמנה חדשה! מספר: ${orderId}`,
    `תאריך: ${new Date().toLocaleString("he-IL")}`,
    ``,
    `===== פרטי לקוח =====`,
    `שם: ${customer.name}`,
    `טלפון: ${customer.phone}`,
    `אימייל: ${customer.email}`,
    `כתובת: ${customer.address}`,
    `מועד משלוח: ${customer.deliveryTime}`,
    customer.notes ? `הערות: ${customer.notes}` : "",
    ``,
    `===== מוצרים =====`,
    ...items.map(
      (i) => `${i.name} × ${i.quantity}${i.price > 0 ? ` — ₪${i.price * i.quantity}` : ""}`
    ),
    ``,
    `סה"כ: ${totalPrice > 0 ? `₪${totalPrice}` : "לפי הצעת מחיר"}`,
  ];
  return lines.filter(Boolean).join("\n");
}

/**
 * Send order confirmation emails to both customer and business owner.
 * Fails silently with a logged error so a mail misconfiguration never
 * blocks the order from being saved.
 */
export async function sendOrderEmails(
  orderId: string,
  payload: OrderPayload
): Promise<void> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn(
      "[email] SMTP credentials not configured — skipping email send.",
      "Set SMTP_USER, SMTP_PASS, SMTP_HOST in .env.local"
    );
    return;
  }

  const transporter = createTransporter();
  const from = process.env.EMAIL_FROM ?? `שבת פוד <${process.env.SMTP_USER}>`;
  const ownerEmail = process.env.EMAIL_BUSINESS ?? process.env.SMTP_USER;

  try {
    // Customer receipt
    await transporter.sendMail({
      from,
      to:      payload.customer.email,
      subject: `אישור הזמנה מספר ${orderId} — שבת פוד`,
      html:    buildCustomerEmail(orderId, payload),
    });

    // Owner notification
    await transporter.sendMail({
      from,
      to:      ownerEmail,
      subject: `[הזמנה חדשה] ${orderId} — ${payload.customer.name}`,
      text:    buildOwnerEmail(orderId, payload),
    });

    console.info(`[email] Order emails sent for ${orderId}`);
  } catch (err) {
    // Log but don't throw — order is already saved, email is best-effort
    console.error("[email] Failed to send order emails:", err);
  }
}
