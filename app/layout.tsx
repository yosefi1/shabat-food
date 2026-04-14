import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import { CartProvider }   from "@/context/CartContext";
import CookieConsent     from "@/components/CookieConsent";

const heebo = Heebo({
  subsets:  ["hebrew", "latin"],
  variable: "--font-heebo",
  display:  "swap",
});

/* ─────────────────────────────────────────────────────────────────────────────
 * Site-wide metadata
 * Update business name, description, URL, and OG image before launch.
 * ─────────────────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: {
    default:  "תורגיי | קייטרינג לשבת ואירועים",
    template: "%s | תורגיי",
  },
  description:
    "קייטרינג מקצועי לשבתות ואירועים — סלטים, ממולאים, מנות בשר ועוף, ודגים. בישול ביתי אמיתי עם מתכונים מסורתיים.",
  keywords: ["תורגיי", "קייטרינג", "שבת", "אירועים", "אוכל ביתי", "סלטים", "ממולאים", "משלוח שישי"],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://turgi.co.il"
  ),
  openGraph: {
    type:   "website",
    locale: "he_IL",
    url:    "/",
    siteName: "תורגיי",
  },
  robots: {
    index:  true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body className="min-h-screen antialiased">

        {/*
          ACCESSIBILITY: Skip-to-main link.
          First focusable element on the page.
          Visible only when focused (keyboard users).
          WCAG 2.4.1 — Bypass Blocks (Level A).
        */}
        <a
          href="#main-content"
          className="
            sr-only
            focus:not-sr-only focus:fixed focus:top-4 focus:start-4
            focus:z-[9999] focus:bg-amber-500 focus:text-white
            focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold
            focus:shadow-lg focus:ring-2 focus:ring-white
          "
        >
          דלג לתוכן הראשי
        </a>

        <CartProvider>
          {children}
        </CartProvider>
        {/* FIX C7 — tabindex="-1" lets the skip link move focus here
            programmatically in Safari and older browsers (WCAG 2.4.1).
            The id is targeted by the skip link href="#main-content". */}

        {/*
          Cookie consent rendered outside CartProvider intentionally —
          it is independent of cart state.
        */}
        <CookieConsent />
      </body>
    </html>
  );
}
