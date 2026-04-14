import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-brown-100 px-4 py-4 sticky top-0 z-50">
        <div className="mx-auto max-w-3xl flex items-center gap-3">
          <Link
            href="/"
            aria-label="חזור לעמוד הבית"
            className="text-brown-400 hover:text-brown-700 focus-visible:ring-2 focus-visible:ring-amber-400 rounded transition-colors"
          >
            <ChevronRight size={22} aria-hidden="true" />
          </Link>
          <Link href="/" className="font-black text-xl text-brown-900">
            🕯️ שבת פוד
          </Link>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-3xl px-4 py-12">
        {children}
      </main>

      <footer className="border-t border-brown-100 py-6 text-center text-sm text-brown-400">
        <nav aria-label="ניווט בדפי מידע משפטי">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {[
              ["/legal/privacy",       "מדיניות פרטיות"],
              ["/legal/terms",         "תנאי שימוש"],
              ["/legal/accessibility", "הצהרת נגישות"],
              ["/legal/refund",        "מדיניות ביטולים"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="hover:text-brown-700 focus-visible:ring-1 focus-visible:ring-amber-400 rounded transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </footer>
    </div>
  );
}
