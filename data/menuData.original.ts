import { MenuItem, Category } from "@/types";

export const categories: Category[] = [
  { id: "all",      name: "הכל",            emoji: "🍽️" },
  { id: "challah",  name: "חלות",           emoji: "🍞" },
  { id: "salads",   name: "סלטים",          emoji: "🥗" },
  { id: "mains",    name: "מנות עיקריות",   emoji: "🍗" },
  { id: "sides",    name: "תוספות",         emoji: "🥦" },
  { id: "desserts", name: "קינוחים",        emoji: "🍰" },
];

export const menuItems: MenuItem[] = [
  /* ── CHALLAH ── */
  {
    id: "ch-1",
    name: "חלה שבת קלאסית",
    description: "חלה קלועה מסורתית, אפויה טרייה, בניחוח נפלא — מושלמת לשולחן השבת",
    price: 35,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
    category: "challah",
    badge: "bestseller",
  },
  {
    id: "ch-2",
    name: "חלה שוקולד ואגוזי מלך",
    description: "חלה מתוקה ועשירה ממולאת שוקולד בלגי ואגוזים קלויים — חגיגית ומיוחדת",
    price: 48,
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80",
    category: "challah",
    badge: "new",
  },
  {
    id: "ch-3",
    name: "חלה קמח מלא שומשום",
    description: "חלה בריאה מקמח מלא עם ציפוי גרעיני שומשום, קראנצ'ית ומזינה",
    price: 38,
    image: "https://images.unsplash.com/photo-1548365328-8c6db3220e4c?w=600&q=80",
    category: "challah",
  },

  /* ── SALADS ── */
  {
    id: "sl-1",
    name: "סלט ירקות ישראלי",
    description: "עגבניות, מלפפון, בצל ופלפל חתוכים דק עם שמן זית ולימון טרי",
    price: 28,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
    category: "salads",
  },
  {
    id: "sl-2",
    name: "חומוס ביתי קטיפתי",
    description: "חומוס על בסיס גרגרי חומוס מבושלים, טחינה מובחרת, שמן זית ופלפל",
    price: 25,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80",
    category: "salads",
    badge: "popular",
  },
  {
    id: "sl-3",
    name: "טאבולה לבנטינית",
    description: "בורגול, פטרוזיליה טרייה, עגבניות, בצל ירוק ונענע עם תיבול לימוני",
    price: 30,
    image: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=600&q=80",
    category: "salads",
  },
  {
    id: "sl-4",
    name: "סלט גזר מרוקאי",
    description: "גזר מבושל עם כמון, פפריקה, שום וכוסברה — מתכון משפחתי סודי",
    price: 22,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80",
    category: "salads",
  },

  /* ── MAINS ── */
  {
    id: "mn-1",
    name: "עוף צלוי בתנור",
    description: "חצאי עוף מתובלים בשמן זית, שום ועשבי תיבול, צלויים לזהוב מושלם",
    price: 85,
    image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c9?w=600&q=80",
    category: "mains",
    badge: "bestseller",
  },
  {
    id: "mn-2",
    name: "צלי בקר בסיר",
    description: "כתף עגל עסיסית ורכה מבושלת לאט עם ירקות שורש ויין אדום",
    price: 110,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
    category: "mains",
  },
  {
    id: "mn-3",
    name: "דג מרוקאי בתנור",
    description: "דג דניס שלם על מצע עגבניות, פלפלים וכוסברה עם תיבול מרוקאי",
    price: 95,
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80",
    category: "mains",
    badge: "new",
  },
  {
    id: "mn-4",
    name: "מרק עוף ביתי",
    description: "מרק עוף עשיר עם ירקות טריים, פסטה ואטריות — כמו אצל סבתא",
    price: 45,
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80",
    category: "mains",
  },

  /* ── SIDES ── */
  {
    id: "sd-1",
    name: "אורז עם אטריות",
    description: "אורז פירורי מושלם עם אטריות מטוגנות זהובות — מלווה אידיאלי לכל מנה",
    price: 25,
    image: "https://images.unsplash.com/photo-1536304993881-ff86e0c9e65b?w=600&q=80",
    category: "sides",
  },
  {
    id: "sd-2",
    name: "קוסקוס ירקות",
    description: "קוסקוס פריך עם תבשיל ירקות עונתיים ועוף עשיר — מורשת צפון אפריקה",
    price: 35,
    image: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=600&q=80",
    category: "sides",
  },
  {
    id: "sd-3",
    name: "ירקות צלויים בתנור",
    description: "שלל ירקות עונתיים צלויים עם שמן זית, שום ועשבי תיבול",
    price: 30,
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80",
    category: "sides",
  },

  /* ── DESSERTS ── */
  {
    id: "ds-1",
    name: "עוגת שוקולד לח",
    description: "עוגה עשירה ולחה עם שוקולד בלגי, מוגשת עם אבקת סוכר וקצפת",
    price: 55,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80",
    category: "desserts",
    badge: "popular",
  },
  {
    id: "ds-2",
    name: "בורקס גבינה ביתי",
    description: "בורקס פריך ממולא גבינת פטה קרמי, אפוי בתנור עד להשחמה מושלמת",
    price: 15,
    image: "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=600&q=80",
    category: "desserts",
  },
];
