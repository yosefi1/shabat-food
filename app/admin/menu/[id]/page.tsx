"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Save } from "lucide-react";

interface AdminMenuItem {
  id: string; name: string; description: string; price: number;
  image: string; category: string; badge?: string; available: boolean;
}
interface Category { id: string; name: string; emoji: string; }

const isNew = (id: string) => id === "new";

export default function MenuItemFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }    = use(params);
  const router    = useRouter();
  const creating  = isNew(id);

  const [form,       setForm]       = useState<Partial<AdminMenuItem>>({ available: true, price: 0 });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading,    setLoading]    = useState(!creating);
  const [saving,     setSaving]     = useState(false);
  const [error,      setError]      = useState("");

  useEffect(() => {
    // Load categories
    fetch("/api/admin/menu")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories ?? []));

    // Load item data if editing
    if (!creating) {
      fetch(`/api/admin/menu/${id}`)
        .then((r) => r.ok ? r.json() : null)
        .then((data) => {
          if (data) setForm(data);
          setLoading(false);
        });
    }
  }, [id, creating]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name?.trim() || !form.category) {
      setError("שם וקטגוריה הם שדות חובה");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const url    = creating ? "/api/admin/menu" : `/api/admin/menu/${id}`;
      const method = creating ? "POST" : "PUT";
      const res    = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/admin/menu");
      } else {
        const data = await res.json();
        setError(data.error ?? "שגיאה בשמירה");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex items-center justify-center h-48 text-gray-400">טוען...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-900">
          <ArrowRight size={20} />
        </button>
        <h1 className="text-xl font-black text-gray-900">
          {creating ? "פריט חדש" : "עריכת פריט"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Preview */}
        {form.image && (
          <div className="relative h-48 rounded-2xl overflow-hidden bg-gray-100">
            <Image src={form.image} alt="תצוגה מקדימה" fill className="object-cover" sizes="600px" />
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold text-gray-900">פרטי מנה</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <FormField label="שם מנה *" htmlFor="name">
              <input
                id="name" required value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="שם המנה" className={INPUT_CLS}
              />
            </FormField>

            <FormField label="קטגוריה *" htmlFor="category">
              <select
                id="category" required value={form.category ?? ""}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={INPUT_CLS}
              >
                <option value="">בחר קטגוריה</option>
                {categories.filter((c) => c.id !== "all").map((c) => (
                  <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                ))}
              </select>
            </FormField>

            <FormField label="מחיר (₪)" htmlFor="price">
              <input
                id="price" type="number" min="0" step="1"
                value={form.price ?? 0}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className={INPUT_CLS}
              />
            </FormField>

            <FormField label="Badge (תווית)" htmlFor="badge">
              <select
                id="badge" value={form.badge ?? ""}
                onChange={(e) => setForm({ ...form, badge: e.target.value || undefined })}
                className={INPUT_CLS}
              >
                <option value="">ללא תווית</option>
                <option value="bestseller">🔥 הנמכר ביותר</option>
                <option value="popular">⭐ פופולרי</option>
                <option value="new">✨ חדש</option>
              </select>
            </FormField>
          </div>

          <FormField label="תיאור" htmlFor="description">
            <textarea
              id="description" rows={3} value={form.description ?? ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="תיאור קצר של המנה..."
              className={INPUT_CLS + " resize-none"}
            />
          </FormField>

          <FormField label="כתובת תמונה (URL)" htmlFor="image">
            <input
              id="image" type="url" value={form.image ?? ""}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className={INPUT_CLS} dir="ltr"
            />
          </FormField>

          <div className="flex items-center gap-3">
            <input
              id="available" type="checkbox"
              checked={form.available ?? true}
              onChange={(e) => setForm({ ...form, available: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-400"
            />
            <label htmlFor="available" className="text-sm font-semibold text-gray-700">
              פריט זמין (מוצג בתפריט)
            </label>
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            <Save size={16} />
            {saving ? "שומר..." : creating ? "צור פריט" : "שמור שינויים"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-6 py-3 rounded-xl transition-colors"
          >
            ביטול
          </button>
        </div>
      </form>
    </div>
  );
}

const INPUT_CLS = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white";

function FormField({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
