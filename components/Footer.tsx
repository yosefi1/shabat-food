import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="bg-brown-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🕯️</span>
              <span className="text-xl font-black">שבת פוד</span>
            </div>
            <p className="text-brown-300 text-sm leading-relaxed max-w-xs">
              בישול ביתי אמיתי לשולחן השבת שלכם. מוכן עם אהבה, מוגש עם חמימות — כל שישי.
            </p>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-bold text-amber-400 mb-4">שעות הזמנה</h3>
            <ul className="space-y-2 text-brown-300 text-sm">
              <li>ראשון – חמישי: 08:00 – 20:00</li>
              <li>שישי: 08:00 – 12:00 (איסוף עצמי בלבד)</li>
              <li className="text-brown-500">שבת: סגור</li>
            </ul>
            <p className="mt-4 text-xs text-brown-500">
              * ניתן להזמין אונליין עד יום חמישי 20:00
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-amber-400 mb-4">צרו קשר</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="tel:050-000-0000" className="flex items-center gap-2 text-brown-300 hover:text-white transition-colors">
                  <Phone size={15} className="text-amber-500" />
                  050-000-0000
                </a>
              </li>
              <li>
                <a href="mailto:hello@shabbatfood.co.il" className="flex items-center gap-2 text-brown-300 hover:text-white transition-colors">
                  <Mail size={15} className="text-amber-500" />
                  hello@shabbatfood.co.il
                </a>
              </li>
              <li className="flex items-center gap-2 text-brown-300">
                <MapPin size={15} className="text-amber-500" />
                תל אביב והסביבה
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-brown-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-brown-500 text-sm">
          <p>© {new Date().getFullYear()} שבת פוד. כל הזכויות שמורות.</p>
          <div className="flex gap-5">
            <Link href="#" className="hover:text-white transition-colors">תנאי שימוש</Link>
            <Link href="#" className="hover:text-white transition-colors">מדיניות פרטיות</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
