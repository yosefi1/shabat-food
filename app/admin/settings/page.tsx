"use client";

import { useEffect, useState } from "react";
import { Save, Plus, Trash2, RefreshCw } from "lucide-react";
import type { AdminSettings } from "@/lib/adminData";

export default function SettingsPage() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then(setSettings);
  }, []);

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    await fetch("/api/admin/settings", {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function update(partial: Partial<AdminSettings>) {
    setSettings((prev) => prev ? { ...prev, ...partial } : prev);
  }

  if (!settings) return (
    <div className="flex items-center justify-center h-32 text-gray-400">
      <RefreshCw size={20} className="animate-spin ml-2" /> טוען...
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Banner */}
      <Section title="🎯 באנר אתר">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <input
              id="banner-on" type="checkbox"
              checked={settings.banner.enabled}
              onChange={(e) => update({ banner: { ...settings.banner, enabled: e.target.checked } })}
              className="h-4 w-4 text-amber-500 focus:ring-amber-400"
            />
            <label htmlFor="banner-on" className="text-sm font-semibold text-gray-700">הצג באנר</label>
          </div>
          <input
            type="text" value={settings.banner.text}
            onChange={(e) => update({ banner: { ...settings.banner, text: e.target.value } })}
            placeholder="טקסט הבאנר... (לדוגמה: חג שמח!)"
            className={INPUT}
          />
          <select
            value={settings.banner.type}
            onChange={(e) => update({ banner: { ...settings.banner, type: e.target.value } })}
            className={INPUT}
          >
            <option value="info">מידע (כחול)</option>
            <option value="warning">אזהרה (כתום)</option>
            <option value="success">הצלחה (ירוק)</option>
          </select>
        </div>
      </Section>

      {/* Business hours */}
      <Section title="🕐 שעות פעילות">
        <div className="space-y-2">
          {settings.businessHours.map((h, i) => (
            <div key={h.day} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
              <div className="w-16 text-sm font-semibold text-gray-700">{h.day}</div>
              <input
                type="checkbox" checked={h.isOpen}
                onChange={(e) => {
                  const updated = [...settings.businessHours];
                  updated[i] = { ...h, isOpen: e.target.checked };
                  update({ businessHours: updated });
                }}
                className="h-4 w-4 text-amber-500 focus:ring-amber-400"
              />
              <label className="text-xs text-gray-500">{h.isOpen ? "פתוח" : "סגור"}</label>
              {h.isOpen && (
                <>
                  <input type="time" value={h.open}
                    onChange={(e) => {
                      const updated = [...settings.businessHours];
                      updated[i] = { ...h, open: e.target.value };
                      update({ businessHours: updated });
                    }}
                    className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:ring-1 focus:ring-amber-400 focus:outline-none"
                  />
                  <span className="text-gray-400 text-xs">עד</span>
                  <input type="time" value={h.close}
                    onChange={(e) => {
                      const updated = [...settings.businessHours];
                      updated[i] = { ...h, close: e.target.value };
                      update({ businessHours: updated });
                    }}
                    className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:ring-1 focus:ring-amber-400 focus:outline-none"
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Holiday blocks */}
      <Section title="🚫 חסימות חגים / חופשה">
        <div className="space-y-2 mb-3">
          {settings.holidayBlocks.map((b, i) => (
            <div key={b.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
              <input
                type="text" value={b.name} placeholder="שם (לדוגמה: ראש השנה)"
                onChange={(e) => {
                  const updated = [...settings.holidayBlocks];
                  updated[i] = { ...b, name: e.target.value };
                  update({ holidayBlocks: updated });
                }}
                className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
              <input type="date" value={b.from}
                onChange={(e) => {
                  const updated = [...settings.holidayBlocks];
                  updated[i] = { ...b, from: e.target.value };
                  update({ holidayBlocks: updated });
                }}
                className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
              <span className="text-gray-400 text-xs">עד</span>
              <input type="date" value={b.to}
                onChange={(e) => {
                  const updated = [...settings.holidayBlocks];
                  updated[i] = { ...b, to: e.target.value };
                  update({ holidayBlocks: updated });
                }}
                className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
              <button
                onClick={() => update({ holidayBlocks: settings.holidayBlocks.filter((_, j) => j !== i) })}
                className="text-red-400 hover:text-red-600 p-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => update({
            holidayBlocks: [...settings.holidayBlocks,
              { id: Date.now().toString(), name: "", from: "", to: "" }],
          })}
          className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-semibold"
        >
          <Plus size={16} /> הוסף חסימה
        </button>
      </Section>

      {/* Delivery zones */}
      <Section title="🚚 אזורי משלוח">
        <div className="space-y-3 mb-3">
          {settings.deliveryZones.map((z, i) => (
            <div key={z.id} className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-3 bg-gray-50 rounded-xl items-end">
              <div className="sm:col-span-2">
                <label className="text-xs text-gray-500 mb-1 block">שם האזור</label>
                <input type="text" value={z.name}
                  onChange={(e) => {
                    const updated = [...settings.deliveryZones];
                    updated[i] = { ...z, name: e.target.value };
                    update({ deliveryZones: updated });
                  }}
                  className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
              {[
                { key:"fee",      label:"דמי משלוח ₪" },
                { key:"minOrder", label:"מינימום ₪"    },
                { key:"freeFrom", label:"חינם מ- ₪"   },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="text-xs text-gray-500 mb-1 block">{label}</label>
                  <input type="number" min="0"
                    value={(z as Record<string, unknown>)[key] as number}
                    onChange={(e) => {
                      const updated = [...settings.deliveryZones];
                      updated[i] = { ...z, [key]: Number(e.target.value) };
                      update({ deliveryZones: updated });
                    }}
                    className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              ))}
              <button
                onClick={() => update({ deliveryZones: settings.deliveryZones.filter((_, j) => j !== i) })}
                className="text-red-400 hover:text-red-600 p-2 flex justify-center"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => update({
            deliveryZones: [...settings.deliveryZones,
              { id: Date.now().toString(), name: "", fee: 25, minOrder: 150, freeFrom: 200 }],
          })}
          className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-semibold"
        >
          <Plus size={16} /> הוסף אזור
        </button>
      </Section>

      {/* Notifications */}
      <Section title="🔔 התראות">
        <div className="space-y-3">
          {[
            { key:"email",    label:"אימייל",    sub:"שלח אימייל לבעל העסק עם כל הזמנה" },
            { key:"whatsapp", label:"WhatsApp",  sub:"(בפיתוח — דורש חיבור WhatsApp Business API)" },
            { key:"sms",      label:"SMS",       sub:"(בפיתוח — דורש ספק SMS)" },
          ].map(({ key, label, sub }) => (
            <div key={key} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
              <input
                type="checkbox"
                checked={(settings.notifications[key as "email"|"whatsapp"|"sms"] as { enabled: boolean }).enabled}
                onChange={(e) => update({
                  notifications: {
                    ...settings.notifications,
                    [key]: {
                      ...(settings.notifications[key as "email"|"whatsapp"|"sms"]),
                      enabled: e.target.checked,
                    },
                  },
                })}
                className="mt-0.5 h-4 w-4 text-amber-500 focus:ring-amber-400"
              />
              <div>
                <p className="text-sm font-semibold text-gray-800">{label}</p>
                <p className="text-xs text-gray-500">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition-colors"
      >
        <Save size={16} />
        {saving ? "שומר..." : saved ? "✓ נשמר!" : "שמור הגדרות"}
      </button>
    </div>
  );
}

const INPUT = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <h2 className="font-bold text-gray-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}
