"use client";

import { useEffect, useState } from "react";
import { Download, RefreshCw } from "lucide-react";

interface Order {
  orderId: string; createdAt: string; status: string;
  customer: { name:string; phone:string; email:string; address:string; city:string; deliveryTime:string };
  items: { name:string; quantity:number; price:number }[];
  totalPrice: number;
}

export default function ReportsPage() {
  const [orders,  setOrders]  = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [from,    setFrom]    = useState("");
  const [to,      setTo]      = useState("");

  useEffect(() => {
    fetch("/api/admin/orders").then((r) => r.json()).then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  function filtered() {
    return orders.filter((o) => {
      const d = o.createdAt.slice(0,10);
      if (from && d < from) return false;
      if (to   && d > to)   return false;
      return true;
    });
  }

  function downloadCSV() {
    const rows = filtered();
    const header = ["מ. הזמנה","תאריך","שם","טלפון","אימייל","כתובת","עיר","מועד משלוח","מוצרים","סכום","סטטוס"];
    const lines  = rows.map((o) => [
      o.orderId,
      new Date(o.createdAt).toLocaleDateString("he-IL"),
      o.customer.name,
      o.customer.phone,
      o.customer.email,
      o.customer.address,
      o.customer.city,
      o.customer.deliveryTime,
      o.items.map((i) => `${i.name}×${i.quantity}`).join(" | "),
      o.totalPrice > 0 ? o.totalPrice : "??",
      o.status,
    ].map((v) => `"${String(v).replace(/"/g,"''")}"`).join(","));

    const csv  = [header.join(","), ...lines].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type:"text/csv;charset=utf-8;" }); // BOM for Excel
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `orders-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const shown = filtered();
  const totalRevenue = shown.filter((o) => o.status !== "cancelled").reduce((s,o) => s + o.totalPrice, 0);

  return (
    <div className="space-y-5">

      {/* Filters + download */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="font-bold text-gray-900 mb-4">ייצוא דוחות</h2>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">מתאריך</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">עד תאריך</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <button
            onClick={downloadCSV}
            disabled={loading || shown.length === 0}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            <Download size={16} /> הורד CSV ({shown.length} הזמנות)
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          קובץ ה-CSV נפתח ב-Excel ומכיל את כל פרטי ההזמנות.
          ללא תחום תאריכים — כל ההזמנות יוייצאו.
        </p>
      </div>

      {/* Summary */}
      {loading ? (
        <div className="flex items-center justify-center h-24 text-gray-400">
          <RefreshCw size={18} className="animate-spin ml-2" /> טוען...
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "הזמנות בטווח",      value: shown.length },
            { label: "הכנסה כוללת",        value: totalRevenue > 0 ? `₪${totalRevenue.toLocaleString("he-IL")}` : "??" },
            { label: "הוזמנו",             value: shown.filter((o) => o.status !== "cancelled").length },
            { label: "בוטלו",              value: shown.filter((o) => o.status === "cancelled").length },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
              <p className="text-2xl font-black text-gray-900">{value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Coming soon features */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="font-bold text-gray-900 mb-3">🚧 בפיתוח</h2>
        <ul className="space-y-2 text-sm text-gray-500">
          {["ייצוא PDF","דוח מע\"מ","גרף הכנסות חודשי","השוואה לתקופה קודמת","דוח לקוחות מובילים"].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-gray-200 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
