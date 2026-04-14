"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, RefreshCw } from "lucide-react";
import {
  OrderModal, SortTh,
  STATUS_LABEL, STATUS_STYLE,
  type AdminOrder as Order, type SortDir,
} from "@/components/admin/shared";

type SortKey = "orderId"|"customer.name"|"createdAt"|"totalPrice"|"status";
const TABS = [
  { key:"all",        label:"הכל"    },
  { key:"new",        label:"חדש"    },
  { key:"processing", label:"בטיפול" },
  { key:"ready",      label:"מוכן"   },
  { key:"delivered",  label:"נמסר"   },
  { key:"cancelled",  label:"בוטל"   },
];

/* ── Helpers ───────────────────────────────────────────────────────────────── */
function getVal(order: Order, key: SortKey): string | number {
  if (key === "customer.name") return order.customer.name.toLowerCase();
  if (key === "totalPrice")    return order.totalPrice;
  if (key === "createdAt")     return order.createdAt;
  if (key === "status")        return order.status;
  return order.orderId;
}

function sortOrders(orders: Order[], key: SortKey, dir: SortDir): Order[] {
  return [...orders].sort((a, b) => {
    const av = getVal(a, key);
    const bv = getVal(b, key);
    const cmp = av < bv ? -1 : av > bv ? 1 : 0;
    return dir === "asc" ? cmp : -cmp;
  });
}

/* ─────────────────────────────────────────────────────────────────────────────
 * MAIN PAGE
 * ─────────────────────────────────────────────────────────────────────────── */
export default function OrdersPage() {
  const [orders,   setOrders]   = useState<Order[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState("all");
  const [q,        setQ]        = useState("");
  const [date,     setDate]     = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  /* sort */
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  /* modal */
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  /* ── Load ───────────────────────────────────────────────────────────────── */
  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (tab !== "all") params.set("status", tab);
    if (q)            params.set("q", q);
    if (date)         params.set("date", date);
    const res = await fetch(`/api/admin/orders?${params}`);
    setOrders(await res.json());
    setLoading(false);
  }, [tab, q, date]);

  useEffect(() => { load(); }, [load]);

  /* If modal is open, refresh its data too after status update */
  const refreshSelected = (updated: Order) => {
    setSelectedOrder(updated);
    setOrders((prev) => prev.map((o) => o.orderId === updated.orderId ? updated : o));
  };

  /* ── Sort toggle ────────────────────────────────────────────────────────── */
  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  }

  /* ── Status update ──────────────────────────────────────────────────────── */
  async function updateStatus(orderId: string, status: string) {
    setUpdating(orderId);
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = { ...(orders.find((o) => o.orderId === orderId)!), status: status as OrderStatus };
      refreshSelected(updated);
    }
    await load();
    setUpdating(null);
  }

  /* ── Sorted display ─────────────────────────────────────────────────────── */
  const displayed = sortOrders(orders, sortKey, sortDir);

  /* ── Render ─────────────────────────────────────────────────────────────── */
  return (
    <>
      <div className="space-y-4">

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-48">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text" placeholder="חיפוש לפי שם / טלפון / מ. הזמנה..."
                value={q} onChange={(e) => setQ(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <input
              type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              onClick={load}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
            >
              <RefreshCw size={14} /> רענן
            </button>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            {TABS.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  tab === t.key ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-32 text-gray-400">
              <RefreshCw size={20} className="animate-spin ml-2" /> טוען...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500 font-semibold border-b border-gray-100">
                  <tr>
                    <SortTh label="מ. הזמנה"  col="orderId"       current={sortKey} dir={sortDir} onSort={handleSort} />
                    <SortTh label="שם לקוח"   col="customer.name" current={sortKey} dir={sortDir} onSort={handleSort} />
                    <th className="px-4 py-3 text-right">מוצרים</th>
                    <th className="px-4 py-3 text-right">משלוח</th>
                    <SortTh label="סכום"       col="totalPrice"    current={sortKey} dir={sortDir} onSort={handleSort} />
                    <SortTh label="תאריך"      col="createdAt"     current={sortKey} dir={sortDir} onSort={handleSort} />
                    <SortTh label="סטטוס"      col="status"        current={sortKey} dir={sortDir} onSort={handleSort} />
                    <th className="px-4 py-3 text-right">שנה סטטוס</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {displayed.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-12 text-center text-gray-400">אין הזמנות</td>
                    </tr>
                  ) : displayed.map((o) => (
                    <tr
                      key={o.orderId}
                      className="hover:bg-amber-50/40 transition-colors cursor-pointer"
                      onClick={() => setSelectedOrder(o)}
                    >
                      <td className="px-4 py-3">
                        <p className="font-mono text-xs text-gray-500">{o.orderId.slice(0, 14)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900">{o.customer.name}</p>
                        <p className="text-xs text-gray-400">{o.customer.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs max-w-[160px]">
                        <span className="line-clamp-2">
                          {o.items.map((i) => `${i.name} ×${i.quantity}`).join("، ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {o.customer.city}<br />{o.customer.deliveryTime}
                      </td>
                      <td className="px-4 py-3 font-bold text-gray-900">
                        {o.totalPrice > 0 ? `₪${o.totalPrice}` : "??"}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {new Date(o.createdAt).toLocaleDateString("he-IL")}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLE[o.status] ?? "bg-gray-100 text-gray-600"}`}>
                          {STATUS_LABEL[o.status] ?? o.status}
                        </span>
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={o.status}
                          disabled={updating === o.orderId}
                          onChange={(e) => updateStatus(o.orderId, e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-400 bg-white"
                        >
                          {["new","processing","ready","delivered","cancelled"].map((st) => (
                            <option key={st} value={st}>{STATUS_LABEL[st]}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedOrder(o); }}
                          className="text-amber-600 hover:underline text-xs"
                        >
                          פרטים
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Order Detail Modal (shared component) ────────────────────────── */}
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={(orderId, status) => updateStatus(orderId, status)}
          updating={updating}
        />
      )}
    </>
  );
}
