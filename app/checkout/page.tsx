"use client";

import { useState, FormEvent, useId } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Truck, ShieldCheck, Clock, CheckCircle, Mail } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { ApiResponse }                         from "@/types";
import { customerSchema, flattenZodErrors,
         DELIVERY_SLOTS, type CustomerDetails } from "@/lib/schemas";

const INITIAL: CustomerDetails = {
  name:         "",
  phone:        "",
  email:        "",
  address:      "",
  city:         "",
  deliveryTime: DELIVERY_SLOTS[0],
  notes:        "",
  consent:      false,
};

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const [form, setForm]       = useState<CustomerDetails>(INITIAL);
  const [errors, setErrors]   = useState<Partial<Record<string, string>>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<ApiResponse | null>(null);

  /* Announce form errors to screen readers */
  const errorSummaryId = useId();

  const deliveryFee = totalPrice > 0 ? (totalPrice >= 200 ? 0 : 25) : 0;
  const grandTotal  = totalPrice + deliveryFee;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    /* Client-side validation via the same Zod schema used on the server.
       Rules can never drift between client and server — one source of truth. */
    const result = customerSchema.safeParse(form);
    if (!result.success) {
      setErrors(flattenZodErrors(result.error));
      return;
    }
    setErrors({});

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ customer: form, items, totalPrice }),
      });
      const data: ApiResponse = await res.json();
      setResult(data);
      if (data.success) clearCart();
    } catch {
      setResult({ success: false, message: "שגיאת רשת. בדקו את החיבור ונסו שוב." });
    } finally {
      setLoading(false);
    }
  }

  /* ── Empty cart guard ── */
  if (totalItems === 0 && !result?.success) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-cream px-4 text-center">
        <span className="text-6xl" aria-hidden="true">🛒</span>
        <h1 className="text-3xl font-black text-brown-900">העגלה ריקה</h1>
        <p className="text-brown-500">לא ניתן לסיים הזמנה ללא מוצרים</p>
        <Link
          href="/"
          className="bg-amber-500 hover:bg-amber-600 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 text-white font-bold px-8 py-3 rounded-xl transition-colors"
        >
          חזור לתפריט
        </Link>
      </main>
    );
  }

  /* ── Success state ── */
  if (result?.success) {
    return (
      <main>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="min-h-screen flex flex-col items-center justify-center gap-6 bg-cream px-4 text-center"
          role="alert"
          aria-live="assertive"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center"
            aria-hidden="true"
          >
            <CheckCircle size={44} className="text-green-500" />
          </motion.div>
          <h1 className="text-4xl font-black text-brown-900">ההזמנה התקבלה!</h1>
          <p className="text-brown-500 text-lg max-w-sm leading-relaxed">{result.message}</p>
          {result.orderId && (
            <p className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 text-amber-700 font-bold text-sm">
              מספר הזמנה: <span dir="ltr">{result.orderId}</span>
            </p>
          )}
          <p className="text-sm text-brown-400">אישור נשלח לאימייל שלך</p>
          <Link
            href="/"
            className="bg-amber-500 hover:bg-amber-600 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 text-white font-bold px-8 py-3 rounded-xl transition-colors mt-2"
          >
            חזור לעמוד הבית
          </Link>
        </motion.div>
      </main>
    );
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="min-h-screen bg-cream">
      {/* Skip to main content — accessibility */}
      <a
        href="#checkout-form"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-[100] focus:bg-amber-500 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold"
      >
        דלג לטופס ההזמנה
      </a>

      {/* Top bar */}
      <header className="bg-white border-b border-brown-100 px-4 py-4">
        <div className="mx-auto max-w-6xl flex items-center gap-3">
          <Link
            href="/"
            aria-label="חזור לחנות"
            className="text-brown-400 hover:text-brown-700 focus-visible:ring-2 focus-visible:ring-amber-400 rounded transition-colors"
          >
            <ChevronRight size={22} aria-hidden="true" />
          </Link>
          <span className="font-black text-xl text-brown-900">🕯️ שבת פוד</span>
          <span className="mx-auto" />
          <div className="flex items-center gap-1 text-xs text-brown-400">
            <ShieldCheck size={14} className="text-green-500" aria-hidden="true" />
            תשלום מאובטח
          </div>
        </div>
      </header>

      <main id="checkout-form">
        <div className="mx-auto max-w-6xl px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── Form ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            {/* Error summary for screen readers */}
            {hasErrors && (
              <div
                id={errorSummaryId}
                role="alert"
                aria-live="polite"
                className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4"
              >
                <p className="font-bold text-red-700 mb-2">יש לתקן את השגיאות הבאות:</p>
                <ul className="list-disc list-inside text-red-600 text-sm space-y-1">
                  {Object.values(errors).map((msg) => (
                    <li key={msg}>{msg}</li>
                  ))}
                </ul>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              noValidate
              aria-describedby={hasErrors ? errorSummaryId : undefined}
              className="space-y-8"
            >

              {/* ── Shipping details ── */}
              <section aria-labelledby="shipping-heading" className="bg-white rounded-2xl p-6 shadow-sm">
                <h2
                  id="shipping-heading"
                  className="text-xl font-black text-brown-900 mb-5 flex items-center gap-2"
                >
                  <Truck size={20} className="text-amber-500" aria-hidden="true" />
                  פרטי המשלוח
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="שם מלא"
                    id="name"
                    required
                    value={form.name}
                    error={errors.name}
                    onChange={(v) => setForm({ ...form, name: v })}
                    placeholder="ישראל ישראלי"
                    autoComplete="name"
                  />
                  <Field
                    label="טלפון"
                    id="phone"
                    type="tel"
                    required
                    value={form.phone}
                    error={errors.phone}
                    onChange={(v) => setForm({ ...form, phone: v })}
                    placeholder="050-000-0000"
                    autoComplete="tel"
                    dir="ltr"
                    inputMode="tel"
                  />
                  <div className="sm:col-span-2">
                    <Field
                      label="אימייל"
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      error={errors.email}
                      onChange={(v) => setForm({ ...form, email: v })}
                      placeholder="you@example.com"
                      autoComplete="email"
                      dir="ltr"
                      inputMode="email"
                      hint="לשליחת אישור הזמנה"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Field
                      label="כתובת (רחוב ומספר בית)"
                      id="address"
                      required
                      value={form.address}
                      error={errors.address}
                      onChange={(v) => setForm({ ...form, address: v })}
                      placeholder="רחוב הרצל 10"
                      autoComplete="address-line1"
                    />
                  </div>
                  <Field
                    label="עיר"
                    id="city"
                    required
                    value={form.city}
                    error={errors.city}
                    onChange={(v) => setForm({ ...form, city: v })}
                    placeholder="תל אביב"
                    autoComplete="address-level2"
                  />

                  {/* Delivery slot */}
                  <div>
                    <label htmlFor="deliveryTime" className="block text-sm font-semibold text-brown-700 mb-1.5">
                      <Clock size={14} className="inline ml-1 text-amber-500" aria-hidden="true" />
                      מועד משלוח <span aria-hidden="true" className="text-red-500">*</span>
                      <span className="sr-only">(שדה חובה)</span>
                    </label>
                    <select
                      id="deliveryTime"
                      value={form.deliveryTime}
                      onChange={(e) => setForm({ ...form, deliveryTime: e.target.value })}
                      required
                      aria-required="true"
                      className="w-full border border-brown-200 rounded-xl px-4 py-3 text-brown-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      {DELIVERY_SLOTS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Notes */}
                  <div className="sm:col-span-2">
                    <label htmlFor="notes" className="block text-sm font-semibold text-brown-700 mb-1.5">
                      הערות להזמנה
                      <span className="text-brown-400 font-normal"> (אופציונלי)</span>
                    </label>
                    <textarea
                      id="notes"
                      rows={3}
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      maxLength={500}
                      placeholder="אלרגיות, בקשות מיוחדות, הוראות כניסה..."
                      className="w-full border border-brown-200 rounded-xl px-4 py-3 text-brown-900 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>
              </section>

              {/* ── Payment placeholder ── */}
              <section aria-labelledby="payment-heading" className="bg-white rounded-2xl p-6 shadow-sm">
                <h2
                  id="payment-heading"
                  className="text-xl font-black text-brown-900 mb-2 flex items-center gap-2"
                >
                  <ShieldCheck size={20} className="text-green-500" aria-hidden="true" />
                  אמצעי תשלום
                </h2>
                <p className="text-brown-500 text-sm mb-4">
                  התשלום מעובד בצורה מאובטחת דרך שער תשלומים מוסמך. פרטי כרטיס האשראי אינם
                  נשמרים בשרת שלנו.
                </p>
                {/*
                  PAYMENT GATEWAY PLACEHOLDER
                  Replace this block with your chosen gateway:
                    <GrowWidget amount={grandTotal} onSuccess={...} />
                  or redirect to payment page after order creation.
                */}
                <div className="border-2 border-dashed border-amber-300 bg-amber-50 rounded-xl p-6 text-center">
                  <p className="text-amber-700 font-semibold text-sm">
                    🔗 כאן יתחבר שער התשלומים (Grow / Meshulam)
                  </p>
                  <p className="text-amber-600 text-xs mt-1">
                    לחיצה על ׳אישור הזמנה׳ תשלח את ההזמנה — תשלום בהמשך
                  </p>
                </div>
              </section>

              {/* ── Consent ── */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <input
                    id="consent"
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                    required
                    aria-required="true"
                    aria-describedby={errors.consent ? "consent-error" : undefined}
                    className="mt-1 h-4 w-4 rounded border-brown-300 text-amber-500 focus:ring-2 focus:ring-amber-400 focus:ring-offset-1 cursor-pointer flex-shrink-0"
                  />
                  <label htmlFor="consent" className="text-sm text-brown-700 cursor-pointer leading-relaxed">
                    קראתי ואני מסכים/ה ל
                    <Link href="/legal/terms" target="_blank" className="text-amber-600 hover:underline focus-visible:ring-1 focus-visible:ring-amber-400 rounded mx-1">
                      תנאי השימוש
                    </Link>
                    ול
                    <Link href="/legal/privacy" target="_blank" className="text-amber-600 hover:underline focus-visible:ring-1 focus-visible:ring-amber-400 rounded mx-1">
                      מדיניות הפרטיות
                    </Link>
                    <span className="text-red-500 mr-1" aria-hidden="true">*</span>
                  </label>
                </div>
                {errors.consent && (
                  <p id="consent-error" role="alert" className="text-red-500 text-xs mt-2 mr-7 font-medium">
                    {errors.consent}
                  </p>
                )}
              </div>

              {/* ── Server error ── */}
              {result && !result.success && (
                <p
                  role="alert"
                  aria-live="assertive"
                  className="text-red-500 text-sm font-semibold bg-red-50 border border-red-200 rounded-xl px-4 py-3"
                >
                  {result.message}
                </p>
              )}

              {/* ── Submit ── */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 text-white font-black py-5 rounded-2xl text-xl shadow-lg shadow-amber-200 transition-all"
                aria-busy={loading}
              >
                {loading
                  ? "שולח הזמנה..."
                  : totalPrice > 0
                    ? `אישור הזמנה — ₪${grandTotal.toLocaleString("he-IL")}`
                    : "אישור הזמנה"}
              </button>

              <p className="text-center text-xs text-brown-400">
                <Mail size={12} className="inline ml-1" aria-hidden="true" />
                אישור ישלח לאימייל שלך לאחר ההזמנה
              </p>
            </form>
          </motion.div>

          {/* ── Order summary sidebar ── */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:sticky lg:top-24 self-start"
            aria-label="סיכום הזמנה"
          >
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h2 className="text-lg font-black text-brown-900 mb-4 border-b border-brown-100 pb-3">
                סיכום הזמנה
              </h2>

              <ul className="space-y-3 mb-5" aria-label="פריטים בהזמנה">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-3 items-center">
                    <div
                      className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-cream-100"
                      aria-hidden="true"
                    >
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-brown-900 truncate">{item.name}</p>
                      <p className="text-xs text-brown-400">
                        <span aria-label={`כמות: ${item.quantity}`}>×{item.quantity}</span>
                      </p>
                    </div>
                    <span className="text-sm font-bold text-brown-800 flex-shrink-0">
                      {item.price > 0
                        ? `₪${(item.price * item.quantity).toLocaleString("he-IL")}`
                        : "??"}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-brown-100 pt-4 space-y-2">
                {totalPrice > 0 && (
                  <>
                    <div className="flex justify-between text-sm text-brown-500">
                      <span>סכום ביניים</span>
                      <span>₪{totalPrice.toLocaleString("he-IL")}</span>
                    </div>
                    <div className="flex justify-between text-sm text-brown-500">
                      <span>משלוח</span>
                      <span className={deliveryFee === 0 ? "text-green-600 font-semibold" : ""}>
                        {deliveryFee === 0 ? "חינם" : `₪${deliveryFee}`}
                      </span>
                    </div>
                    <div className="flex justify-between font-black text-lg text-brown-900 pt-2 border-t border-brown-100">
                      <span>סה&quot;כ</span>
                      <span>₪{grandTotal.toLocaleString("he-IL")}</span>
                    </div>
                  </>
                )}
                {totalPrice === 0 && (
                  <p className="text-sm text-brown-400 text-center py-2">
                    המחירים יקבעו לאחר אישור ההזמנה
                  </p>
                )}
              </div>
            </div>

            {/* Trust badges */}
            <ul className="mt-4 grid grid-cols-3 gap-2 text-center list-none">
              {[
                { icon: "🔒", label: "תשלום מאובטח" },
                { icon: "🚚", label: "משלוח ביום שישי" },
                { icon: "✅", label: "טרי וביתי" },
              ].map(({ icon, label }) => (
                <li key={label} className="bg-white rounded-xl p-3 shadow-sm">
                  <div className="text-xl mb-1" aria-hidden="true">{icon}</div>
                  <p className="text-xs text-brown-500 font-medium leading-tight">{label}</p>
                </li>
              ))}
            </ul>
          </motion.aside>

        </div>
      </main>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Reusable accessible form field
 * ─────────────────────────────────────────────────────────────────────────── */
interface FieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  dir?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  hint?: string;
}

function Field({
  label, id, value, onChange, error, placeholder, type = "text",
  required, autoComplete, dir, inputMode, hint,
}: FieldProps) {
  const hintId  = `${id}-hint`;
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-brown-700 mb-1.5">
        {label}
        {required && (
          <>
            <span aria-hidden="true" className="text-red-500 mr-1">*</span>
            <span className="sr-only">(שדה חובה)</span>
          </>
        )}
        {hint && (
          <span id={hintId} className="text-brown-400 font-normal text-xs mr-2">{hint}</span>
        )}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        dir={dir}
        required={required}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={[hint ? hintId : "", error ? errorId : ""].filter(Boolean).join(" ") || undefined}
        inputMode={inputMode}
        className={`w-full border rounded-xl px-4 py-3 text-brown-900 bg-white focus:outline-none focus:ring-2 transition-all ${
          error
            ? "border-red-400 focus:ring-red-300"
            : "border-brown-200 focus:ring-amber-400"
        }`}
      />
      {error && (
        <p id={errorId} role="alert" className="text-red-500 text-xs mt-1 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
