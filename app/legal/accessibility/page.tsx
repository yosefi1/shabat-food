import type { Metadata } from "next";
import LegalDraftBanner from "@/components/LegalDraftBanner";

export const metadata: Metadata = {
  title: "הצהרת נגישות",
  description: "הצהרת הנגישות של תורגיי — מחויבות לנגישות דיגיטלית לפי תקן WCAG 2.0 AA.",
};

/*
 * ACCESSIBILITY STATEMENT — Required by Israeli law for websites.
 *
 * The Israeli Equal Rights for Persons with Disabilities Law (5758-1998)
 * and the Accessibility Regulations (Service Accessibility Adjustments, 5773-2013)
 * require organizations to make their digital services accessible.
 *
 * Target standard: WCAG 2.0 Level AA (Israeli standard references WCAG 2.0).
 * A formal accessibility audit by a certified expert is required before launch.
 *
 * LEGAL REVIEW REQUIRED: Have an Israeli accessibility expert (מורשה נגישות)
 * audit the site and update this statement with actual audit results.
 */

export default function AccessibilityPage() {
  const lastAudit    = "לא בוצע — דרוש לפני השקה";
  const contactEmail = "hello@turgi.co.il";
  const contactPhone = "050-000-0000";

  return (
    <article className="prose prose-brown max-w-none" dir="rtl">
      <LegalDraftBanner text="דף זה הוא תבנית שדורשת בדיקת עורך דין לפני פרסום. הפריטים המסומנים ב-[סמן כאן] דורשים מילוי פרטים ספציפיים." />


      <h1 className="text-3xl font-black text-brown-900 mb-2">הצהרת נגישות</h1>
      <p className="text-brown-400 text-sm mb-8">ביקורת נגישות אחרונה: {lastAudit}</p>

      <Section title="מחויבות הנגישות שלנו">
        <p>
          תורגיי מחויבת להנגשת שירותיה הדיגיטליים לכלל המשתמשים, לרבות אנשים עם
          מוגבלויות. אנו שואפים לעמוד בדרישות תקן WCAG 2.0 ברמת התאמה AA, כנדרש
          בחוק שוויון זכויות לאנשים עם מוגבלות (תשנ&quot;ח-1998) ובתקנות הנגישות לשירות.
        </p>
      </Section>

      <Section title="רמת התאמה">
        <p>
          אתר זה שואף לרמת התאמה <strong>WCAG 2.0 AA</strong>.
        </p>
        <p>
          <strong>סטטוס נוכחי:</strong> הנגשה חלקית. בוצעה הנגשה טכנית בסיסית,
          אך טרם בוצעה ביקורת מלאה על ידי מורשה נגישות.
        </p>
      </Section>

      <Section title="פעולות הנגישות שבוצעו">
        <ul>
          <li>
            <strong>מבנה סמנטי:</strong> שימוש בתגיות HTML סמנטיות
            (<code>header</code>, <code>main</code>, <code>nav</code>, <code>footer</code>,
            <code>section</code>, <code>article</code>) לארגון נכון של התוכן.
          </li>
          <li>
            <strong>כותרות:</strong> היררכיית כותרות ברורה (H1 → H2 → H3) בכל עמוד.
          </li>
          <li>
            <strong>ניווט מקלדת:</strong> כל הפעולות האינטראקטיביות נגישות דרך מקלדת.
            קיים קישור &quot;דלג לתוכן הראשי&quot; בראש כל עמוד.
          </li>
          <li>
            <strong>מיקוד נראה:</strong> כל אלמנטים אינטראקטיביים מציגים מחוון מיקוד
            ברור בעת ניווט במקלדת.
          </li>
          <li>
            <strong>תוויות טפסים:</strong> לכל שדה טופס יש תווית (<code>label</code>)
            מקושרת. שדות חובה מסומנים ומוכרזים.
          </li>
          <li>
            <strong>הודעות שגיאה:</strong> שגיאות טופס מוצגות בסמוך לשדה הרלוונטי
            ומוכרזות למסייעי קריאה (role=&quot;alert&quot;).
          </li>
          <li>
            <strong>תמונות:</strong> תמונות דקורטיביות מסומנות כ-alt=&quot;&quot;.
            תמונות תוכן כוללות תיאור alt.
          </li>
          <li>
            <strong>כיוון RTL:</strong> האתר מעוצב לשפה העברית מימין לשמאל באמצעות
            <code>dir=&quot;rtl&quot;</code> ו-<code>lang=&quot;he&quot;</code>.
          </li>
          <li>
            <strong>ריספונסיביות:</strong> האתר מותאם למגוון גדלי מסך ומכשירים.
          </li>
          <li>
            <strong>ניגודיות צבעים:</strong> צבעי הטקסט הראשיים עומדים ביחס ניגודיות
            של לפחות 4.5:1 כנדרש ב-WCAG 2.0 AA.
          </li>
          <li>
            <strong>ARIA:</strong> שימוש ב-ARIA roles ו-labels רק בהכרח, כנדרש.
          </li>
        </ul>
      </Section>

      <Section title="מגבלות נגישות ידועות">
        <ul>
          <li>
            <strong>תמונות מוצרים מ-Unsplash:</strong> חלק מהתמונות עשויות להיות
            תמונות מלאות ללא תיאור מפורט. שיפור בתכנון.
          </li>
          <li>
            <strong>אנימציות:</strong> האתר כולל אנימציות כניסה. טרם הוטמע
            <code>prefers-reduced-motion</code> — בתכנון לגרסה הבאה.
          </li>
          <li>
            <strong>שפה:</strong> האתר זמין בעברית בלבד כרגע.
          </li>
          <li>
            <strong>ביקורת מלאה:</strong> טרם בוצעה ביקורת נגישות מלאה על ידי
            מומחה מוסמך — נדרש לפני השקה רשמית.
          </li>
        </ul>
      </Section>

      <Section title="טכנולוגיות עזר נבדקות">
        <p>האתר נבדק (בצורה חלקית) עם:</p>
        <ul>
          <li>ניווט מקלדת בלבד</li>
          <li>Chrome DevTools Accessibility Audit</li>
        </ul>
        <p className="text-amber-700 font-medium">
          <strong>בתכנון:</strong> בדיקה עם NVDA / VoiceOver לפני השקה.
        </p>
      </Section>

      <Section title="פנו אלינו בנושאי נגישות">
        <p>
          אם נתקלתם בבעיית נגישות באתר, אנו מעוניינים לשמוע. פנו אלינו:
        </p>
        <ul>
          <li>
            <strong>אימייל:</strong>{" "}
            <a href={`mailto:${contactEmail}`} className="text-amber-600 hover:underline">
              {contactEmail}
            </a>
          </li>
          <li><strong>טלפון:</strong> {contactPhone}</li>
          <li><strong>שעות מענה:</strong> ראשון–חמישי 09:00–17:00</li>
        </ul>
        <p>נשיב בתוך 5 ימי עסקים ונשאף לטפל בבעיה בהקדם.</p>
      </Section>

      <Section title="גורם אחראי לנגישות">
        <p>
          [סמן כאן: שם הגורם האחראי לנגישות בארגון — חובה על פי תקנות הנגישות]<br />
          תפקיד: [תפקיד]<br />
          אימייל: {contactEmail}
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
