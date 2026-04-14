/**
 * lib/adminData.ts
 *
 * Unified data-access layer for the Admin Dashboard.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  DATA SOURCES                                                        │
 * │  Orders:   ORDERS_FILE_PATH  (.jsonl — one JSON per line)           │
 * │  Statuses: data/orderStatuses.json  (orderId → status map)          │
 * │  Menu:     data/menu.json (admin overrides) or data/menuData.ts     │
 * │  Settings: data/adminSettings.json                                  │
 * ├─────────────────────────────────────────────────────────────────────┤
 * │  Vercel / serverless note: File writes don't persist across         │
 * │  invocations. Replace all read/write with a database call when      │
 * │  connecting to Supabase / Neon / MongoDB.                           │
 * └─────────────────────────────────────────────────────────────────────┘
 */

import fs   from "fs";
import path from "path";
import { menuItems as seedItems, categories as seedCategories } from "@/data/menuData";
import type { Category } from "@/types";

/* ─────────────────────────────────────────────────────────────────────────────
 * Path constants
 * ─────────────────────────────────────────────────────────────────────────── */
const DATA_DIR      = path.join(process.cwd(), "data");
const MENU_FILE     = path.join(DATA_DIR, "menu.json");
const SETTINGS_FILE = path.join(DATA_DIR, "adminSettings.json");
const STATUSES_FILE = path.join(DATA_DIR, "orderStatuses.json");

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

/* ─────────────────────────────────────────────────────────────────────────────
 * File helpers
 * ─────────────────────────────────────────────────────────────────────────── */
function readJson<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

function writeJson(filePath: string, data: unknown): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

/* ─────────────────────────────────────────────────────────────────────────────
 * ORDERS
 * ─────────────────────────────────────────────────────────────────────────── */
export function getOrders(): AdminOrder[] {
  const ordersFile = process.env.ORDERS_FILE_PATH;
  const statuses   = readJson<Record<string, OrderStatus>>(STATUSES_FILE, {});
  const orders: AdminOrder[] = [];

  if (ordersFile && fs.existsSync(ordersFile)) {
    const lines = fs.readFileSync(ordersFile, "utf-8")
      .split("\n")
      .filter(Boolean);

    for (const line of lines) {
      try {
        const order = JSON.parse(line) as StoredOrder;
        orders.push({ ...order, status: statuses[order.orderId] ?? "new" });
      } catch { /* skip malformed lines */ }
    }
  }

  // Newest first
  return orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getOrderById(orderId: string): AdminOrder | null {
  return getOrders().find((o) => o.orderId === orderId) ?? null;
}

export function updateOrderStatus(orderId: string, status: OrderStatus): void {
  const statuses = readJson<Record<string, OrderStatus>>(STATUSES_FILE, {});
  statuses[orderId] = status;
  writeJson(STATUSES_FILE, statuses);
}

/* ─────────────────────────────────────────────────────────────────────────────
 * MENU
 * Menu items are stored in data/menu.json (admin runtime).
 * Falls back to menuData.ts seed if the file doesn't exist.
 * NOTE: The public-facing Menu.tsx still uses the static seed.
 *       Connect both to a DB to sync automatically.
 * ─────────────────────────────────────────────────────────────────────────── */
export function getAdminMenuItems(): AdminMenuItem[] {
  if (fs.existsSync(MENU_FILE)) {
    return readJson<AdminMenuItem[]>(MENU_FILE, []);
  }
  // Seed from menuData.ts on first access
  const seeded = seedItems.map((item) => ({ ...item, available: true }));
  writeJson(MENU_FILE, seeded);
  return seeded;
}

export function getAdminCategories(): Category[] {
  return seedCategories;
}

export function saveAdminMenuItem(item: AdminMenuItem): void {
  const items = getAdminMenuItems();
  const idx   = items.findIndex((i) => i.id === item.id);
  if (idx >= 0) items[idx] = item;
  else           items.push(item);
  writeJson(MENU_FILE, items);
}

export function deleteAdminMenuItem(id: string): void {
  const items = getAdminMenuItems().filter((i) => i.id !== id);
  writeJson(MENU_FILE, items);
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SETTINGS
 * ─────────────────────────────────────────────────────────────────────────── */
export function getSettings(): AdminSettings {
  return readJson<AdminSettings>(SETTINGS_FILE, {
    businessHours: [], orderDeadline: { dayOfWeek: 4, hour: 20, label: "חמישי 20:00" },
    deliveryZones: [], banner: { enabled: false, text: "", type: "info" },
    holidayBlocks: [], notifications: {
      whatsapp: { enabled: false, phone: "" }, email: { enabled: true }, sms: { enabled: false },
    },
    coupons: [],
  });
}

export function saveSettings(settings: AdminSettings): void {
  writeJson(SETTINGS_FILE, settings);
}

/* ─────────────────────────────────────────────────────────────────────────────
 * DASHBOARD STATS
 * ─────────────────────────────────────────────────────────────────────────── */
export function getDashboardStats() {
  const orders = getOrders();
  const now    = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  const todayOrders = orders.filter((o) => o.createdAt.startsWith(todayStr));
  const activeOrders = orders.filter((o) =>
    ["new", "processing", "ready"].includes(o.status)
  );

  const todayRevenue = todayOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + o.totalPrice, 0);

  const avgOrder = orders.length
    ? orders.reduce((s, o) => s + o.totalPrice, 0) / orders.length
    : 0;

  // Top items by quantity ordered
  const itemCounts: Record<string, { name: string; count: number; revenue: number }> = {};
  for (const order of orders.filter((o) => o.status !== "cancelled")) {
    for (const item of order.items) {
      if (!itemCounts[item.id]) itemCounts[item.id] = { name: item.name, count: 0, revenue: 0 };
      itemCounts[item.id].count   += item.quantity;
      itemCounts[item.id].revenue += item.price * item.quantity;
    }
  }
  const topItems = Object.values(itemCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Last 7 days order counts
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
    totalOrders:   orders.length,
    todayOrders:   todayOrders.length,
    todayRevenue,
    activeOrders:  activeOrders.length,
    avgOrder:      Math.round(avgOrder),
    topItems,
    last7,
    recentOrders:  orders.slice(0, 8),
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
 * CUSTOMERS (derived from orders — no separate DB needed)
 * ─────────────────────────────────────────────────────────────────────────── */
export function getCustomers() {
  const orders = getOrders();
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
