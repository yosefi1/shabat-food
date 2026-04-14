import type { Metadata } from "next";
import LegalDraftBanner from "@/components/LegalDraftBanner";

export const metadata: Metadata = {
  title: "מדיניות ביטולים והחזרות",
  description: "מדיניות הביטולים וההחזרות של תורגיי — זכויות ביטול, החזר כספי, ומוצרים פגומים.",
};

/*
 * LEGAL DISCLAIMER: Template — requires attorney review before publication.
 *
 * Key reference:
 *   - תקנות הגנת הצרכן (ביטול עסקה) תשע"א-2010
 *   - Note: This policy is for B2B transactions. Consumer cancellation rights
 *     under the 2010 regulations may not fully apply to business customers,
 *     but it is safest to grant similar rights until clarified by counsel.
 */

export default function RefundPage() {
  const lastUpdated  = "אפריל 2026";
  const contactEmail = "hello@shabbatfood.co.il";
  const contactPhone = "050-000-0000";

  return (
    <article className="prose prose-brown max-w-none" dir="rtl">
      <LegalDraftBanner text="דף זה הוא תבנית שדורשת בדיקת עורך דין לפני פרסום. הפריטים המסומנים ב-[סמן כאן] דורשים מילוי פרטים ספציפיים." />


      <h1 className="text-3xl font-black text-brown-900 mb-2">מדיניות ביטולים והחזרות</h1>
      <p className="text-brown-400 text-sm mb-8">עדכון אחרון: {lastUpdated}</p>

      <Section title="1. ביטול לפני הכנת ההזמנה">
        <p>
          ניתן לבטל הזמנה <strong>ללא עלות</strong> עד <strong>48 שעות לפני מועד המשלוח</strong>,
          בתנאי שההכנה טרם החלה.
        </p>
        <ul>
          <li>ביטול עד 48 שעות לפני — החזר מלא</li>
          <li>ביטול 24–48 שעות לפני — החזר של [סמן כאן: XX%] מסכום ההזמנה</li>
          <li>ביטול פחות מ-24 שעות לפני — [סמן כאן: ללא החזר / החזר חלקי]</li>
        </ul>
        <p>
          לביטול, פנה אלינו בטלפון {contactPhone} או באימייל {contactEmail}.
        </p>
      </Section>

      <Section title="2. ביטול לאחר קבלת ההזמנה — מוצרי מזון">
        <p>
          בשל אופיים של מוצרי מזון מוכן (סחורה פסידה), <strong>לא ניתן להחזיר מוצרים
          שנמסרו ונמצאים במצב תקין</strong>, אלא אם מדובר בפגם שנגרם על ידי ספק.
        </p>
        <p>
          <strong>חריגים:</strong> החזר או החלפה יינתנו אם:
        </p>
        <ul>
          <li>המוצר הגיע פגום, שבור, או מקולקל</li>
          <li>המוצר שגוי (סופק מוצר שונה מזה שהוזמן)</li>
          <li>המוצר מכיל אלרגן שצוין במפורש בבקשת הביטול בעת ההזמנה</li>
        </ul>
      </Section>

      <Section title="3. אופן הגשת תלונה על מוצר">
        <p>
          יש לדווח על מוצר פגום <strong>תוך 2 שעות מרגע הקבלה</strong>, עם:
        </p>
        <ul>
          <li>תמונות ברורות של הפגם</li>
          <li>מספר הזמנה</li>
          <li>תיאור הבעיה</li>
        </ul>
        <p>
          שלח לאימייל {contactEmail} או לנייד {contactPhone}.
          נטפל בפנייה בתוך יום עסקים אחד.
        </p>
      </Section>

      <Section title="4. אופן ביצוע ההחזר הכספי">
        <ul>
          <li>החזר יבוצע לאמצעי התשלום שבו שולמה ההזמנה.</li>
          <li>זמן עיבוד ההחזר: עד [סמן כאן: 14] ימי עסקים ממועד האישור.</li>
          <li>עמלת ביטול (אם חלה): תנוכה מסכום ההחזר.</li>
        </ul>
      </Section>

      <Section title="5. זכויות צרכן על פי חוק">
        <p>
          בהתאם לתקנות הגנת הצרכן (ביטול עסקה) תשע&quot;א-2010, לקוחות העסקה
          הם עסקים ולפיכך הוראות הביטול הצרכניות אינן חלות בהכרח. עם זאת,
          תורגיי מחויבת לנהל יחסים הוגנים עם לקוחותיה.
          [סמן כאן: יש לוודא עם עורך דין מה חל על לקוחות עסקיים ספציפית.]
        </p>
      </Section>

      <Section title="צור קשר">
        <p>
          לכל שאלה בנוגע לביטולים והחזרות:{" "}
          <a href={`mailto:${contactEmail}`} className="text-amber-600 hover:underline">
            {contactEmail}
          </a>{" "}
          | {contactPhone}
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
