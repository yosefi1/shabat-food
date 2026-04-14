"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff, Search, RefreshCw } from "lucide-react";

interface AdminMenuItem {
  id: string; name: string; description: string; price: number;
  image: string; category: string; badge?: string; available: boolean;
}
interface Category { id: string; name: string; emoji: string; }

export default function MenuPage() {
  const [items,      setItems]      = useState<AdminMenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [catFilter,  setCatFilter]  = useState("all");
  const [q,          setQ]          = useState("");
  const [toggling,   setToggling]   = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res  = await fetch("/api/admin/menu");
    const data = await res.json();
    setItems(data.items ?? []);
    setCategories([{ id:"all", name:"הכל", emoji:"🍽️" }, ...(data.categories ?? [])]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function toggleAvailable(item: AdminMenuItem) {
    setToggling(item.id);
    await fetch(`/api/admin/menu/${item.id}`, {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ ...item, available: !item.available }),
    });
    await load();
    setToggling(null);
  }

  async function deleteItem(id: string, name: string) {
    if (!confirm(`למחוק את "${name}"?`)) return;
    await fetch(`/api/admin/menu/${id}`, { method: "DELETE" });
    await load();
  }

  const filtered = items.filter((i) => {
    const matchCat = catFilter === "all" || i.category === catFilter;
    const matchQ   = !q || i.name.includes(q) || i.description.includes(q);
    return matchCat && matchQ;
  });

  return (
    <div className="space-y-4">

      {/* Toolbar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="חיפוש פריט..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <Link
            href="/admin/menu/new"
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors"
          >
            <Plus size={16} /> פריט חדש
          </Link>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCatFilter(c.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                catFilter === c.id
                  ? "bg-amber-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {c.emoji} {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Info note */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-700">
        <strong>הערה:</strong> שינויים בתפריט נשמרים ב-<code>data/menu.json</code> (ניהול).
        האתר הציבורי ממשיך להשתמש בקובץ הסטטי עד חיבור מסד נתונים.
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-32 text-gray-400">
          <RefreshCw size={20} className="animate-spin ml-2" /> טוען...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-opacity ${
                item.available ? "border-gray-100" : "border-gray-200 opacity-60"
              }`}
            >
              {/* Image */}
              <div className="relative h-36 bg-gray-100">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="300px" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-4xl text-gray-300">🍽️</div>
                )}
                {!item.available && (
                  <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">לא זמין</span>
                  </div>
                )}
                {item.badge && (
                  <span className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.badge === "bestseller" ? "🔥" : item.badge === "popular" ? "⭐" : "✨"}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="font-bold text-gray-900 text-sm truncate">{item.name}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{item.description}</p>
                <p className="font-black text-amber-600 mt-1">
                  {item.price > 0 ? `₪${item.price}` : "??"}
                </p>
              </div>

              {/* Actions */}
              <div className="px-3 pb-3 flex items-center gap-2">
                <button
                  onClick={() => toggleAvailable(item)}
                  disabled={toggling === item.id}
                  title={item.available ? "הסתר" : "הצג"}
                  className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
                    item.available
                      ? "bg-green-50 text-green-700 hover:bg-green-100"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {item.available ? <Eye size={12} /> : <EyeOff size={12} />}
                  {item.available ? "זמין" : "מוסתר"}
                </button>
                <div className="flex gap-1 mr-auto">
                  <Link
                    href={`/admin/menu/${item.id}`}
                    className="p-1.5 rounded-lg bg-gray-100 hover:bg-amber-100 hover:text-amber-700 transition-colors"
                    title="עריכה"
                  >
                    <Pencil size={14} />
                  </Link>
                  <button
                    onClick={() => deleteItem(item.id, item.name)}
                    className="p-1.5 rounded-lg bg-gray-100 hover:bg-red-100 hover:text-red-600 transition-colors"
                    title="מחיקה"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <p className="text-center text-gray-400 py-12">לא נמצאו פריטים</p>
      )}
    </div>
  );
}
