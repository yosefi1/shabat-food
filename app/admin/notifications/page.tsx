"use client";

import { useEffect, useState } from "react";
import { Bell, Save } from "lucide-react";
import type { AdminSettings } from "@/lib/adminData";

export default function NotificationsPage() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then(setSettings);
  }, []);

  async function save() {
    if (!settings) return;
    setSaving(true);
    await fetch("/api/admin/settings", {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(settings),
    });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!settings) return <div className="text-gray-400 text-center py-10">טוען...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <Bell size={20} className="text-amber-500" />
          <h2 className="font-bold text-gray-900">הגדרות התראות</h2>
        </div>

        {/* Email */}
        <NotifSection
          title="📧 אימייל"
          subtitle="אימייל לבעל העסק עם פרטי כל הזמנה חדשה"
          enabled={settings.notifications.email.enabled}
          onToggle={(v) => setSettings({ ...settings, notifications: { ...settings.notifications, email: { enabled: v } } })}
          status="פעיל ← מוגדר דרך SMTP_USER ב-.env.local"
        />

        {/* WhatsApp */}
        <NotifSection
          title="💬 WhatsApp"
          subtitle="הודעה ל-WhatsApp עם כל הזמנה חדשה (דורש WhatsApp Business API)"
          enabled={settings.notifications.whatsapp.enabled}
          onToggle={(v) => setSettings({
            ...settings,
            notifications: { ...settings.notifications, whatsapp: { ...settings.notifications.whatsapp, enabled: v } },
          })}
          status="בפיתוח"
          comingSoon
        >
          <div className="mt-2">
            <label className="text-xs text-gray-500 mb-1 block">מספר WhatsApp Business</label>
            <input
              type="tel" value={settings.notifications.whatsapp.phone} dir="ltr"
              onChange={(e) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, whatsapp: { ...settings.notifications.whatsapp, phone: e.target.value } },
              })}
              placeholder="+972501234567"
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 w-full"
            />
          </div>
        </NotifSection>

        {/* SMS */}
        <NotifSection
          title="📱 SMS"
          subtitle="SMS לעובדים עם הזמנה חדשה (דורש Twilio / 019 / הודעות)"
          enabled={settings.notifications.sms.enabled}
          onToggle={(v) => setSettings({ ...settings, notifications: { ...settings.notifications, sms: { enabled: v } } })}
          status="בפיתוח"
          comingSoon
        />
      </div>

      <button
        onClick={save} disabled={saving}
        className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition-colors"
      >
        <Save size={16} />
        {saving ? "שומר..." : saved ? "✓ נשמר!" : "שמור הגדרות"}
      </button>
    </div>
  );
}

function NotifSection({
  title, subtitle, enabled, onToggle, status, comingSoon, children,
}: {
  title: string; subtitle: string; enabled: boolean; onToggle: (v: boolean) => void;
  status: string; comingSoon?: boolean; children?: React.ReactNode;
}) {
  return (
    <div className="p-4 bg-gray-50 rounded-2xl">
      <div className="flex items-start gap-3">
        <input
          type="checkbox" checked={enabled} onChange={(e) => onToggle(e.target.checked)}
          disabled={comingSoon}
          className="mt-1 h-4 w-4 text-amber-500 focus:ring-amber-400 disabled:opacity-40"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-900 text-sm">{title}</p>
            {comingSoon && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">בקרוב</span>}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          <p className="text-xs text-gray-400 mt-1">סטטוס: {status}</p>
          {!comingSoon && children}
        </div>
      </div>
    </div>
  );
}
