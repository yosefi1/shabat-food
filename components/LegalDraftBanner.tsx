/**
 * LegalDraftBanner — only visible when SHOW_LEGAL_DRAFT_WARNINGS=true.
 *
 * FIX C3: The amber "הערה לעסק" banners must never appear to real users.
 * Set SHOW_LEGAL_DRAFT_WARNINGS=true in .env.local during development.
 * Leave it unset (default) in production — Vercel / production env.
 *
 * This is a server component (no "use client") so the env check runs at
 * build/request time, never in the browser bundle.
 */
export default function LegalDraftBanner({ text }: { text: string }) {
  if (process.env.SHOW_LEGAL_DRAFT_WARNINGS !== "true") return null;

  return (
    <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
      <strong>⚠️ טיוטה (גלויה בסביבת פיתוח בלבד):</strong> {text}
    </div>
  );
}
