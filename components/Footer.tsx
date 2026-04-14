import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

const legalLinks = [
  { href: "/legal/terms",         label: "תנאי שימוש" },
  { href: "/legal/privacy",       label: "מדיניות פרטיות" },
  { href: "/legal/accessibility", label: "הצהרת נגישות" },
  { href: "/legal/refund",        label: "מדיניות ביטולים" },
];

export default function Footer() {
  return (
    <footer id="contact" className="bg-brown-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.png"
                alt="תורגיי"
                width={52}
                height={52}
                className=""
              />
              <div>
                <p className="text-xl font-black">תורגיי</p>
                <p className="text-brown-400 text-xs">קייטרינג לשבת ואירועים</p>
              </div>
            </div>
            <p className="text-brown-300 text-sm leading-relaxed max-w-xs">
              קייטרינג מקצועי לשבתות ואירועים. בישול ביתי אמיתי עם מתכונים מסורתיים — מוכן עם אהבה לכל שולחן.
            </p>
          </div>

          {/* Hours */}
          <div>
            <h2 className="font-bold text-amber-400 mb-4">שעות הזמנה</h2>
            <ul className="space-y-2 text-brown-300 text-sm">
              <li>ראשון – חמישי: 08:00 – 20:00</li>
              <li>שישי: 08:00 – 12:00</li>
              <li className="text-brown-500">שבת: סגור</li>
            </ul>
            <p className="mt-4 text-xs text-brown-500">
              * ניתן להזמין אונליין עד יום חמישי בשעה 20:00
            </p>
          </div>

          {/* Contact */}
          <div>
            <h2 className="font-bold text-amber-400 mb-4">צרו קשר</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="tel:050-000-0000"
                  className="flex items-center gap-2 text-brown-300 hover:text-white focus-visible:ring-2 focus-visible:ring-amber-400 rounded transition-colors"
                >
                  <Phone size={15} className="text-amber-500" aria-hidden="true" />
                  050-000-0000
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@turgi.co.il"
                  className="flex items-center gap-2 text-brown-300 hover:text-white focus-visible:ring-2 focus-visible:ring-amber-400 rounded transition-colors"
                >
                  <Mail size={15} className="text-amber-500" aria-hidden="true" />
                  hello@turgi.co.il
                </a>
              </li>
              <li className="flex items-center gap-2 text-brown-300">
                <MapPin size={15} className="text-amber-500" aria-hidden="true" />
                תל אביב והסביבה
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-brown-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-brown-500 text-sm">
          <div className="flex items-center gap-4">
            <p>© {new Date().getFullYear()} תורגיי. כל הזכויות שמורות.</p>
            <Link
              href="/admin"
              className="text-brown-700 hover:text-brown-500 text-xs transition-colors"
              aria-label="כניסת מנהל"
            >
              ניהול
            </Link>
          </div>
          <nav aria-label="קישורים משפטיים">
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
              {legalLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="hover:text-white focus-visible:ring-1 focus-visible:ring-amber-400 rounded transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
