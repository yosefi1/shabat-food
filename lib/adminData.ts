/**
 * lib/adminData.ts
 *
 * Unified async data-access layer for the Admin Dashboard.
 * All data is stored in Supabase (PostgreSQL).
 *
 * Tables:
 *   orders          — customer orders
 *   order_statuses  — order status updates
 *   menu_items      — menu (admin-managed)
 *   settings        — admin settings (single JSON row)
 */

import { supabase } from "@/lib/supabase";
import { menuItems as seedItems, categories as seedCategories } from "@/data/menuData";
import type { Category } from "@/types";

/* ─────────────────────────────────────────────────────────────────────────────
 * Types
 * ─────────────────────────────────────────────────────────────────────────── */
export type OrderStatus = "new" | "processing" | "ready" | "delivered" | "cancelled";

export interface AdminMenuItem {
  id:          string;
  name:        string;
  description: string;
  price:       number;
  image:       string;
  category:    string;
  badge?:      "bestseller" | "popular" | "new";
  available:   boolean;
}

export interface StoredOrder {
  orderId:   string;
  createdAt: string;
  customer:  {
    name:         string;
    phone:        string;
    email:        string;
    address:      string;
    city:         string;
    deliveryTime: string;
    notes:        string;
  };
  items:      { id: string; name: string; price: number; quantity: number }[];
  totalPrice: number;
  ip?:        string;
}

export interface AdminOrder extends StoredOrder {
  status: OrderStatus;
}

export interface AdminSettings {
  businessHours: { day: string; isOpen: boolean; open: string; close: string }[];
  orderDeadline: { dayOfWeek: number; hour: number; label: string };
  deliveryZones: { id: string; name: string; fee: number; minOrder: number; freeFrom: number }[];
  banner:         { enabled: boolean; text: string; type: string };
  holidayBlocks:  { id: string; name: string; from: string; to: string }[];
  notifications:  {
    whatsapp: { enabled: boolean; phone: string };
    email:    { enabled: boolean };
    sms:      { enabled: boolean };
  };
  coupons: {
    id: string; code: string; discount: number; type: "percent"|"fixed";
    minOrder: number; expiresAt: string; active: boolean;
  }[];
}

const DEFAULT_SETTINGS: AdminSettings = {
  businessHours: [],
  orderDeadline: { dayOfWeek: 4, hour: 20, label: "חמישי 20:00" },
  deliveryZones: [],
  banner:        { enabled: false, text: "", type: "info" },
  holidayBlocks: [],
  notifications: {
    whatsapp: { enabled: false, phone: "" },
    email:    { enabled: true },
    sms:      { enabled: false },
  },
  coupons: [],
};

/* ─────────────────────────────────────────────────────────────────────────────
 * ORDERS
 * ─────────────────────────────────────────────────────────────────────────── */
export async function getOrders(): Promise<AdminOrder[]> {
  const [{ data: orders, error: ordersErr }, { data: statuses, error: statusErr }] =
    await Promise.all([
      supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("order_statuses")
        .select("order_id, status"),
    ]);

  if (ordersErr) console.error("[adminData] getOrders:", ordersErr.message);
  if (statusErr) console.error("[adminData] getStatuses:", statusErr.message);

  const statusMap: Record<string, OrderStatus> = {};
  for (const s of statuses ?? []) statusMap[s.order_id] = s.status as OrderStatus;

  return (orders ?? []).map((row) => ({
    orderId:   row.order_id,
    createdAt: row.created_at,
    customer: {
      name:         row.customer_name,
      phone:        row.customer_phone,
      email:        row.customer_email ?? "",
      address:      row.customer_address ?? "",
      city:         "",
      deliveryTime: "",
      notes:        row.notes ?? "",
    },
    items:      row.items ?? [],
    totalPrice: Number(row.total_price),
    ip:         row.ip,
    status:     statusMap[row.order_id] ?? "new",
  }));
}

export async function getOrderById(orderId: string): Promise<AdminOrder | null> {
  const orders = await getOrders();
  return orders.find((o) => o.orderId === orderId) ?? null;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  const { error } = await supabase
    .from("order_statuses")
    .upsert({ order_id: orderId, status, updated_at: new Date().toISOString() });

  if (error) console.error("[adminData] updateOrderStatus:", error.message);
}

/* ─────────────────────────────────────────────────────────────────────────────
 * MENU
 * On first load, if the table is empty, seeds from menuData.ts.
 * ─────────────────────────────────────────────────────────────────────────── */
export async function getAdminMenuItems(): Promise<AdminMenuItem[]> {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) console.error("[adminData] getAdminMenuItems:", error.message);

  // Auto-seed on first access
  if (!error && (!data || data.length === 0)) {
    const seed: AdminMenuItem[] = seedItems.map((item) => ({ ...item, available: true }));
    await supabase.from("menu_items").insert(
      seed.map((item, i) => ({
        id:          item.id,
        name:        item.name,
        description: item.description,
        price:       item.price,
        image:       item.image,
        category:    item.category,
        badge:       item.badge ?? null,
        available:   true,
        sort_order:  i,
      }))
    );
    return seed;
  }

  return (data ?? []).map((row) => ({
    id:          row.id,
    name:        row.name,
    description: row.description ?? "",
    price:       Number(row.price),
    image:       row.image ?? "",
    category:    row.category,
    badge:       row.badge ?? undefined,
    available:   row.available,
  }));
}

export function getAdminCategories(): Category[] {
  return seedCategories;
}

export async function saveAdminMenuItem(item: AdminMenuItem): Promise<void> {
  const { error } = await supabase.from("menu_items").upsert({
    id:          item.id,
    name:        item.name,
    description: item.description,
    price:       item.price,
    image:       item.image,
    category:    item.category,
    badge:       item.badge ?? null,
    available:   item.available,
  });

  if (error) console.error("[adminData] saveAdminMenuItem:", error.message);
}

export async function deleteAdminMenuItem(id: string): Promise<void> {
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) console.error("[adminData] deleteAdminMenuItem:", error.message);
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SETTINGS
 * ─────────────────────────────────────────────────────────────────────────── */
export async function getSettings(): Promise<AdminSettings> {
  const { data, error } = await supabase
    .from("settings")
    .select("data")
    .eq("id", 1)
    .single();

  if (error || !data) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...(data.data as Partial<AdminSettings>) };
}

export async function saveSettings(settings: AdminSettings): Promise<void> {
  const { error } = await supabase
    .from("settings")
    .upsert({ id: 1, data: settings });

  if (error) console.error("[adminData] saveSettings:", error.message);
}

/* ─────────────────────────────────────────────────────────────────────────────
 * DASHBOARD STATS
 * ─────────────────────────────────────────────────────────────────────────── */
export async function getDashboardStats() {
  const orders = await getOrders();
  const now      = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  const todayOrders  = orders.filter((o) => o.createdAt.startsWith(todayStr));
  const activeOrders = orders.filter((o) => ["new", "processing", "ready"].includes(o.status));

  const todayRevenue = todayOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + o.totalPrice, 0);

  const avgOrder = orders.length
    ? orders.reduce((s, o) => s + o.totalPrice, 0) / orders.length
    : 0;

  const itemCounts: Record<string, { name: string; count: number; revenue: number }> = {};
  for (const order of orders.filter((o) => o.status !== "cancelled")) {
    for (const item of order.items) {
      if (!itemCounts[item.id]) itemCounts[item.id] = { name: item.name, count: 0, revenue: 0 };
      itemCounts[item.id].count   += item.quantity;
      itemCounts[item.id].revenue += item.price * item.quantity;
    }
  }
  const topItems = Object.values(itemCounts).sort((a, b) => b.count - a.count).slice(0, 5);

  const last7 = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    const ds = d.toISOString().slice(0, 10);
    return {
      date:  ds,
      label: d.toLocaleDateString("he-IL", { weekday: "short" }),
      count: orders.filter((o) => o.createdAt.startsWith(ds)).length,
    };
  });

  return {
    totalOrders:  orders.length,
    todayOrders:  todayOrders.length,
    todayRevenue,
    activeOrders: activeOrders.length,
    avgOrder:     Math.round(avgOrder),
    topItems,
    last7,
    recentOrders: orders.slice(0, 8),
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
 * CUSTOMERS (derived from orders)
 * ─────────────────────────────────────────────────────────────────────────── */
export async function getCustomers() {
  const orders = await getOrders();
  const map: Record<string, {
    phone: string; name: string; email: string;
    orderCount: number; totalSpent: number; lastOrder: string;
  }> = {};

  for (const order of orders) {
    const key = order.customer.phone;
    if (!map[key]) {
      map[key] = {
        phone:      order.customer.phone,
        name:       order.customer.name,
        email:      order.customer.email,
        orderCount: 0,
        totalSpent: 0,
        lastOrder:  order.createdAt,
      };
    }
    map[key].orderCount += 1;
    map[key].totalSpent += order.totalPrice;
    if (order.createdAt > map[key].lastOrder) map[key].lastOrder = order.createdAt;
  }

  return Object.values(map).sort((a, b) => b.orderCount - a.orderCount);
}
