import { Users2, Lock } from "lucide-react";

const ROLES = [
  { name: "מנהל ראשי",       perms: ["הכל"],                          color: "bg-purple-100 text-purple-700" },
  { name: "מנהל הזמנות",     perms: ["הזמנות","לקוחות","דשבורד"],     color: "bg-blue-100 text-blue-700"   },
  { name: "מנהל תפריט",      perms: ["תפריט","קטגוריות"],             color: "bg-green-100 text-green-700" },
  { name: "משתמש קריאה בלבד",perms: ["דשבורד","הזמנות (צפייה)"],     color: "bg-gray-100 text-gray-600"   },
];

const COMING_SOON = [
  "הזמנת עובדים דרך אימייל",
  "הגדרת הרשאות מפורטות לכל עמוד",
  "יומן פעולות (audit log) — מי שינה מה ומתי",
  "2FA — אימות דו-שלבי לעובדים",
  "פג תוקף סיסמה אוטומטי",
];

export default function EmployeesPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <Users2 size={20} className="text-purple-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">ניהול עובדים והרשאות</h2>
            <p className="text-xs text-gray-500">כרגע: כניסה אחת (מנהל ראשי)</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          מערכת ניהול עובדים מרובים תהיה זמינה לאחר חיבור מסד נתונים.
          כרגע האתר תומך בכניסת מנהל יחיד עם הסיסמה ב-<code className="bg-gray-100 px-1 rounded text-xs">ADMIN_PASSWORD</code>.
        </p>
      </div>

      {/* Planned roles */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-bold text-gray-900 mb-4">תפקידים מתוכננים</h2>
        <div className="space-y-3">
          {ROLES.map((r) => (
            <div key={r.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${r.color}`}>{r.name}</span>
              <div className="flex gap-1.5 flex-wrap">
                {r.perms.map((p) => (
                  <span key={p} className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-600">{p}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coming soon */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Lock size={16} className="text-gray-400" />
          <h2 className="font-bold text-gray-900">בפיתוח</h2>
        </div>
        <ul className="space-y-2">
          {COMING_SOON.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-gray-500">
              <span className="w-4 h-4 rounded-full bg-gray-200 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
