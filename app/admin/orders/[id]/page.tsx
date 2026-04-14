"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Printer, Phone, Mail, MapPin, Clock, FileText } from "lucide-react";

const STATUS_LABEL: Record<string, string> = {
  new:"חדש", processing:"בטיפול", ready:"מוכן", delivered:"נמסר", cancelled:"בוטל",
};
const STATUS_STYLE: Record<string, string> = {
  new:"bg-blue-50 text-blue-700", processing:"bg-amber-50 text-amber-700",
  ready:"bg-purple-50 text-purple-700", delivered:"bg-green-50 text-green-700",
  cancelled:"bg-red-50 text-red-700",
};

interface Order {
  orderId: string; createdAt: string; status: string;
  customer: { name:string; phone:string; email:string; address:string; city:string; deliveryTime:string; notes:string };
  items: { id:string; name:string; price:number; quantity:number }[];
  totalPrice: number;
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }    = use(params);
  const router    = useRouter();
  const [order,   setOrder]   = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [status,  setStatus]  = useState("");
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        setOrder(data);
        setStatus(data?.status ?? "new");
        setLoading(false);
      });
  }, [id]);

  async function saveStatus() {
    setSaving(true);
    await fetch(`/api/admin/orders/${id}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ status }),
    });
    setSaving(false);
    router.refresh();
  }

  if (loading) return <div className="flex items-center justify-center h-48 text-gray-400">טוען...</div>;
  if (!order)  return <div className="text-red-500 p-4">הזמנה לא נמצאה</div>;

  const deliveryFee = order.totalPrice > 0 ? (order.totalPrice >= 200 ? 0 : 25) : 0;
  const grandTotal  = order.totalPrice + deliveryFee;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowRight size={18} /> חזרה להזמנות
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
        >
          <Printer size={16} /> הדפס
        </button>
      </div>

      {/* Order ID + status */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">מספר הזמנה</p>
            <p className="font-mono font-bold text-gray-900">{order.orderId}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(order.createdAt).toLocaleString("he-IL")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${STATUS_STYLE[order.status] ?? "bg-gray-100 text-gray-600"}`}>
              {STATUS_LABEL[order.status] ?? order.status}
            </span>
          </div>
        </div>

        {/* Status changer */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
          <label className="text-sm font-semibold text-gray-700">עדכן סטטוס:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            {["new","processing","ready","delivered","cancelled"].map((st) => (
              <option key={st} value={st}>{STATUS_LABEL[st]}</option>
            ))}
          </select>
          <button
            onClick={saveStatus}
            disabled={saving || status === order.status}
            className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors"
          >
            {saving ? "שומר..." : "שמור"}
          </button>
        </div>
      </div>

      {/* Customer */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="font-bold text-gray-900 mb-4">פרטי לקוח</h2>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          {[
            { icon: FileText, label: "שם",      value: order.customer.name },
            { icon: Phone,    label: "טלפון",   value: order.customer.phone },
            { icon: Mail,     label: "אימייל",  value: order.customer.email },
            { icon: MapPin,   label: "כתובת",   value: `${order.customer.address}, ${order.customer.city}` },
            { icon: Clock,    label: "מועד",    value: order.customer.deliveryTime },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <Icon size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="font-semibold text-gray-900">{value}</p>
              </div>
            </div>
          ))}
        </div>
        {order.customer.notes && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3">
            <p className="text-xs text-amber-600 font-semibold mb-1">הערות הלקוח:</p>
            <p className="text-sm text-amber-900">{order.customer.notes}</p>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="font-bold text-gray-900 mb-4">פריטי ההזמנה</h2>
        <table className="w-full text-sm">
          <thead className="text-xs text-gray-500 border-b border-gray-100">
            <tr>
              <th className="pb-2 text-right">פריט</th>
              <th className="pb-2 text-center">כמות</th>
              <th className="pb-2 text-left">מחיר</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="py-2.5 font-medium text-gray-900">{item.name}</td>
                <td className="py-2.5 text-center text-gray-500">×{item.quantity}</td>
                <td className="py-2.5 text-left font-semibold text-gray-900">
                  {item.price > 0 ? `₪${item.price * item.quantity}` : "??"}
                </td>
              </tr>
            ))}
          </tbody>
          {order.totalPrice > 0 && (
            <tfoot className="border-t border-gray-200 text-sm">
              <tr>
                <td colSpan={2} className="pt-3 text-gray-500">משלוח</td>
                <td className="pt-3 text-left font-semibold">{deliveryFee === 0 ? "חינם" : `₪${deliveryFee}`}</td>
              </tr>
              <tr>
                <td colSpan={2} className="pt-2 font-bold text-gray-900">סה&quot;כ</td>
                <td className="pt-2 text-left font-black text-gray-900 text-lg">₪{grandTotal}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
