"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Tag, Save } from "lucide-react";
import type { AdminSettings } from "@/lib/adminData";

type Coupon = AdminSettings["coupons"][number];

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json())
      .then((s: AdminSettings) => setCoupons(s.coupons ?? []));
  }, []);

  async function save() {
    setSaving(true);
    const settings: AdminSettings = await fetch("/api/admin/settings").then((r) => r.json());
    await fetch("/api/admin/settings", {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ ...settings, coupons }),
    });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function addCoupon() {
    setCoupons([...coupons, {
      id: Date.now().toString(), code: "", discount: 10,
      type: "percent", minOrder: 0, expiresAt: "", active: true,
    }]);
  }

  function update(i: number, patch: Partial<Coupon>) {
    const updated = [...coupons];
    updated[i] = { ...updated[i], ...patch };
    setCoupons(updated);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      <div className="flex items-center justify-between">
        <h1 className="text-lg font-black text-gray-900 flex items-center gap-2">
          <Tag size={20} className="text-amber-500" /> קופונים והנחות
        </h1>
        <button
          onClick={addCoupon}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors"
        >
          <Plus size={16} /> קופון חדש
        </button>
      </div>

      {coupons.length === 0 && (
        <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center text-gray-400">
          <Tag size={32} className="mx-auto mb-3 opacity-30" />
          <p>אין קופונים עדיין. לחץ על &quot;קופון חדש&quot; להוספה.</p>
        </div>
      )}

      <div className="space-y-3">
        {coupons.map((c, i) => (
          <div key={c.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">קוד קופון</label>
                <input type="text" value={c.code} placeholder="SUMMER10"
                  onChange={(e) => update(i, { code: e.target.value.toUpperCase() })}
                  className={INPUT} dir="ltr"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">הנחה</label>
                <div className="flex gap-2">
                  <input type="number" min="0" value={c.discount}
                    onChange={(e) => update(i, { discount: Number(e.target.value) })}
                    className={INPUT}
                  />
                  <select value={c.type} onChange={(e) => update(i, { type: e.target.value as "percent"|"fixed" })}
                    className={INPUT}
                  >
                    <option value="percent">%</option>
                    <option value="fixed">₪</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">מינימום הזמנה ₪</label>
                <input type="number" min="0" value={c.minOrder}
                  onChange={(e) => update(i, { minOrder: Number(e.target.value) })}
                  className={INPUT}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">תוקף עד</label>
                <input type="date" value={c.expiresAt}
                  onChange={(e) => update(i, { expiresAt: e.target.value })}
                  className={INPUT}
                />
              </div>
              <div className="flex items-end gap-3">
                <div className="flex items-center gap-2 mt-5">
                  <input type="checkbox" checked={c.active} id={`active-${i}`}
                    onChange={(e) => update(i, { active: e.target.checked })}
                    className="h-4 w-4 text-amber-500"
                  />
                  <label htmlFor={`active-${i}`} className="text-sm font-semibold text-gray-700">פעיל</label>
                </div>
                <button
                  onClick={() => setCoupons(coupons.filter((_, j) => j !== i))}
                  className="mt-5 text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {coupons.length > 0 && (
        <button
          onClick={save} disabled={saving}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition-colors"
        >
          <Save size={16} />
          {saving ? "שומר..." : saved ? "✓ נשמר!" : "שמור קופונים"}
        </button>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-700">
        <strong>הערה:</strong> קודי קופון נשמרים אך ייאכפו אוטומטית בטופס ההזמנה רק לאחר חיבור לוגיקת הקופון בצד לקוח.
        זהו שלב הגדרה.
      </div>
    </div>
  );
}

const INPUT = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white";
