"use client";

/**
 * CookieConsent.tsx
 *
 * Displays a cookie/privacy notice banner on first visit.
 *
 * WHAT WE STORE:
 *   - localStorage["shabbat-food-cart"]  — cart contents (functional, required)
 *   - localStorage["cookie-consent"]     — this banner's preference
 *
 * WE DO NOT use:
 *   - Google Analytics or any analytics service
 *   - Facebook Pixel or social tracking
 *   - Third-party marketing cookies
 *
 * LEGAL NOTES:
 *   Under the Israeli Privacy Protection Law (5741-1981) and its regulations,
 *   and following GDPR principles that Israeli courts are increasingly adopting,
 *   users must be informed about data collection.
 *
 *   - Functional cookies (cart, consent preference) generally do NOT require
 *     opt-in consent, but users should be informed.
 *   - If you add analytics or marketing tools later, update this banner to
 *     require explicit opt-in consent (currently: accept/decline is cosmetic
 *     because we have no tracking to block).
 *
 * LEGAL REVIEW REQUIRED:
 *   Have a lawyer verify this banner's text and behaviour before launch,
 *   particularly if you add any third-party tracking later.
 */

import { useState, useEffect, useId } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { X, Cookie } from "lucide-react";

const CONSENT_KEY = "cookie-consent";

export default function CookieConsent() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const dialogId = useId();

  // Never show on admin routes
  if (pathname.startsWith("/admin")) return null;

  useEffect(() => {
    // Show banner only if user hasn't already decided
    if (!localStorage.getItem(CONSENT_KEY)) {
      // Slight delay so it doesn't flash on first render
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    // Even on decline we store the preference so banner doesn't re-appear.
    // We have no tracking to disable, but the structure is here for when you add any.
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby={`${dialogId}-title`}
      aria-describedby={`${dialogId}-desc`}
      className="fixed bottom-0 inset-x-0 z-[200] p-4 sm:p-6 pointer-events-none"
    >
      <div className="mx-auto max-w-2xl bg-brown-900 text-white rounded-2xl shadow-2xl p-5 sm:p-6 pointer-events-auto">
        <div className="flex items-start gap-4">
          <Cookie size={24} className="text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex-1">
            <h2 id={`${dialogId}-title`} className="font-bold text-base mb-1">
              שימוש בעוגיות ומידע אישי
            </h2>
            <p id={`${dialogId}-desc`} className="text-brown-300 text-sm leading-relaxed">
              אנו משתמשים ב-LocalStorage לשמירת עגלת הקניות שלך.
              לא מותקנות עוגיות מעקב שיווקיות.{" "}
              <Link
                href="/legal/privacy"
                className="text-amber-400 hover:underline focus-visible:ring-1 focus-visible:ring-amber-400 rounded"
              >
                מדיניות הפרטיות המלאה
              </Link>
              .
            </p>
          </div>
          <button
            onClick={decline}
            aria-label="סגור הודעת עוגיות"
            className="text-brown-400 hover:text-white focus-visible:ring-2 focus-visible:ring-amber-400 rounded p-1 flex-shrink-0 transition-colors"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 mt-4">
          <button
            onClick={decline}
            className="text-sm text-brown-300 hover:text-white focus-visible:ring-2 focus-visible:ring-amber-400 rounded px-4 py-2 transition-colors"
          >
            הבנתי, ללא מעקב
          </button>
          <button
            onClick={accept}
            className="text-sm bg-amber-500 hover:bg-amber-400 focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-brown-900 text-white font-bold px-6 py-2 rounded-xl transition-colors"
          >
            אישור
          </button>
        </div>
      </div>
    </div>
  );
}
