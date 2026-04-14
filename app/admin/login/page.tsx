"use client";

import { Suspense, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Eye, EyeOff } from "lucide-react";

/* useSearchParams must be inside a Suspense boundary for static export */
function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const from         = searchParams.get("from") ?? "/admin";

  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push(from);
      } else {
        const data = await res.json();
        setError(data.message ?? "סיסמה שגויה");
      }
    } catch {
      setError("שגיאת רשת — נסה שוב");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-2xl p-8 space-y-5"
    >
      <div className="text-center mb-2">
        <div className="inline-flex w-12 h-12 rounded-full bg-amber-100 items-center justify-center mb-3">
          <Lock size={22} className="text-amber-600" />
        </div>
        <h2 className="text-lg font-bold text-brown-900">כניסה לניהול</h2>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-brown-700 mb-1.5">
          סיסמה
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPwd ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
            placeholder="הזן סיסמת ניהול"
            className="w-full border border-brown-200 rounded-xl px-4 py-3 text-brown-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 pl-12"
            dir="ltr"
          />
          <button
            type="button"
            onClick={() => setShowPwd((p) => !p)}
            aria-label={showPwd ? "הסתר סיסמה" : "הצג סיסמה"}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-700"
          >
            {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !password}
        className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors"
      >
        {loading ? "מתחבר..." : "כניסה"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-brown-900 flex items-center justify-center px-4" dir="rtl">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🕯️</div>
          <h1 className="text-2xl font-black text-white">שבת פוד</h1>
          <p className="text-brown-400 text-sm mt-1">ממשק ניהול</p>
        </div>

        <Suspense fallback={
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center text-brown-400">
            טוען...
          </div>
        }>
          <LoginForm />
        </Suspense>

        <p className="text-center text-brown-600 text-xs mt-6">
          גישה מורשית בלבד
        </p>
      </div>
    </div>
  );
}
