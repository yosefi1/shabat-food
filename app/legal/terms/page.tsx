import type { Metadata } from "next";
import LegalDraftBanner from "@/components/LegalDraftBanner";

export const metadata: Metadata = {
  title: "תנאי שימוש",
  description: "תנאי השימוש של תורגיי — זכויות וחובות בשימוש בשירות ובהזמנת מוצרים.",
};

/*
 * LEGAL DISCLAIMER: Template — requires attorney review before publication.
 * Key Israeli laws to verify compliance with:
 *   - חוק המכר (תשכ"ח-1968) — Sale Law
 *   - חוק הגנת הצרכן (תשמ"א-1981) — Consumer Protection Law
 *   - חוק המחשבים (תשנ"ה-1995) — Computer Law
 *   - תקנות הגנת הצרכן (ביטול עסקה) תשע"א-2010 — Cancellation Regulations
 */

export default function TermsPage() {
  const lastUpdated   = "אפריל 2026";
  const businessName  = "תורגיי";
  const contactEmail  = "hello@turgi.co.il";
  const contactPhone  = "050-000-0000";

  return (
    <article className="prose prose-brown max-w-none" dir="rtl">
      <LegalDraftBanner text="דף זה הוא תבנית שדורשת בדיקת עורך דין לפני פרסום. הפריטים המסומנים ב-[סמן כאן] דורשים מילוי פרטים ספציפיים." />


      <h1 className="text-3xl font-black text-brown-900 mb-2">תנאי שימוש</h1>
      <p className="text-brown-400 text-sm mb-8">עדכון אחרון: {lastUpdated}</p>

      <Section title="1. כללי">
        <p>
          ברוכים הבאים לאתר {businessName}. השימוש באתר ובשירותי ההזמנה כפוף לתנאים
          המפורטים להלן. בשימוש באתר ובביצוע הזמנה, אתה מסכים לתנאים אלה במלואם.
        </p>
        <p>
          שירות זה מיועד ל<strong>לקוחות עסקיים בלבד</strong> (בעלי עסקים, מסעדות, גני
          אירועים, מוסדות). שימוש על ידי צרכנים פרטיים אינו מקנה זכויות נוספות מכוח
          חוק הגנת הצרכן, אלא אם נקבע אחרת על ידי בית משפט מוסמך.
        </p>
      </Section>

      <Section title="2. ההזמנה והחוזה">
        <ul>
          <li>הגשת הזמנה באתר מהווה הצעה לרכישה בלבד ואינה אישור עסקה.</li>
          <li>
            עסקת המכר תחשב כמושלמת רק לאחר <strong>אישור טלפוני או בכתב</strong> מצד
            {businessName}.
          </li>
          <li>
            {businessName} שומרת לעצמה את הזכות לסרב להזמנה מכל סיבה, כולל חוסר זמינות
            מוצרים, בעיות משלוח, או חשד להונאה.
          </li>
          <li>מחירי המוצרים אינם כוללים מע&quot;מ, אלא אם צוין אחרת.</li>
        </ul>
      </Section>

      <Section title="3. מחירים ותשלום">
        <ul>
          <li>המחירים המוצגים באתר הם בשקלים חדשים (₪) ואינם כוללים מע&quot;מ.</li>
          <li>
            {businessName} רשאית לשנות מחירים בכל עת. שינוי מחיר לאחר אישור הזמנה
            ייעשה בהסכמת הלקוח בלבד.
          </li>
          <li>
            התשלום מתבצע דרך שער תשלומים מאובטח. {businessName} לא שומרת פרטי
            כרטיס אשראי.
          </li>
          <li>
            דמי משלוח: [סמן כאן: ₪XX] לרכישה מתחת ל-₪200, חינם מעל לסכום זה
            (בכפוף לאזור המשלוח).
          </li>
        </ul>
      </Section>

      <Section title="4. משלוחים">
        <ul>
          <li>
            <strong>אזור המשלוח:</strong> [סמן כאן: פרט את אזורי המשלוח הפעילים].
            הזמנות מחוץ לאזור יטופלו בנפרד.
          </li>
          <li>
            <strong>מועדי משלוח:</strong> ימי שישי בלבד, בחלונות הזמן המוצגים בטופס
            ההזמנה. {businessName} תשאף לעמוד במועד שנבחר אך אינה אחראית לעיכובים
            שנגרמו מסיבות שמחוץ לשליטתה.
          </li>
          <li>
            <strong>קבלת המשלוח:</strong> הלקוח אחראי לוודא נוכחות בכתובת המשלוח
            בשעה שנקבעה.
          </li>
          <li>
            <strong>תנאי קירור:</strong> מוצרי מזון ישמרו בקירור מיד עם קבלתם.
            {businessName} אינה אחראית לנזק שנגרם מאחסון לקוי על ידי הלקוח.
          </li>
        </ul>
      </Section>

      <Section title="5. ביטולים והחזרות">
        <p>
          ראה את <a href="/legal/refund" className="text-amber-600 hover:underline">מדיניות הביטולים וההחזרות</a> המלאה.
        </p>
      </Section>

      <Section title="6. מוצרי מזון ואחריות">
        <ul>
          <li>
            <strong>אלרגנים:</strong> יש לפרט אלרגיות בשדה ההערות. {businessName}
            תעשה מאמץ סביר להתחשב בהן, אך ייתכן שייעשה שימוש במוצרים שעשויים להכיל
            עקבות של אלרגנים שונים (אגוזים, גלוטן, חלב, ביצים). לקוחות עם רגישות
            חמורה ייעצו עם הצוות לפני ההזמנה.
          </li>
          <li>
            <strong>כשרות:</strong> [סמן כאן: פרט את הכשרות אם רלוונטי — כשר / חלק /
            ללא בשר וחלב וכו&apos;].
          </li>
          <li>
            <strong>אסור לצרוך</strong> מוצרים שנפגמו, נשפכו, או שהגיעו באריזה פגומה.
            יש לדווח מיד ל-{businessName}.
          </li>
        </ul>
      </Section>

      <Section title="7. קניין רוחני">
        <p>
          כל התכנים באתר — כולל טקסטים, תמונות, עיצוב, ולוגו — הם רכושה של
          {businessName} ומוגנים בזכויות יוצרים. אין לשכפל, להפיץ, או להשתמש בהם
          ללא אישור בכתב.
        </p>
      </Section>

      <Section title="8. הגבלת אחריות">
        <p>
          בכפוף לדין הישראלי, {businessName} לא תישא באחריות לנזקים עקיפים,
          תוצאתיים, או עונשיים. האחריות המרבית מוגבלת לשווי ההזמנה הספציפית.
        </p>
      </Section>

      <Section title="9. שינויים בתנאים">
        <p>
          {businessName} רשאית לשנות תנאים אלה בכל עת. שינויים מהותיים יפורסמו באתר
          לפחות 14 ימים לפני כניסתם לתוקף.
        </p>
      </Section>

      <Section title="10. דין וסמכות שיפוטית">
        <p>
          תנאים אלה כפופים לדיני מדינת ישראל. סמכות השיפוט הבלעדית נתונה לבתי
          המשפט המוסמכים ב[סמן כאן: עיר — תל אביב / ירושלים].
        </p>
      </Section>

      <Section title="צור קשר">
        <p>
          לשאלות: <a href={`mailto:${contactEmail}`} className="text-amber-600 hover:underline">{contactEmail}</a>
          {" "}| טלפון: {contactPhone}
        </p>
      </Section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-brown-900 mb-3 pb-2 border-b border-brown-100">{title}</h2>
      <div className="text-brown-600 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}
