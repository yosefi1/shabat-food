"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, ShoppingBag, UtensilsCrossed, Users, Tag,
  Truck, Settings, FileText, Users2, Bell, ChevronRight,
  Menu as MenuIcon, X, LogOut,
} from "lucide-react";

const NAV = [
  { href: "/admin",           icon: LayoutDashboard,  label: "לוח בקרה",   group: "main"    },
  { href: "/admin/orders",    icon: ShoppingBag,       label: "הזמנות",     group: "main", badge: true },
  { href: "/admin/menu",      icon: UtensilsCrossed,   label: "תפריט",      group: "main"    },
  { href: "/admin/customers", icon: Users,             label: "לקוחות",     group: "main"    },
  { href: "/admin/coupons",   icon: Tag,               label: "קופונים",    group: "main"    },
  { href: "/admin/settings",  icon: Settings,          label: "הגדרות",     group: "config"  },
  { href: "/admin/employees", icon: Users2,            label: "עובדים",     group: "config"  },
  { href: "/admin/notifications", icon: Bell,          label: "התראות",     group: "config"  },
  { href: "/admin/reports",   icon: FileText,          label: "דוחות",      group: "config"  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (pathname === "/admin/login") return <>{children}</>;

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const Sidebar = (
    <aside className="flex flex-col h-full bg-brown-900 text-white w-64 flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-brown-700 flex items-center gap-3">
        <span className="text-2xl">🕯️</span>
        <div>
          <p className="font-black text-base">שבת פוד</p>
          <p className="text-brown-400 text-xs">ממשק ניהול</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        <p className="text-brown-500 text-[10px] font-bold uppercase tracking-widest px-3 mb-2">ניהול</p>
        {NAV.filter((n) => n.group === "main").map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              isActive(href)
                ? "bg-amber-500 text-white"
                : "text-brown-300 hover:bg-brown-800 hover:text-white"
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}

        <p className="text-brown-500 text-[10px] font-bold uppercase tracking-widest px-3 mt-5 mb-2">הגדרות</p>
        {NAV.filter((n) => n.group === "config").map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              isActive(href)
                ? "bg-amber-500 text-white"
                : "text-brown-300 hover:bg-brown-800 hover:text-white"
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-brown-700 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-brown-400 hover:text-white hover:bg-brown-800 transition-colors"
        >
          <ChevronRight size={18} className="rotate-180" />
          צפה באתר
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-brown-400 hover:text-red-400 hover:bg-brown-800 transition-colors"
        >
          <LogOut size={18} />
          יציאה
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">{Sidebar}</div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="w-64 flex">{Sidebar}</div>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-screen bg-gray-50 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-40">
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            aria-label="פתח תפריט"
          >
            {sidebarOpen ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
          <h1 className="font-black text-brown-900 text-lg flex-1">
            {NAV.find((n) => isActive(n.href))?.label ?? "ממשק ניהול"}
          </h1>
          <button
            onClick={handleLogout}
            className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            <LogOut size={15} />
            יציאה
          </button>
        </header>

        {/* Page content */}
        <main id="admin-main" className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
