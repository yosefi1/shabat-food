"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Truck, ShieldCheck, Clock, CheckCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CustomerDetails, ApiResponse } from "@/types";

const DELIVERY_SLOTS = [
  "שישי 07:00 – 09:00",
  "שישי 09:00 – 11:00",
  "שישי 11:00 – 13:00",
  "שישי אחרי 13:00 (איסוף עצמי)",
];

const INITIAL: CustomerDetails = {
  name: "",
  phone: "",
  address: "",
  deliveryTime: DELIVERY_SLOTS[0],
  notes: "",
};

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const [form, setForm] = useState<CustomerDetails>(INITIAL);
  const [errors, setErrors] = useState<Partial<CustomerDetails>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);

  /* ── Validation ── */
  function validate(): boolean {
    const e: Partial<CustomerDetails> = {};
    if (!form.name.trim())    e.name    = "נא להזין שם מלא";
    if (!/^0\d{8,9}$/.test(form.phone.replace(/[-\s]/g, "")))
      e.phone = "נא להזין מספר טלפון תקין";
    if (!form.address.trim()) e.address = "נא להזין כתובת";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /* ── Submit ── */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: form, items, totalPrice }),
      });
      const data: ApiResponse = await res.json();
      setResult(data);
      if (data.success) clearCart();
    } catch {
      setResult({ success: false, message: "שגיאת רשת, נסו שוב" });
    } finally {
      setLoading(false);
    }
  }

  /* ── Empty cart guard ── */
  if (totalItems === 0 && !result?.success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-cream px-4 text-center">
        <span className="text-6xl">🛒</span>
        <h1 className="text-3xl font-black text-brown-900">העגלה ריקה</h1>
        <p className="text-brown-500">לא ניתן לסיים הזמנה ללא מוצרים</p>
        <Link href="/" className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-3 rounded-xl transition-colors">
          חזור לתפריט
        </Link>
      </div>
    );
  }

  /* ── Success state ── */
  if (result?.success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen flex flex-col items-center justify-center gap-6 bg-cream px-4 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center"
        >
          <CheckCircle size={44} className="text-green-500" />
        </motion.div>
        <h1 className="text-4xl font-black text-brown-900">ההזמנה התקבלה! 🎉</h1>
        <p className="text-brown-500 text-lg max-w-sm leading-relaxed">
          {result.message}
        </p>
        {result.orderId && (
          <p className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 text-amber-700 font-bold text-sm">
            מספר הזמנה: {result.orderId}
          </p>
        )}
        <Link href="/" className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-3 rounded-xl transition-colors mt-2">
          חזור לעמוד הבית
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Top bar */}
      <div className="bg-white border-b border-brown-100 px-4 py-4">
        <div className="mx-auto max-w-6xl flex items-center gap-3">
          <Link href="/" aria-label="חזור לחנות" className="text-brown-400 hover:text-brown-700 transition-colors">
            <ChevronRight size={22} />
          </Link>
          <span className="font-black text-xl text-brown-900">🕯️ שבת פוד</span>
          <span className="mx-auto" />
          <div className="flex items-center gap-1 text-xs text-brown-400">
            <ShieldCheck size={14} className="text-green-500" />
            תשלום מאובטח
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* ── Left: Form ── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <form onSubmit={handleSubmit} noValidate className="space-y-8">

            {/* Customer details */}
            <section className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-black text-brown-900 mb-5 flex items-center gap-2">
                <Truck size={20} className="text-amber-500" />
                פרטי המשלוח
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="שם מלא *"
                  id="name"
                  value={form.name}
                  error={errors.name}
                  onChange={(v) => setForm({ ...form, name: v })}
                  placeholder="ישראל ישראלי"
                  autoComplete="name"
                />
                <Field
                  label="טלפון *"
                  id="phone"
                  type="tel"
                  value={form.phone}
                  error={errors.phone}
                  onChange={(v) => setForm({ ...form, phone: v })}
                  placeholder="050-000-0000"
                  autoComplete="tel"
                  dir="ltr"
                />
                <div className="sm:col-span-2">
                  <Field
                    label="כתובת מלאה *"
                    id="address"
                    value={form.address}
                    error={errors.address}
                    onChange={(v) => setForm({ ...form, address: v })}
                    placeholder="רחוב, מספר בית, עיר"
                    autoComplete="street-address"
                  />
                </div>

                {/* Delivery slot */}
                <div className="sm:col-span-2">
                  <label htmlFor="deliveryTime" className="block text-sm font-semibold text-brown-700 mb-1.5">
                    <Clock size={14} className="inline ml-1 text-amber-500" />
                    מועד משלוח *
                  </label>
                  <select
                    id="deliveryTime"
                    value={form.deliveryTime}
                    onChange={(e) => setForm({ ...form, deliveryTime: e.target.value })}
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
                    הערות להזמנה (אופציונלי)
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="אלרגיות, בקשות מיוחדות, הוראות כניסה..."
                    className="w-full border border-brown-200 rounded-xl px-4 py-3 text-brown-900 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>
            </section>

            {/* Payment placeholder */}
            <section className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-black text-brown-900 mb-2 flex items-center gap-2">
                <ShieldCheck size={20} className="text-green-500" />
                אמצעי תשלום
              </h2>
              <p className="text-brown-500 text-sm mb-4">
                התשלום מעובד בצורה מאובטחת דרך שער תשלומים מוסמך.
              </p>
              {/* ── PAYMENT GATEWAY PLACEHOLDER ──
                  Plug in Grow / Meshulam / Cardcom iframe or redirect here.
                  Example: <GrowPaymentWidget amount={totalPrice} onSuccess={...} />
              */}
              <div className="border-2 border-dashed border-amber-300 bg-amber-50 rounded-xl p-6 text-center">
                <p className="text-amber-700 font-semibold text-sm">
                  🔗 כאן יתחבר שער התשלומים (Grow / Meshulam)
                </p>
                <p className="text-amber-600 text-xs mt-1">
                  לחיצה על &#39;אישור הזמנה&#39; תשלח את ההזמנה ותפנה לתשלום
                </p>
              </div>
            </section>

            {/* Submit */}
            {result && !result.success && (
              <p className="text-red-500 text-sm font-semibold bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {result.message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] text-white font-black py-5 rounded-2xl text-xl shadow-lg shadow-amber-200 transition-all"
            >
              {loading ? "שולח הזמנה..." : `אישור הזמנה — ₪${totalPrice.toLocaleString("he-IL")}`}
            </button>
          </form>
        </motion.div>

        {/* ── Right: Order summary ── */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:sticky lg:top-24 self-start"
        >
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="text-lg font-black text-brown-900 mb-4 border-b border-brown-100 pb-3">
              סיכום הזמנה
            </h2>

            <ul className="space-y-3 mb-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 items-center">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-cream-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-brown-900 truncate">{item.name}</p>
                    <p className="text-xs text-brown-400">×{item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold text-brown-800">
                    ₪{item.price * item.quantity}
                  </span>
                </li>
              ))}
            </ul>

            <div className="border-t border-brown-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-brown-500">
                <span>סכום ביניים</span>
                <span>₪{totalPrice}</span>
              </div>
              <div className="flex justify-between text-sm text-brown-500">
                <span>משלוח</span>
                <span className="text-green-600 font-semibold">
                  {totalPrice >= 200 ? "חינם" : "₪25"}
                </span>
              </div>
              <div className="flex justify-between font-black text-lg text-brown-900 pt-2 border-t border-brown-100">
                <span>סה"כ</span>
                <span>
                  ₪{totalPrice >= 200 ? totalPrice : totalPrice + 25}
                </span>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              { icon: "🔒", label: "תשלום מאובטח" },
              { icon: "🚚", label: "משלוח ביום שישי" },
              { icon: "✅", label: "טרי וביתי" },
            ].map(({ icon, label }) => (
              <div key={label} className="bg-white rounded-xl p-3 shadow-sm">
                <div className="text-xl mb-1">{icon}</div>
                <p className="text-xs text-brown-500 font-medium leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </motion.aside>

      </div>
    </div>
  );
}

/* ── Reusable Field Component ── */
function Field({
  label, id, value, onChange, error, placeholder, type = "text",
  autoComplete, dir,
}: {
  label: string; id: string; value: string;
  onChange: (v: string) => void; error?: string;
  placeholder?: string; type?: string;
  autoComplete?: string; dir?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-brown-700 mb-1.5">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        dir={dir}
        className={`w-full border rounded-xl px-4 py-3 text-brown-900 bg-white focus:outline-none focus:ring-2 transition-all ${
          error
            ? "border-red-400 focus:ring-red-300"
            : "border-brown-200 focus:ring-amber-400"
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
    </div>
  );
}
