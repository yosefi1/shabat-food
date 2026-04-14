"use client";

/**
 * components/admin/shared.tsx
 * Shared UI primitives reused across admin pages.
 */

import { useEffect, useRef, useState } from "react";
import { X, Printer, Phone, Mail, MapPin, Clock, FileText, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────────
 * Types (re-exported so pages don't duplicate them)
 * ─────────────────────────────────────────────────────────────────────────── */
export type OrderStatus = "new"|"processing"|"ready"|"delivered"|"cancelled";
export type SortDir     = "asc"|"desc";

export interface AdminOrder {
  orderId:    string;
  createdAt:  string;
  status:     OrderStatus;
  customer: {
    name: string; phone: string; email: string;
    address: string; city: string; deliveryTime: string; notes: string;
  };
  items: { id: string; name: string; price: number; quantity: number }[];
  totalPrice: number;
}

export const STATUS_LABEL: Record<string, string> = {
  new:"חדש", processing:"בטיפול", ready:"מוכן", delivered:"נמסר", cancelled:"בוטל",
};
export const STATUS_STYLE: Record<string, string> = {
  new:        "bg-blue-50 text-blue-700",
  processing: "bg-amber-50 text-amber-700",
  ready:      "bg-purple-50 text-purple-700",
  delivered:  "bg-green-50 text-green-700",
  cancelled:  "bg-red-50 text-red-700",
};

/* ─────────────────────────────────────────────────────────────────────────────
 * SortTh — clickable sortable table header cell
 * ─────────────────────────────────────────────────────────────────────────── */
export function SortTh<T extends string>({
  label, col, current, dir, onSort,
}: {
  label: string; col: T; current: T; dir: SortDir; onSort: (k: T) => void;
}) {
  const active = current === col;
  return (
    <th
      className="px-4 py-3 text-right cursor-pointer select-none hover:bg-gray-100 transition-colors group"
      onClick={() => onSort(col)}
    >
      {/* justify-start = visual RIGHT in RTL (flex-start follows writing direction) */}
      <span className="flex items-center gap-1 justify-start">
        {label}
        <span className={`transition-colors ${active ? "text-amber-500" : "text-gray-300 group-hover:text-gray-400"}`}>
          {!active                     && <ChevronsUpDown size={12} />}
          {active && dir === "asc"     && <ChevronUp      size={12} />}
          {active && dir === "desc"    && <ChevronDown     size={12} />}
        </span>
      </span>
    </th>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * OrderModal — full order detail popup
 * ─────────────────────────────────────────────────────────────────────────── */
export function OrderModal({
  order, onClose, onStatusChange, updating,
}: {
  order:          AdminOrder;
  onClose:        () => void;
  onStatusChange: (id: string, status: string) => void;
  updating:       string | null;
}) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const panelRef = useRef<HTMLDivElement>(null);

  /* Sync when order prop changes */
  useEffect(() => { setStatus(order.status); }, [order.status]);

  /* Close on Escape */
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const [customerOpen, setCustomerOpen] = useState(false);
  const deliveryFee = order.totalPrice > 0 ? (order.totalPrice >= 200 ? 0 : 25) : 0;
  const grandTotal  = order.totalPrice + deliveryFee;
  const isBusy      = updating === order.orderId;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-[2px] p-4 pt-12 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={`פרטי הזמנה ${order.orderId}`}
    >
      <div
        ref={panelRef}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-auto"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">מספר הזמנה</p>
            <p className="font-mono font-bold text-gray-900 text-sm">{order.orderId}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date(order.createdAt).toLocaleString("he-IL")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${STATUS_STYLE[order.status] ?? "bg-gray-100 text-gray-600"}`}>
              {STATUS_LABEL[order.status] ?? order.status}
            </span>
            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              title="הדפס"
            >
              <Printer size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              aria-label="סגור"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Status changer */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4">
            <span className="text-sm font-semibold text-gray-700 flex-shrink-0">עדכן סטטוס:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white flex-1"
            >
              {(["new","processing","ready","delivered","cancelled"] as const).map((st) => (
                <option key={st} value={st}>{STATUS_LABEL[st]}</option>
              ))}
            </select>
            <button
              onClick={() => onStatusChange(order.orderId, status)}
              disabled={isBusy || status === order.status}
              className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors flex-shrink-0"
            >
              {isBusy ? "..." : "שמור"}
            </button>
          </div>

          {/* Items — shown first */}
          <div>
            <h3 className="font-bold text-gray-900 text-sm mb-3">פריטי ההזמנה</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-100">
                  <th className="pb-2 text-right font-semibold">פריט</th>
                  <th className="pb-2 text-center font-semibold">כמות</th>
                  <th className="pb-2 text-left font-semibold">מחיר</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2 font-medium text-gray-900">{item.name}</td>
                    <td className="py-2 text-center text-gray-500">×{item.quantity}</td>
                    <td className="py-2 text-left font-semibold text-gray-900">
                      {item.price > 0 ? `₪${item.price * item.quantity}` : "??"}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-gray-200">
                <tr>
                  <td colSpan={2} className="pt-3 text-xs text-gray-500">משלוח</td>
                  <td className="pt-3 text-left font-semibold text-sm">
                    {order.totalPrice === 0 ? "—" : deliveryFee === 0 ? "חינם" : `₪${deliveryFee}`}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className="pt-1.5 font-black text-gray-900">סה&quot;כ</td>
                  <td className="pt-1.5 text-left font-black text-gray-900 text-lg">
                    {order.totalPrice === 0 ? "—" : `₪${grandTotal}`}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Customer — collapsible */}
          <div className="border border-gray-100 rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setCustomerOpen((o) => !o)}
              className="w-full flex items-center justify-between px-4 py-3 bg-amber-50 hover:bg-amber-100 transition-colors cursor-pointer"
            >
              <span className="font-bold text-amber-800 text-sm">▼ פרטי לקוח</span>
              {customerOpen
                ? <ChevronUp size={16} className="text-gray-400" />
                : <ChevronDown size={16} className="text-gray-400" />
              }
            </button>

            {customerOpen && (
              <div className="px-4 py-4 space-y-2.5">
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {[
                    { icon: FileText, v: order.customer.name,                                 label: "שם"     },
                    { icon: Phone,    v: order.customer.phone,                                label: "טלפון"  },
                    { icon: Mail,     v: order.customer.email,                                label: "אימייל" },
                    { icon: MapPin,   v: `${order.customer.address}, ${order.customer.city}`, label: "כתובת"  },
                    { icon: Clock,    v: order.customer.deliveryTime,                         label: "מועד"   },
                  ].map(({ icon: Icon, v, label }) => (
                    <div key={label} className="flex items-start gap-2.5 bg-gray-50 rounded-xl px-3 py-2.5">
                      <Icon size={15} className="text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] text-gray-400 leading-none">{label}</p>
                        <p className="text-sm font-semibold text-gray-900 mt-0.5">{v}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {order.customer.notes && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <p className="text-xs text-amber-600 font-semibold mb-0.5">הערות:</p>
                    <p className="text-sm text-amber-900">{order.customer.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
