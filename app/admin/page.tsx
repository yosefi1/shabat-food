"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { ShoppingBag, TrendingUp, Clock, BarChart3, ChevronLeft, RefreshCw, CalendarDays, X } from "lucide-react";
import {
  OrderModal, SortTh,
  STATUS_LABEL, STATUS_STYLE,
  type AdminOrder, type SortDir,
} from "@/components/admin/shared";

/* ── Types ─────────────────────────────────────────────────────────────────── */
type RecentSortKey = "orderId" | "customer.name" | "createdAt" | "totalPrice" | "status";

interface Stats {
  totalOrders:  number;
  todayOrders:  number;
  todayRevenue: number;
  activeOrders: number;
  avgOrder:     number;
  topItems:     { name: string; count: number; revenue: number }[];
  last7:        { date: string; label: string; count: number }[];
  recentOrders: AdminOrder[];
}

/* ── Sort helper ───────────────────────────────────────────────────────────── */
function sortRows(rows: AdminOrder[], key: RecentSortKey, dir: SortDir): AdminOrder[] {
  return [...rows].sort((a, b) => {
    let av: string | number = "";
    let bv: string | number = "";
    if (key === "customer.name") { av = a.customer.name.toLowerCase(); bv = b.customer.name.toLowerCase(); }
    else if (key === "totalPrice") { av = a.totalPrice; bv = b.totalPrice; }
    else if (key === "createdAt")  { av = a.createdAt;  bv = b.createdAt;  }
    else if (key === "status")     { av = a.status;     bv = b.status;     }
    else                           { av = a.orderId;    bv = b.orderId;    }
    const cmp = av < bv ? -1 : av > bv ? 1 : 0;
    return dir === "asc" ? cmp : -cmp;
  });
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Dashboard
 * ─────────────────────────────────────────────────────────────────────────── */
export default function AdminDashboard() {
  const [stats,   setStats]   = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  /* sort state for recent-orders table */
  const [sortKey, setSortKey] = useState<RecentSortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  /* day filter */
  const [dayFilter,    setDayFilter]    = useState("");
  const dateInputRef = useRef<HTMLInputElement>(null);

  /* modal state */
  const [selectedOrder,    setSelectedOrder]    = useState<AdminOrder | null>(null);
  const [loadingOrder,     setLoadingOrder]     = useState(false);
  const [updatingOrderId,  setUpdatingOrderId]  = useState<string | null>(null);

  /* ── Load dashboard stats ─────────────────────────────────────────────── */
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/admin/dashboard");
      const data = await res.json();
      setStats(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  /* ── Open order detail modal ─────────────────────────────────────────── */
  async function openOrder(orderId: string) {
    setLoadingOrder(true);
    const res   = await fetch(`/api/admin/orders/${orderId}`);
    const order = await res.json();
    setSelectedOrder(order);
    setLoadingOrder(false);
  }

  /* ── Status update from modal ────────────────────────────────────────── */
  async function handleStatusChange(orderId: string, status: string) {
    setUpdatingOrderId(orderId);
    await fetch(`/api/admin/orders/${orderId}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ status }),
    });
    // Update modal & table in place
    setSelectedOrder((prev) => prev ? { ...prev, status: status as AdminOrder["status"] } : prev);
    setStats((prev) =>
      prev
        ? {
            ...prev,
            recentOrders: prev.recentOrders.map((o) =>
              o.orderId === orderId ? { ...o, status: status as AdminOrder["status"] } : o
            ),
          }
        : prev
    );
    setUpdatingOrderId(null);
  }

  /* ── Sort toggle ─────────────────────────────────────────────────────── */
  function handleSort(key: RecentSortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  }

  /* ── Render ──────────────────────────────────────────────────────────── */
  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400">
      <RefreshCw size={24} className="animate-spin ml-2" /> טוען נתונים...
    </div>
  );
  if (!stats) return <p className="text-red-500">שגיאה בטעינת נתונים</p>;

  const maxBar = Math.max(...stats.last7.map((d) => d.count), 1);

  /* Apply day filter then sort */
  const dayFiltered = dayFilter
    ? stats.recentOrders.filter((o) => o.createdAt.startsWith(dayFilter))
    : stats.recentOrders;
  const sorted = sortRows(dayFiltered, sortKey, sortDir);

  return (
    <>
      <div className="space-y-6">

        {/* ── Stat cards ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label:"הזמנות היום",    value: stats.todayOrders,  icon: ShoppingBag, color:"text-blue-600",   bg:"bg-blue-50"   },
            { label:"הכנסה היום",     value: stats.todayRevenue > 0 ? `₪${stats.todayRevenue.toLocaleString("he-IL")}` : "??",
                                                                 icon: TrendingUp,  color:"text-green-600",  bg:"bg-green-50"  },
            { label:"בטיפול / ממתין", value: stats.activeOrders, icon: Clock,       color:"text-amber-600",  bg:"bg-amber-50"  },
            { label:'סה"כ הזמנות',   value: stats.totalOrders,  icon: BarChart3,   color:"text-purple-600", bg:"bg-purple-50" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className={`inline-flex w-10 h-10 rounded-xl ${bg} items-center justify-center mb-3`}>
                <Icon size={20} className={color} />
              </div>
              <p className="text-2xl font-black text-gray-900">{value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Bar chart ─────────────────────────────────────────────── */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-5">הזמנות — 7 ימים אחרונים</h2>
            <div className="flex items-end gap-3 h-32">
              {stats.last7.map((d) => (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-400 font-medium">{d.count || ""}</span>
                  <div
                    className="w-full bg-amber-400 rounded-t-md transition-all"
                    style={{ height:`${(d.count / maxBar) * 100}%`, minHeight: d.count ? 4 : 2 }}
                  />
                  <span className="text-xs text-gray-500">{d.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Top items ─────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4">מוצרים מובילים</h2>
            {stats.topItems.length === 0 ? (
              <p className="text-gray-400 text-sm">אין נתונים עדיין</p>
            ) : (
              <ol className="space-y-3">
                {stats.topItems.map((item, i) => (
                  <li key={item.name} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.count} יחידות</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        {/* ── Recent orders (sortable + clickable + day filter) ─────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
            <h2 className="font-bold text-gray-900 flex-1">הזמנות אחרונות</h2>

            {/* Day filter badge */}
            {dayFilter && (
              <span className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                {new Date(dayFilter).toLocaleDateString("he-IL", { day:"numeric", month:"short" })}
                <button
                  onClick={() => setDayFilter("")}
                  className="hover:text-amber-900"
                  aria-label="נקה סינון תאריך"
                >
                  <X size={11} />
                </button>
              </span>
            )}

            {/* Calendar picker button */}
            <div className="relative">
              <button
                onClick={() => dateInputRef.current?.showPicker?.() ?? dateInputRef.current?.click()}
                title="סנן לפי יום"
                className={`p-1.5 rounded-lg transition-colors ${
                  dayFilter
                    ? "bg-amber-100 text-amber-600"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-500"
                }`}
              >
                <CalendarDays size={16} />
              </button>
              {/* Hidden native date input */}
              <input
                ref={dateInputRef}
                type="date"
                value={dayFilter}
                onChange={(e) => setDayFilter(e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                aria-label="בחר תאריך לסינון"
              />
            </div>

            <Link
              href="/admin/orders"
              className="text-sm text-amber-600 hover:underline flex items-center gap-1 flex-shrink-0"
            >
              כל ההזמנות <ChevronLeft size={14} />
            </Link>
          </div>

          {loadingOrder && (
            <div className="flex items-center justify-center h-12 text-gray-400 text-sm border-b border-gray-50">
              <RefreshCw size={14} className="animate-spin ml-1" /> טוען הזמנה...
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 font-semibold border-b border-gray-100">
                <tr>
                  <SortTh label="מ. הזמנה"  col="orderId"       current={sortKey} dir={sortDir} onSort={handleSort} />
                  <SortTh label="שם לקוח"   col="customer.name" current={sortKey} dir={sortDir} onSort={handleSort} />
                  <SortTh label="תאריך"      col="createdAt"     current={sortKey} dir={sortDir} onSort={handleSort} />
                  <SortTh label="סכום"       col="totalPrice"    current={sortKey} dir={sortDir} onSort={handleSort} />
                  <SortTh label="סטטוס"      col="status"        current={sortKey} dir={sortDir} onSort={handleSort} />
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sorted.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                      {dayFilter ? "אין הזמנות בתאריך שנבחר" : "אין הזמנות עדיין"}
                    </td>
                  </tr>
                ) : sorted.map((o) => (
                  <tr
                    key={o.orderId}
                    onClick={() => openOrder(o.orderId)}
                    className="hover:bg-amber-50/40 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                      {o.orderId.slice(0, 14)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">{o.customer.name}</p>
                      <p className="text-gray-400 text-xs">{o.customer.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(o.createdAt).toLocaleDateString("he-IL")}
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900">
                      {o.totalPrice > 0 ? `₪${o.totalPrice}` : "??"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLE[o.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {STATUS_LABEL[o.status] ?? o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-amber-600 text-xs">פרטים</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Order modal ─────────────────────────────────────────────────── */}
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
          updating={updatingOrderId}
        />
      )}
    </>
  );
}
