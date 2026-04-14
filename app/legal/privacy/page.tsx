import type { Metadata } from "next";
import LegalDraftBanner from "@/components/LegalDraftBanner";

export const metadata: Metadata = {
  title: "מדיניות פרטיות",
  description: "מדיניות הפרטיות של תורגיי — כיצד אנו אוספים, משתמשים ומגנים על המידע האישי שלך.",
};

/*
 * LEGAL DISCLAIMER:
 * This is a TEMPLATE privacy policy. It must be reviewed and approved by
 * a qualified Israeli attorney before publication, especially regarding:
 *   - Israeli Privacy Protection Law 5741-1981 and its regulations
 *   - Israeli Privacy Protection Regulations (Data Security) 5777-2017
 *   - If EU customers are served: GDPR compliance
 * Placeholder items are marked with [סמן כאן].
 */

export default function PrivacyPage() {
  const lastUpdated = "אפריל 2026";
  const businessName = "תורגיי";
  const contactEmail = "hello@turgi.co.il";
  const contactPhone = "050-000-0000";

  return (
    <article className="prose prose-brown max-w-none" dir="rtl">
      <LegalDraftBanner text="דף זה הוא תבנית שדורשת בדיקת עורך דין לפני פרסום. הפריטים המסומנים ב-[סמן כאן] דורשים מילוי פרטים ספציפיים." />


      <h1 className="text-3xl font-black text-brown-900 mb-2">מדיניות פרטיות</h1>
      <p className="text-brown-400 text-sm mb-8">עדכון אחרון: {lastUpdated}</p>

      <Section title="1. מי אנחנו">
        <p>
          {businessName} [סמן כאן: ח.פ / ע.מ XXXXXXXX] מפעיל את אתר האינטרנט
          המצוי בכתובת [כתובת האתר]. אנו עוסקים במכירה ומשלוח של אוכל מוכן
          ללקוחות עסקיים.
        </p>
        <p>
          לפניות בנושאי פרטיות ניתן לפנות אלינו:<br />
          <strong>אימייל:</strong> {contactEmail}<br />
          <strong>טלפון:</strong> {contactPhone}
        </p>
      </Section>

      <Section title="2. אילו נתונים אנו אוספים">
        <p>אנו אוספים רק את הנתונים הנחוצים לביצוע ההזמנה:</p>
        <table className="w-full text-sm border-collapse mb-4">
          <thead>
            <tr className="bg-brown-50">
              <th className="border border-brown-200 px-3 py-2 text-right">סוג המידע</th>
              <th className="border border-brown-200 px-3 py-2 text-right">מטרה</th>
              <th className="border border-brown-200 px-3 py-2 text-right">בסיס חוקי</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["שם מלא", "זיהוי הלקוח ומשלוח", "ביצוע חוזה"],
              ["מספר טלפון", "תיאום משלוח ואישור הזמנה", "ביצוע חוזה"],
              ["כתובת אימייל", "שליחת אישור הזמנה", "ביצוע חוזה"],
              ["כתובת משלוח", "ביצוע המשלוח", "ביצוע חוזה"],
              ["פרטי הזמנה", "עיבוד ההזמנה ושמירת רישום", "התחייבות חוקית"],
              ["כתובת IP (לרישום אבטחה)", "מניעת הונאה", "אינטרס לגיטימי"],
            ].map(([type, purpose, legal]) => (
              <tr key={type}>
                <td className="border border-brown-200 px-3 py-2 font-medium">{type}</td>
                <td className="border border-brown-200 px-3 py-2">{purpose}</td>
                <td className="border border-brown-200 px-3 py-2 text-brown-500">{legal}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-brown-500 text-sm">
          <strong>אנו לא אוספים:</strong> פרטי כרטיס אשראי (מעובדים ישירות על ידי שער
          התשלומים), מידע בריאותי, או כל מידע שאינו נחוץ לביצוע ההזמנה.
        </p>
      </Section>

      <Section title="3. כיצד אנו משתמשים במידע">
        <ul>
          <li>ביצוע ומשלוח ההזמנה</li>
          <li>שליחת אישור הזמנה באימייל</li>
          <li>תיאום מועד המשלוח</li>
          <li>טיפול בבעיות שירות לקוחות</li>
          <li>עמידה בדרישות חוקיות ורגולטוריות</li>
          <li>אבטחת המערכת ומניעת הונאה</li>
        </ul>
        <p>
          <strong>אנו לא משתמשים במידע שלך לשיווק ללא הסכמה מפורשת.</strong>
        </p>
      </Section>

      <Section title="4. שמירת המידע">
        <p>
          פרטי הזמנות נשמרים ל-[סמן כאן: 7 שנים] בהתאם לדרישות חוקי הנהלת חשבונות
          ומע&quot;מ בישראל. לאחר מכן, הנתונים נמחקים או מאונימיזם.
        </p>
      </Section>

      <Section title="5. שיתוף מידע עם צדדים שלישיים">
        <p>אנו עשויים לשתף מידע עם:</p>
        <ul>
          <li><strong>שירות שיגור אימייל</strong> (לשליחת אישורי הזמנה) — [סמן כאן: שם הספק]</li>
          <li><strong>שער תשלומים</strong> — [סמן כאן: שם שער התשלומים] לעיבוד תשלום</li>
          <li><strong>שירות אחסון אתר</strong> — Vercel Inc. לאחסון האתר</li>
          <li><strong>גורמי חוק</strong> — רק כאשר קיימת חובה חוקית</li>
        </ul>
        <p>
          <strong>אנו לא מוכרים, משכירים, או סוחרים במידע אישי של לקוחות.</strong>
        </p>
      </Section>

      <Section title="6. אחסון ואבטחת מידע">
        <p>
          האתר פועל תחת HTTPS. בקשות מוגנות מפני התקפות XSS, CSRF, והחדרת קוד.
          הגישה למסד הנתונים [סמן כאן: פרט על הגנות שרת] מוגבלת לצוות מורשה בלבד.
        </p>
        <p>
          עם זאת, אין מערכת ממוחשבת שיכולה להבטיח אבטחה מוחלטת. נחזיר לך הודעה
          בהקדם האפשרי אם נגלה פרצת אבטחה המשפיעה על נתוניך, בהתאם לחובות
          הדיווח בחוק הישראלי.
        </p>
      </Section>

      <Section title="7. עוגיות ו-LocalStorage">
        <p>האתר משתמש ב-<strong>LocalStorage בדפדפן בלבד</strong> (לא עוגיות שרת) לצורך:</p>
        <ul>
          <li>שמירת עגלת הקניות — מנגנון פונקציונלי הכרחי, פוקע בניקוי הדפדפן</li>
          <li>שמירת העדפת הסכמת הפרטיות</li>
        </ul>
        <p>
          <strong>אנו לא משתמשים בעוגיות מעקב, ניתוח, או שיווק.</strong>{" "}
          אם בעתיד יתווספו כאלה, מדיניות זו תעודכן ותוצג בקשת הסכמה.
        </p>
      </Section>

      <Section title="8. זכויותיך">
        <p>בהתאם לחוק הגנת הפרטיות (תשמ&quot;א-1981) ולתקנותיו, יש לך זכות:</p>
        <ul>
          <li><strong>לעיין</strong> במידע האישי שנשמר אודותיך</li>
          <li><strong>לתקן</strong> מידע שגוי</li>
          <li><strong>למחוק</strong> את המידע שלך (בכפוף לחובות שמירה חוקיות)</li>
          <li><strong>להתנגד</strong> לעיבוד מסוים</li>
        </ul>
        <p>
          לממש זכויות אלו, פנה אלינו בכתב לכתובת: {contactEmail}
          <br />
          נשיב בתוך 30 ימי עסקים.
        </p>
      </Section>

      <Section title="9. תלונות">
        <p>
          אם לדעתך הפרנו את חוק הגנת הפרטיות, תוכל לפנות ל
          <strong>הרשות להגנת הפרטיות</strong> במשרד המשפטים:
          <br />
          <a href="https://www.gov.il/he/departments/topics/privacyprotection" className="text-amber-600 hover:underline">
            www.gov.il — הרשות להגנת הפרטיות
          </a>
        </p>
      </Section>

      <Section title="10. עדכונים למדיניות זו">
        <p>
          אנו עשויים לעדכן מדיניות זו מעת לעת. שינויים מהותיים יפורסמו באתר
          ויישלח אימייל ללקוחות רשומים. שימוש מתמשך באתר לאחר עדכון מהווה הסכמה
          למדיניות המעודכנת.
        </p>
      </Section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-brown-900 mb-3 pb-2 border-b border-brown-100">
        {title}
      </h2>
      <div className="text-brown-600 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}
