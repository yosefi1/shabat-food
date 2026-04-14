"use client";

import { useEffect, useState } from "react";
import { Search, RefreshCw, ChevronLeft } from "lucide-react";
import Link from "next/link";

interface Customer {
  phone: string; name: string; email: string;
  orderCount: number; totalSpent: number; lastOrder: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [q,         setQ]         = useState("");

  useEffect(() => {
    // Derive customers from the orders API
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((orders: { customer: { phone:string;name:string;email:string }; totalPrice:number; createdAt:string; status:string }[]) => {
        const map: Record<string, Customer> = {};
        for (const o of orders) {
          const key = o.customer.phone;
          if (!map[key]) map[key] = { ...o.customer, orderCount:0, totalSpent:0, lastOrder:o.createdAt };
          map[key].orderCount++;
          if (o.status !== "cancelled") map[key].totalSpent += o.totalPrice;
          if (o.createdAt > map[key].lastOrder) map[key].lastOrder = o.createdAt;
        }
        setCustomers(Object.values(map).sort((a,b) => b.orderCount - a.orderCount));
        setLoading(false);
      });
  }, []);

  const filtered = customers.filter(
    (c) => !q || c.name.includes(q) || c.phone.includes(q) || c.email.includes(q)
  );

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "סה\"כ לקוחות",  value: customers.length },
          { label: "לקוחות חוזרים", value: customers.filter((c) => c.orderCount > 1).length },
          { label: "ממוצע הזמנות ללקוח", value: customers.length
              ? (customers.reduce((s,c)=>s+c.orderCount,0)/customers.length).toFixed(1)
              : 0 },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl font-black text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Search + table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text" placeholder="חיפוש לפי שם / טלפון / אימייל..."
              value={q} onChange={(e) => setQ(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32 text-gray-400">
            <RefreshCw size={20} className="animate-spin ml-2" /> טוען...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-right">לקוח</th>
                  <th className="px-4 py-3 text-right">טלפון</th>
                  <th className="px-4 py-3 text-right">הזמנות</th>
                  <th className="px-4 py-3 text-right">סה"כ הוצאה</th>
                  <th className="px-4 py-3 text-right">הזמנה אחרונה</th>
                  <th className="px-4 py-3 text-right">פרופיל</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">אין לקוחות</td></tr>
                ) : filtered.map((c) => (
                  <tr key={c.phone} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600" dir="ltr">{c.phone}</td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-gray-900">{c.orderCount}</span>
                      {c.orderCount > 2 && (
                        <span className="mr-2 text-xs bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold">חוזר</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {c.totalSpent > 0 ? `₪${c.totalSpent.toLocaleString("he-IL")}` : "??"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(c.lastOrder).toLocaleDateString("he-IL")}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders?q=${encodeURIComponent(c.phone)}`}
                        className="text-amber-600 hover:underline text-xs flex items-center gap-0.5"
                      >
                        הזמנות <ChevronLeft size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
