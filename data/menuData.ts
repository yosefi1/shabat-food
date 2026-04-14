import { MenuItem, Category } from "@/types";

/*
 * DATA STORAGE — CURRENT & FUTURE
 * ────────────────────────────────
 * Now  : Static TypeScript file — zero infrastructure, instant Vercel deploys.
 *        Prices are 0 (displayed as "??") until finalised.
 *
 * Later (pick one when ready):
 *   • Supabase  — Postgres table + Storage for images; full admin dashboard
 *   • Google Sheets → API route — easiest for non-dev price editing
 *   • Sanity / Contentful CMS — if rich content management is needed
 *
 * ITEM ORDER: verified against the PDF price column which lists prices in the
 * same sequence as items, confirming exact reading order for every section.
 *   • Salads  / Stuffed — RTL two-column layout → right column first
 *   • All other sections — single column, natural PDF extraction order
 */

export const categories: Category[] = [
  { id: "all",       name: "הכל",              emoji: "🍽️" },
  { id: "salads",    name: "סלטים",            emoji: "🥗"  },
  { id: "stuffed",   name: "ממולאים",          emoji: "🫑"  },
  { id: "sides",     name: "תוספות",           emoji: "🍚"  },
  { id: "cookedveg", name: "ירקות מבושלים",    emoji: "🥦"  },
  { id: "veggie",    name: "צמחוני",           emoji: "🌿"  },
  { id: "fried",     name: "מטוגנים",          emoji: "🍳"  },
  { id: "fish",      name: "דגים",             emoji: "🐟"  },
  { id: "meat",      name: "מנות בשר",         emoji: "🥩"  },
  { id: "chicken",   name: "מנות עוף",         emoji: "🍗"  },
];

/* ─────────── IMAGE CONSTANTS ─────────── */
const IMG = {
  salad:        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
  hummus:       "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80",
  tabbouleh:    "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=600&q=80",
  carrot:       "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80",
  beet:         "https://images.unsplash.com/photo-1546069901-5ec6a79120b0?w=600&q=80",
  eggplant:     "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80",
  olives:       "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&q=80",
  pasta:        "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600&q=80",
  potato:       "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=80",
  sweetPotato:  "https://images.unsplash.com/photo-1576337830398-ecc5e1dcaf11?w=600&q=80",
  stuffedPepper:"https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&q=80",
  pastry:       "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  soup:         "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80",
  rice:         "https://images.unsplash.com/photo-1536304993881-ff86e0c9e65b?w=600&q=80",
  couscous:     "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=600&q=80",
  roastedVeg:   "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80",
  fritters:     "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
  schnitzel:    "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=600&q=80",
  fishFillet:   "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80",
  salmon:       "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80",
  roastMeat:    "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
  meatStew:     "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
  kebab:        "https://images.unsplash.com/photo-1529694157872-4e0c0f3b238b?w=600&q=80",
  meatballs:    "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&q=80",
  chicken:      "https://images.unsplash.com/photo-1598103442097-8b74394b95c9?w=600&q=80",
  stirFry:      "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80",
};

export const menuItems: MenuItem[] = [

  /* ══════════════════════════════════════════
     סלטים  •  SALADS
     RTL two-column layout — right column first, then left column.
     Verified: price list starts at ₪27 (חומוס ביתי) → ends at ₪29 (חציל בציפוי פירורי לחם).
     Right col (PDF lines 22-35 + 76-89): חומוס ביתי … סלט קינואה
     Left  col (PDF lines 10-21):          שורש סלרי … חציל בציפוי פירורי לחם
  ══════════════════════════════════════════ */

  { id:"sl-13", name:"חומוס ביתי",
    description:"חומוס קטיפתי ביתי עם טחינה מובחרת, שמן זית ופלפל — אמיתי וטרי",
    price:0, image:IMG.hummus, category:"salads", badge:"bestseller" },

  { id:"sl-14", name:"טחינה ירוקה",
    description:"טחינה גולמית מובחרת מעורבת פטרוזיליה ועשבי תיבול ירוקים טריים",
    price:0, image:IMG.hummus, category:"salads" },

  { id:"sl-15", name:"סלק מבושל",
    description:"סלק מבושל לשלמות ומתובל בעדינות — מתוק, עשיר וצבעוני",
    price:0, image:IMG.beet, category:"salads" },

  { id:"sl-16", name:"סלק חי וסלרי",
    description:"סלק גרוס טרי עם ניחוח סלרי מרענן — בריא, צבעוני וקליל",
    price:0, image:IMG.beet, category:"salads" },

  { id:"sl-17", name:"גזר מבושל",
    description:"גזר מבושל בתיבול עדין של כמון ולימון — מתוק ורך",
    price:0, image:IMG.carrot, category:"salads" },

  { id:"sl-18", name:"גזר מגורד",
    description:"גזר גרוס טרי עם תיבול קליל ועשבי תיבול ירוקים — מרענן ובריא",
    price:0, image:IMG.carrot, category:"salads" },

  { id:"sl-19", name:"טבולה",
    description:"פטרוזיליה טרייה עם בורגול, עגבניות, לימון ושמן זית — מסורתי ומרענן",
    price:0, image:IMG.tabbouleh, category:"salads", badge:"popular" },

  { id:"sl-20", name:"כרוב לבן בתחמיץ",
    description:"כרוב לבן פרוס דק בציר חמצמץ ביתי — קלאסיקה שלא משתנה",
    price:0, image:IMG.salad, category:"salads" },

  { id:"sl-21", name:"כרוב לבן במיונז",
    description:"כרוב לבן קרמי ברוטב מיונז עשיר — קולסלו ביתי אהוב",
    price:0, image:IMG.salad, category:"salads" },

  { id:"sl-22", name:"כרוב לבן עם חמוציות ושמיר",
    description:"כרוב לבן עם חמוציות אדומות ושמיר ירוק — צבעוני, מרענן ומיוחד",
    price:0, image:IMG.salad, category:"salads", badge:"new" },

  { id:"sl-23", name:"כרוב אדום במיונז",
    description:"כרוב אדום קרמי ברוטב מיונז — ייחודי, עשיר בצבע ובטעם",
    price:0, image:IMG.salad, category:"salads" },

  { id:"sl-24", name:"חציל יווני",
    description:"חציל מבושל בסגנון יווני עם שום, לימון ועשבי תיבול מדיטרניים",
    price:0, image:IMG.eggplant, category:"salads" },

  { id:"sl-25", name:"סלט ירקות",
    description:"ירקות טריים קצוצים עם שמן זית ולימון — פשוט, טרי ורענן",
    price:0, image:IMG.salad, category:"salads" },

  { id:"sl-26", name:"חסה שרי נבטים",
    description:"עלי חסה ירוקים עם עגבניות שרי ונבטים טריים — קל ומרענן",
    price:0, image:IMG.salad, category:"salads" },

  { id:"sl-27", name:"חציל מרוקאי",
    description:"חציל מבושל בסגנון מרוקאי עם פפריקה, כמון וכוסברה — ריחני ועשיר",
    price:0, image:IMG.eggplant, category:"salads", badge:"popular" },

  { id:"sl-28", name:"חציל במיונז",
    description:"חציל אפוי מוקרם ברוטב מיונז קטיפתי — עשיר, חלק ומנחם",
    price:0, image:IMG.eggplant, category:"salads" },

  { id:"sl-29", name:"חציל בטחינה",
    description:"חציל אפוי מעושן עם טחינה גולמית — בסגנון מסורתי ואותנטי",
    price:0, image:IMG.eggplant, category:"salads" },

  { id:"sl-30", name:"חציל פיקנטי",
    description:"חציל בתיבול חריף ומעורר — בשביל אוהבי הטעמים האמיצים והחזקים",
    price:0, image:IMG.eggplant, category:"salads" },

  { id:"sl-31", name:"חציל סיני",
    description:"חציל מוקפץ בסגנון מזרח אסייתי עם רוטב עשיר וטעמים מיוחדים",
    price:0, image:IMG.eggplant, category:"salads", badge:"new" },

  { id:"sl-32", name:"מטבוחה מרוקאית",
    description:"רוטב עגבניות ופלפלים מבושל לאט בתיבול מרוקאי מסורתי — ביתי ועמוק",
    price:0, image:IMG.roastedVeg, category:"salads", badge:"popular" },

  { id:"sl-33", name:"חמוצי הבית",
    description:"ירקות כבושים ביתיים מסורתיים — קריספי, חמצמץ ומרענן",
    price:0, image:IMG.olives, category:"salads" },

  { id:"sl-34", name:"בטטה בצ'ילי מתוק",
    description:"בטטה אפויה רכה עם ציפוי צ'ילי מתוק מגרה — מתוק, חריף וקסום",
    price:0, image:IMG.sweetPotato, category:"salads" },

  { id:"sl-35", name:"שרי עם פסטו",
    description:"עגבניות שרי טריות עם רוטב פסטו ריחני — איטלקי ביתי ומרענן",
    price:0, image:IMG.salad, category:"salads" },

  { id:"sl-36", name:"פלפל קלוי",
    description:"פלפלים קלויים שלמים עם שמן זית ושום — מתוק, עשיר ועמוק בטעם",
    price:0, image:IMG.roastedVeg, category:"salads", badge:"popular" },

  { id:"sl-37", name:"פלפל חריף מטוגן",
    description:"פלפלים חריפים מטוגנים — חריפות מהנה עם אופי ועוצמה",
    price:0, image:IMG.roastedVeg, category:"salads" },

  { id:"sl-38", name:"סלט ירוק עם חמוציות",
    description:"ירקות ירוקים טריים עם חמוציות אדומות ותיבול לימוני קליל",
    price:0, image:IMG.salad, category:"salads" },

  { id:"sl-39", name:"סלט פסטה",
    description:"פסטה קרה עם ירקות, שמן זית ועשבי תיבול ריחניים — קל ומרענן",
    price:0, image:IMG.pasta, category:"salads" },

  { id:"sl-40", name:"סלט קינואה",
    description:"קינואה מבושלת עם ירקות מגוונים ורוטב לימוני מרענן — בריא ומזין",
    price:0, image:IMG.pasta, category:"salads", badge:"new" },

  /* ── left column (PDF lines 10-21) ── */
  { id:"sl-01", name:"שורש סלרי ומיונז",
    description:"שורש סלרי פרוס דק עם רוטב מיונז קרמי — קלאסיקה מרעננת ומסורתית",
    price:0, image:IMG.salad, category:"salads" },

  { id:"sl-02", name:'תפו"א במיונז',
    description:"תפוחי אדמה מבושלים ורכים ברוטב מיונז עשיר וקרמי — סלט אהוב תמיד",
    price:0, image:IMG.potato, category:"salads", badge:"popular" },

  { id:"sl-03", name:"מלפפון בשמיר",
    description:"מלפפון פרוס טרי עם שמיר ריחני ותיבול קליל ומרענן",
    price:0, image:IMG.salad, category:"salads" },

  { id:"sl-04", name:"סלט עדשים שחורים וירק",
    description:"עדשים שחורות מבושלות עם ירקות טריים ותיבול לימוני מרענן",
    price:0, image:IMG.tabbouleh, category:"salads" },

  { id:"sl-05", name:"סלט קישואים בתחמיץ",
    description:"קישואים פרוסים דק בציר חמצמץ עדין — קליל ועשיר בטעם",
    price:0, image:IMG.salad, category:"salads" },

  { id:"sl-06", name:"סלט זיתים מבושלים",
    description:"זיתים מבושלים בתיבולים מסורתיים — עשיר, סמיך ועמוק בטעם",
    price:0, image:IMG.olives, category:"salads" },

  { id:"sl-07", name:"סלט ארטישוק עם בצל סגול ופלפל קלוי",
    description:"לבבות ארטישוק עם בצל סגול מתוק ופלפלים קלויים — יפה ומיוחד",
    price:0, image:IMG.roastedVeg, category:"salads", badge:"new" },

  { id:"sl-08", name:"סלט פטריות מוקפצות בטריאקי",
    description:"פטריות טריות מוקפצות ברוטב טריאקי יפני — ייחודי, טעים ומפתיע",
    price:0, image:IMG.stirFry, category:"salads", badge:"new" },

  { id:"sl-09", name:"אצבעות סלק גזר וקולרבי בתחמיץ",
    description:"מקלות ירקות צבעוניים כבושים בציר חמצמץ ביתי — קריספי ומרענן",
    price:0, image:IMG.carrot, category:"salads" },

  { id:"sl-10", name:"סחוג",
    description:"ממרח חריף מסורתי עם עגבניות, כוסברה ושמן זית — הכי אותנטי שיש",
    price:0, image:IMG.salad, category:"salads", badge:"popular" },

  { id:"sl-11", name:"כבד קצוץ",
    description:"כבד עוף קצוץ ביתי עם בצל מקורמל — מתכון משפחתי קלאסי ועשיר",
    price:0, image:IMG.meatballs, category:"salads" },

  { id:"sl-12", name:"חציל בציפוי פירורי לחם",
    description:"פרוסות חציל קריספיות בציפוי פירורי לחם זהוב ופריך — מנה מנחמת",
    price:0, image:IMG.eggplant, category:"salads" },

  /* ══════════════════════════════════════════
     ממולאים  •  STUFFED
     RTL two-column layout — right column first.
     Verified: price ₪60 → עלי גפן (right col first), ends ₪80 → פסטייה (left col last).
     Right col (PDF lines 128-140): עלי גפן … מנגולד ממולא
     Left  col (PDF lines 116-127): פלפל שושקה … פסטייה מרוקאית
  ══════════════════════════════════════════ */

  { id:"st-13", name:"עלי גפן ממולאים באורז וירק",
    description:"עלי גפן עדינים ממולאים אורז וירקות — צמחוני, מסורתי ומיוחד",
    price:0, image:IMG.roastedVeg, category:"stuffed", badge:"popular" },

  { id:"st-14", name:"בצל ממולא באורז ועגבניות",
    description:"בצל שלם ממולא אורז ועגבניות מבושל — עדין בטעם ומיוחד בהגשה",
    price:0, image:IMG.stuffedPepper, category:"stuffed" },

  { id:"st-15", name:"כרוב ממולא באורז ועגבניות",
    description:"עלי כרוב ממולאים אורז ועגבניות ברוטב עגבניות — צמחוני וקלאסי",
    price:0, image:IMG.stuffedPepper, category:"stuffed" },

  { id:"st-16", name:"קישוא ממולא באורז ועגבניות",
    description:"קישוא ממולא אורז ועגבניות — קל, מרענן ומבושל בעדינות",
    price:0, image:IMG.stuffedPepper, category:"stuffed" },

  { id:"st-17", name:"פלפל ממולא באורז ועגבניות",
    description:"פלפל צבעוני ממולא אורז ועגבניות מבושל לשלמות — צמחוני ומרשים",
    price:0, image:IMG.stuffedPepper, category:"stuffed" },

  { id:"st-18", name:"פלפלונים ממולאים באורז ועגבניות",
    description:"פלפלונים קטנטנים וחמודים ממולאים — יפים, צבעוניים ומיוחדים",
    price:0, image:IMG.stuffedPepper, category:"stuffed" },

  { id:"st-19", name:"כרוב אדום ממולא באורז ועגבניות",
    description:"עלי כרוב אדום ממולאים אורז ועגבניות — ייחודי ומרשים בצבעו",
    price:0, image:IMG.stuffedPepper, category:"stuffed" },

  { id:"st-20", name:"בצל סגול ממולא באורז ועגבניות",
    description:"בצל סגול שלם ממולא אורז ועגבניות — עדין ועם טעם מיוחד",
    price:0, image:IMG.stuffedPepper, category:"stuffed" },

  { id:"st-21", name:"גזר ממולא באורז ועגבניות",
    description:"גזר שלם ממולא אורז ועגבניות — מרשים, מיוחד ומלא טעם",
    price:0, image:IMG.carrot, category:"stuffed" },

  { id:"st-22", name:"סלק ממולא באורז ועגבניות",
    description:"סלק ממולא אורז ועגבניות — ייחודי, עשיר בצבע ומעורר עניין",
    price:0, image:IMG.beet, category:"stuffed", badge:"new" },

  { id:"st-23", name:"מיקס ממולאים עם פלפלונים",
    description:"מגוון ממולאים צבעוניים עם פלפלונים קטנטנים — חגיגי ומרהיב לאירועים",
    price:0, image:IMG.stuffedPepper, category:"stuffed", badge:"popular" },

  { id:"st-24", name:"מיקס ממולאים",
    description:"מגוון ממולאים ביתיים — כל אחד מיוחד בטעמו, ביחד חגיגה של טעמים",
    price:0, image:IMG.stuffedPepper, category:"stuffed", badge:"bestseller" },

  { id:"st-25", name:"מנגולד ממולא",
    description:"עלי מנגולד ממולאים אורז וירקות — עדין עם ניחוח ייחודי ובריאותי",
    price:0, image:IMG.roastedVeg, category:"stuffed" },

  /* ── left column (PDF lines 116-127) ── */
  { id:"st-01", name:"פלפל שושקה ממולא",
    description:"פלפלים אדומים מתוקים ממולאים תערובת אורז וירקות עשירה ומתובלת",
    price:0, image:IMG.stuffedPepper, category:"stuffed", badge:"popular" },

  { id:"st-02", name:"חצילונים ממולאים באורז ועגבניות",
    description:"חצילים קטנים וחמודים ממולאים אורז ועגבניות — ביתי ומיוחד",
    price:0, image:IMG.eggplant, category:"stuffed" },

  { id:"st-03", name:"ארטישוק ממולא בשר",
    description:"לבבות ארטישוק ממולאים בשר טחון מתובל — עשיר, ייחודי ומרשים",
    price:0, image:IMG.meatballs, category:"stuffed", badge:"new" },

  { id:"st-04", name:"חציל ממולא בשר",
    description:"חציל שלם ממולא בשר טחון ועגבניות ברוטב — מנה ביתית קלאסית",
    price:0, image:IMG.eggplant, category:"stuffed" },

  { id:"st-05", name:"כרוב ממולא בשר",
    description:"עלי כרוב רכים ממולאים בשר ואורז ברוטב עגבניות מתבשל לאט",
    price:0, image:IMG.meatStew, category:"stuffed", badge:"bestseller" },

  { id:"st-06", name:"בצל ממולא בשר ואורז",
    description:"בצל שלם ממולא בשר ואורז מתובל — מרשים בהגשה ועדין בטעם",
    price:0, image:IMG.meatballs, category:"stuffed" },

  { id:"st-07", name:"פלפל ממולא בשר",
    description:"פלפלים צבעוניים ממולאים בשר טחון, אורז ועגבניות — קלאסיקה ביתית",
    price:0, image:IMG.stuffedPepper, category:"stuffed", badge:"popular" },

  { id:"st-08", name:"קובה חמוסטה כולל מרק",
    description:"קובה קלאסית ברוטב לימוני מסורתי, כולל מרק חמוסטה ביתי (מחיר ליחידה)",
    price:0, image:IMG.soup, category:"stuffed", badge:"bestseller" },

  { id:"st-09", name:"קובה אדום כולל מרק",
    description:"קובה ברוטב עגבניות ביתי עשיר, כולל מרק (מחיר ליחידה)",
    price:0, image:IMG.soup, category:"stuffed", badge:"popular" },

  { id:"st-10", name:"מאפה במילוי אסאדו",
    description:"מאפה פריך ועשיר ממולא אסאדו מפורק — ייחודי, עוצמתי ומרשים",
    price:0, image:IMG.pastry, category:"stuffed", badge:"new" },

  { id:"st-11", name:"בורקס בשר",
    description:"בורקס פריך ומתפצפץ ממולא בשר טחון מתובל היטב — חם ומגרה",
    price:0, image:IMG.pastry, category:"stuffed" },

  { id:"st-12", name:"פסטייה מרוקאית",
    description:"פסטיל מרוקאי קלאסי עם שכבות בצק פריך ומילוי עשיר ומסורתי",
    price:0, image:IMG.pastry, category:"stuffed", badge:"new" },

  /* ══════════════════════════════════════════
     תוספות  •  SIDES
     Single column — natural PDF order (lines 146-167, prices ₪23→₪65).
     22 items. Last item is טנזיה מרוקאית (also appears in ירקות מבושלים below).
  ══════════════════════════════════════════ */

  { id:"sd-01", name:"אורז לבן",
    description:"אורז לבן פירורי מבושל בשלמות — בסיס מושלם ומלווה אידיאלי לכל מנה",
    price:0, image:IMG.rice, category:"sides" },

  { id:"sd-02", name:"אורז מגלובה",
    description:"אורז מגלובה מסורתי עם ירקות ובשמים ייחודיים — מנה ביתית מרשימה",
    price:0, image:IMG.rice, category:"sides", badge:"popular" },

  { id:"sd-03", name:"אורז אטריות",
    description:"אורז קלאסי עם אטריות מטוגנות זהובות — אהוב על כולם תמיד",
    price:0, image:IMG.rice, category:"sides", badge:"bestseller" },

  { id:"sd-04", name:"אורז אשפלאו",
    description:"אורז אשפלאו ריחני מסורתי עם תבלינים מיוחדים ועדינים",
    price:0, image:IMG.rice, category:"sides" },

  { id:"sd-05", name:"מג'דרה",
    description:"עדשים ואורז עם בצל מקורמל ופריך — מנה קלאסית ומזינה מאוד",
    price:0, image:IMG.rice, category:"sides", badge:"popular" },

  { id:"sd-06", name:'תפו"א פרוס בגריל',
    description:"תפוחי אדמה פרוסים מוזהבים על הגריל — קריספי בחוץ, רך בפנים",
    price:0, image:IMG.potato, category:"sides" },

  { id:"sd-07", name:'תפו"א פלחים ברוזמרין ושמן זית',
    description:"פלחי תפוחי אדמה עם רוזמרין ריחני ושמן זית — צלויים לזהוב מושלם",
    price:0, image:IMG.potato, category:"sides", badge:"popular" },

  { id:"sd-08", name:'תפו"א בייבי',
    description:"תפוחי אדמה בייבי שלמים, רכים, עסיסיים ומתובלים בעדינות",
    price:0, image:IMG.potato, category:"sides" },

  { id:"sd-09", name:"בטטה בשמן זית וצ'ילי מתוק",
    description:"בטטה אפויה עם ציפוי שמן זית וצ'ילי מתוק — מתוק, חריף ומגרה",
    price:0, image:IMG.sweetPotato, category:"sides", badge:"new" },

  { id:"sd-10", name:'תפו"א בטטה אפויים',
    description:"שילוב ייחודי של תפוחי אדמה ובטטה אפויים בתנור — מתוק ומנחם",
    price:0, image:IMG.sweetPotato, category:"sides" },

  { id:"sd-11", name:"פירה",
    description:"פירה קרמי, חלק ומנחם — מוכן בחמאה וחלב, ביתי ועשיר",
    price:0, image:IMG.potato, category:"sides", badge:"popular" },

  { id:"sd-12", name:"קוסקוס",
    description:"קוסקוס מושלם עם ציר ירקות עשיר — מסורת צפון אפריקה על הצלחת",
    price:0, image:IMG.couscous, category:"sides", badge:"popular" },

  { id:"sd-13", name:"ירקות לקוסקוס",
    description:"תבשיל ירקות עשיר ועסיסי — ליווי מושלם לקוסקוס או בפני עצמו",
    price:0, image:IMG.roastedVeg, category:"sides" },

  { id:"sd-14", name:"פסטה ברוטב עגבניות",
    description:"פסטה מבושלת ברוטב עגבניות ביתי עשיר עם שום ועשבי תיבול",
    price:0, image:IMG.pasta, category:"sides" },

  { id:"sd-15", name:"מרק שעועית",
    description:"מרק שעועית סמיך ומחמם עם ירקות שורש — ביתי, מזין ומנחם",
    price:0, image:IMG.soup, category:"sides" },

  { id:"sd-16", name:"מרק עדשים",
    description:"מרק עדשים כתומות ריחני עם כמון ולימון — קלאסיקה מזינה ומחממת",
    price:0, image:IMG.soup, category:"sides", badge:"popular" },

  { id:"sd-17", name:"פשטידה מרוקאית",
    description:"פשטידה מרוקאית עשירה עם ביצים, תבלינים ייחודיים וטעם ביתי",
    price:0, image:IMG.fritters, category:"sides", badge:"new" },

  { id:"sd-18", name:"אורז ירוק",
    description:"אורז ירוק עם עשבי תיבול טריים ופטרוזיליה — צבעוני, ריחני ומיוחד",
    price:0, image:IMG.rice, category:"sides" },

  { id:"sd-19", name:"אורז אדום",
    description:"אורז עם רוטב עגבניות ותבלינים ייחודיים — עשיר, מגרה ומיוחד",
    price:0, image:IMG.rice, category:"sides" },

  { id:"sd-20", name:"כרובית מאודה",
    description:"כרובית מאודה רכה ועדינה — בריאה, קלה ומתאימה לכל תפריט",
    price:0, image:IMG.roastedVeg, category:"sides" },

  { id:"sd-21", name:"מוקפץ עם נודלס",
    description:"נודלס מוקפצים עם ירקות ורוטב אסייתי ייחודי — עשיר בטעמים",
    price:0, image:IMG.stirFry, category:"sides", badge:"new" },

  { id:"sd-22", name:"טנזיה מרוקאית",
    description:"תבשיל מרוקאי איטי עם שזיפים, לימון משומר ותבלינים מסורתיים",
    price:0, image:IMG.meatStew, category:"sides", badge:"popular" },

  /* ══════════════════════════════════════════
     ירקות מבושלים  •  COOKED VEGETABLES
     Separate category — single column, natural PDF order (lines 169-179, prices ₪28→₪55).
     11 items. Includes a second listing of טנזיה מרוקאית (also in תוספות above).
  ══════════════════════════════════════════ */

  { id:"cv-01", name:"שעועית ירוקה מוקפצת",
    description:"שעועית ירוקה טרייה מוקפצת על אש גבוהה עם שום — קריספי ומרענן",
    price:0, image:IMG.roastedVeg, category:"cookedveg" },

  { id:"cv-02", name:"שעועית ירוקה ברוטב",
    description:"שעועית ירוקה ברוטב עגבניות ביתי מתובל — ביתי ומנחם",
    price:0, image:IMG.roastedVeg, category:"cookedveg" },

  { id:"cv-03", name:"אפונה וגזר",
    description:"תערובת אפונה ירוקה וגזר מבושלים — צבעוניים, קלים ומזינים",
    price:0, image:IMG.carrot, category:"cookedveg" },

  { id:"cv-04", name:"אפונה עם סלרי",
    description:"אפונה ירוקה עם שורש סלרי מבושל — קל, עדין ומרענן",
    price:0, image:IMG.roastedVeg, category:"cookedveg" },

  { id:"cv-05", name:"זיתים מבושלים מרוקאים",
    description:"זיתים מבושלים בתיבול מרוקאי ייחודי — עשיר, עמוק ומסורתי",
    price:0, image:IMG.olives, category:"cookedveg" },

  { id:"cv-06", name:"לקט ירקות בגריל",
    description:"מגוון ירקות עונתיים מוזהבים על הגריל עם שמן זית ותבלינים",
    price:0, image:IMG.roastedVeg, category:"cookedveg", badge:"popular" },

  { id:"cv-07", name:"נודלס עם ירקות",
    description:"נודלס עדינים עם ירקות טריים מוקפצים — קל, מהיר ומרענן",
    price:0, image:IMG.stirFry, category:"cookedveg" },

  { id:"cv-08", name:"ירקות אנטי פסטי",
    description:"ירקות קלויים בשמן זית ובלסמי — בסגנון איטלקי ביתי ומרשים",
    price:0, image:IMG.roastedVeg, category:"cookedveg", badge:"new" },

  { id:"cv-09", name:"ארטישוק ופטריות",
    description:"לבבות ארטישוק עם פטריות מוקפצות בשמן זית — עשיר ועדין",
    price:0, image:IMG.roastedVeg, category:"cookedveg" },

  { id:"cv-10", name:"טנזיה מרוקאית",
    description:"תבשיל מרוקאי איטי עם שזיפים, לימון משומר ותבלינים מסורתיים",
    price:0, image:IMG.meatStew, category:"cookedveg", badge:"popular" },

  { id:"cv-11", name:"ברוקולי וכרובית מוקפצים",
    description:"ברוקולי וכרובית טריים מוקפצים בשמן זית ושום — בריא ומלא טעם",
    price:0, image:IMG.roastedVeg, category:"cookedveg" },

  /* ══════════════════════════════════════════
     צמחוני  •  VEGETARIAN PATTIES
     Single column — natural PDF order (lines 213-220).
  ══════════════════════════════════════════ */

  { id:"vg-01", name:"קציצות ירק",
    description:"קציצות ירק ביתיות עסיסיות מתערובת ירקות עונתיים — מנה צמחונית מנחמת",
    price:0, image:IMG.fritters, category:"veggie", badge:"popular" },

  { id:"vg-02", name:"קציצות כרובית וברוקולי",
    description:"קציצות קריספיות מכרובית וברוקולי טריים — בריא, טעים ומרשים",
    price:0, image:IMG.fritters, category:"veggie" },

  { id:"vg-03", name:'קציצות תפו"א ערוק',
    description:"קציצות תפוחי אדמה קלאסיות — קריספיות בחוץ, רכות ומנחמות בפנים",
    price:0, image:IMG.fritters, category:"veggie", badge:"bestseller" },

  { id:"vg-04", name:"קציצות סלק",
    description:"קציצות סלק בצבע ורוד עז — ייחודיות, צבעוניות ומלאות טעם מפתיע",
    price:0, image:IMG.fritters, category:"veggie", badge:"new" },

  { id:"vg-05", name:"קציצות מנגולד",
    description:"קציצות מנגולד ירוקות ובריאות עם תיבול עדין ועשבי תיבול טריים",
    price:0, image:IMG.fritters, category:"veggie" },

  { id:"vg-06", name:"קציצות זוקיני",
    description:"קציצות זוקיני קלות ורעננות — מושלמות, קריספיות ומלאות טעם",
    price:0, image:IMG.fritters, category:"veggie" },

  { id:"vg-07", name:"קציצות בטטה",
    description:"קציצות בטטה מתוקות עם תיבול עדין — נפלאות, ייחודיות ומיוחדות",
    price:0, image:IMG.fritters, category:"veggie", badge:"popular" },

  { id:"vg-08", name:"קציצות קינואה וחמוציות",
    description:"קציצות קינואה בריאות עם חמוציות חמצמצות — ייחודי, מרשים ומזין",
    price:0, image:IMG.fritters, category:"veggie", badge:"new" },

  /* ══════════════════════════════════════════
     מטוגנים  •  FRIED
     RTL reading order within each row (PDF lines 231-232):
     Row 1: שניצלונים → קובה בשר → קובה פטריות → סיגר בשר → פסטל תפו"א
     Row 2: אגרול ירקות → מיני סמבוסק → חטיף תירס → כרובית מטוגנת → מיקס
  ══════════════════════════════════════════ */

  { id:"fr-01", name:"שניצלונים / שניצל",
    description:"שניצל עוף פריך בציפוי זהוב מושלם — קלאסי, אהוב ובלתי ניתן להתנגדות",
    price:0, image:IMG.schnitzel, category:"fried", badge:"bestseller" },

  { id:"fr-02", name:"קובה בשר",
    description:"קובה בשר פריכה מבחוץ ועסיסית מבפנים — קלאסיקה מסורתית אהובה",
    price:0, image:IMG.meatballs, category:"fried", badge:"popular" },

  { id:"fr-03", name:"קובה פטריות",
    description:"קובה צמחונית ממולאת פטריות מוקפצות — ייחודי, מיוחד ומפתיע",
    price:0, image:IMG.fritters, category:"fried", badge:"new" },

  { id:"fr-04", name:"סיגר בשר",
    description:"סיגרים פריכים ממולאי בשר טחון ותבלינים — מנה שכולם אוהבים",
    price:0, image:IMG.schnitzel, category:"fried", badge:"popular" },

  { id:"fr-05", name:'פסטל תפו"א',
    description:"פסטל קריספי ממולא תפוחי אדמה מעוכים מתובלים — ביתי ומנחם",
    price:0, image:IMG.fritters, category:"fried" },

  { id:"fr-06", name:"אגרול ירקות",
    description:"אגרולים פריכים ממולאי ירקות מוקפצים — בסגנון סיני ביתי ומיוחד",
    price:0, image:IMG.schnitzel, category:"fried" },

  { id:"fr-07", name:"מיני סמבוסק חומוס",
    description:"סמבוסקים קטנים ופריכים ממולאי חומוס מתובל — מושלמים לאירועים",
    price:0, image:IMG.fritters, category:"fried", badge:"new" },

  { id:"fr-08", name:"חטיף תירס",
    description:"חטיף תירס פריך ומגרה — אהוב על קטן וגדול, מושלם לאירועים",
    price:0, image:IMG.fritters, category:"fried" },

  { id:"fr-09", name:"כרובית מטוגנת",
    description:"כרובית פריכה מטוגנת בציפוי קריספי מושלם — ממכרת ומגרה",
    price:0, image:IMG.schnitzel, category:"fried", badge:"popular" },

  { id:"fr-10", name:"מיקס מטוגנים",
    description:"מגוון מטוגנים ביתיים — לאירועים ואספקות גדולות, חגיגה של פריכות",
    price:0, image:IMG.schnitzel, category:"fried", badge:"popular" },

  /* ══════════════════════════════════════════
     דגים  •  FISH
     Single column — natural PDF order (lines 237-247, prices ₪60→₪55).
  ══════════════════════════════════════════ */

  { id:"fi-01", name:"פילה אמנון ברוטב מזרחי",
    description:"פילה אמנון טרי ברוטב עגבניות מזרחי ריחני עם כוסברה ותבלינים",
    price:0, image:IMG.fishFillet, category:"fish", badge:"popular" },

  { id:"fi-02", name:"פילה אמנון בעשבי תיבול",
    description:"פילה אמנון עדין עם עשבי תיבול טריים ושמן זית — רענן ומיוחד",
    price:0, image:IMG.fishFillet, category:"fish" },

  { id:"fi-03", name:"פילה סלמון בעשבי תיבול",
    description:"פילה סלמון פרימיום עם עשבי תיבול ירוקים ולימון — עשיר ובריא",
    price:0, image:IMG.salmon, category:"fish", badge:"bestseller" },

  { id:"fi-04", name:"פילה סלמון בחרדל ודבש",
    description:"סלמון אפוי עם ציפוי חרדל ודבש — שילוב מרתק של מתוק וחריף",
    price:0, image:IMG.salmon, category:"fish", badge:"new" },

  { id:"fi-05", name:"פילה סלמון מזרחי",
    description:"סלמון ברוטב עגבניות ופלפלים בתיבול מזרחי עשיר — פרימיום ביתי",
    price:0, image:IMG.salmon, category:"fish", badge:"popular" },

  { id:"fi-06", name:"פילה טונה מזרחי",
    description:"פילה טונה ברוטב עגבניות מזרחי מסורתי עם עגבניות ופלפלים",
    price:0, image:IMG.fishFillet, category:"fish" },

  { id:"fi-07", name:"דג נסיכה מזרחי",
    description:"דג נסיכה ברוטב מזרחי ריחני — טרי, עדין ומלא טעמים מסורתיים",
    price:0, image:IMG.fishFillet, category:"fish" },

  { id:"fi-08", name:"קציצות דגים ברוטב",
    description:"קציצות דג ביתיות ברוטב עגבניות ועשבי תיבול — קלאסי ומנחם",
    price:0, image:IMG.fishFillet, category:"fish", badge:"popular" },

  { id:"fi-09", name:"קציצות דגים מתכון חדש מדג נסיכה",
    description:"קציצות דג נסיכה במתכון חדש ומיוחד — עדין, רך ועם טעם ייחודי",
    price:0, image:IMG.fishFillet, category:"fish", badge:"new" },

  { id:"fi-10", name:"דג בקלה מטוגן",
    description:"בקלה פריכה מטוגנת בציפוי זהוב — קלאסיק ים-תיכוני אהוב",
    price:0, image:IMG.fishFillet, category:"fish" },

  { id:"fi-11", name:"פילה מושט מטוגן",
    description:"פילה מושט פריך מטוגן בציפוי קלאסי — עדין וטעים מאוד",
    price:0, image:IMG.fishFillet, category:"fish" },

  /* ══════════════════════════════════════════
     מנות בשר  •  MEAT
     Single column — natural PDF order (lines 261-279, prices ₪125→₪28).
  ══════════════════════════════════════════ */

  { id:"mt-01", name:"בשר צלי ברוטב השף (מס' 4)",
    description:"צלי בקר ממספר 4 ברוטב השף המיוחד — עסיסי, רך ומלא טעם",
    price:0, image:IMG.roastMeat, category:"meat" },

  { id:"mt-02", name:"בשר צלי ברוטב השף (מס' 5)",
    description:"צלי בקר פריים ממספר 5 ברוטב שף עשיר ומיוחד — מנה יוקרתית",
    price:0, image:IMG.roastMeat, category:"meat", badge:"popular" },

  { id:"mt-03", name:"בשר צלי ברוטב השף (מס' 6)",
    description:"נתח בקר ממספר 6 ברוטב שף מיוחד — רך, עסיסי ומומלץ מאוד",
    price:0, image:IMG.roastMeat, category:"meat" },

  { id:"mt-04", name:"קציצות בשר עם אפונה וסלרי",
    description:"קציצות בשר ביתיות ברוטב אפונה וסלרי עסיסי — ביתי ומנחם",
    price:0, image:IMG.meatballs, category:"meat", badge:"popular" },

  { id:"mt-05", name:"קציצות בשר ברוטב פלפלים",
    description:"קציצות בשר עסיסיות ברוטב פלפלים צבעוני ועשיר — מרשים ומגרה",
    price:0, image:IMG.meatballs, category:"meat" },

  { id:"mt-06", name:"קבב על האש",
    description:"קבב בקר עסיסי על האש, מתובל ועשיר — ישראלי, ריחני ומגרה",
    price:0, image:IMG.kebab, category:"meat", badge:"bestseller" },

  { id:"mt-07", name:"בקר מוקפץ עם ירקות",
    description:"פרוסות בקר מוקפצות עם ירקות טריים ורוטב ייחודי — מזרח פוגש מערב",
    price:0, image:IMG.stirFry, category:"meat", badge:"new" },

  { id:"mt-08", name:"תבשיל אסאדו ברוטב יין",
    description:"אסאדו איטי ברוטב יין אדום ועשבי תיבול — מנה יוקרתית ומרשימה",
    price:0, image:IMG.meatStew, category:"meat", badge:"bestseller" },

  { id:"mt-09", name:"קדרת בשר עם גרגירי חומוס",
    description:"קדרת בשר עשירה עם גרגירי חומוס מבושלים — ביתי, עמוק ומחמם",
    price:0, image:IMG.meatStew, category:"meat", badge:"popular" },

  { id:"mt-10", name:"אסאדו מפורק",
    description:"אסאדו מבושל שעות ומפורק לחוטים, רך ועסיסי — מנה פרימיום מרשימה",
    price:0, image:IMG.roastMeat, category:"meat", badge:"bestseller" },

  { id:"mt-11", name:"מאפה פילו בשר",
    description:"שכבות בצק פילו פריכות ועדינות ממולאות בשר טחון מתובל",
    price:0, image:IMG.pastry, category:"meat", badge:"new" },

  { id:"mt-12", name:'תפו"א ממולא בשר (מפרום)',
    description:"תפוחי אדמה שלמים ממולאים בשר טחון ומתובל — מנה ביתית קלאסית",
    price:0, image:IMG.potato, category:"meat" },

  { id:"mt-13", name:"עוף שלם בגריל",
    description:"עוף שלם מחולק על הגריל עם תיבול מסורתי — זהוב, פריך ועסיסי",
    price:0, image:IMG.chicken, category:"meat", badge:"popular" },

  { id:"mt-14", name:"כרעיים עוף בטנזיה",
    description:"כרעי עוף ברוטב טנזיה מרוקאי ריחני עם לימון משומר ותבלינים",
    price:0, image:IMG.chicken, category:"meat" },

  { id:"mt-15", name:"גולש",
    description:"גולש עגל קלאסי עם ירקות שורש וציר עשיר — מחמם ומנחם",
    price:0, image:IMG.meatStew, category:"meat" },

  { id:"mt-16", name:"כרעי עוף במאסחן",
    description:"כרעי עוף במאסחן לבנוני ריחני עם בצל מקורמל ופלפל אנגלי",
    price:0, image:IMG.chicken, category:"meat", badge:"new" },

  { id:"mt-17", name:"סיגר במילוי בשר טחון וכבד",
    description:"סיגרים פריכים עם מילוי בשר וכבד עשיר ומיוחד — אהוב ומיוחד",
    price:0, image:IMG.schnitzel, category:"meat" },

  { id:"mt-18", name:"קובה חמוסטה",
    description:"קובה מסורתית ברוטב חמוסטה לימוני — ביתי, אותנטי ומרגש",
    price:0, image:IMG.soup, category:"meat", badge:"popular" },

  { id:"mt-19", name:"קובה סלק",
    description:"קובה בסלק ברוטב עגבניות עמוק — ייחודי, מסורתי ומלא צבע",
    price:0, image:IMG.soup, category:"meat", badge:"new" },

  /* ══════════════════════════════════════════
     מנות עוף  •  CHICKEN
     Single column — natural PDF order (lines 300-311, prices ₪65→₪65).
  ══════════════════════════════════════════ */

  { id:"ch-01", name:"שניצל",
    description:"שניצל עוף פריך בציפוי זהוב מושלם — אהוב על כל הגילאים, קלאסי תמיד",
    price:0, image:IMG.schnitzel, category:"chicken", badge:"bestseller" },

  { id:"ch-02", name:"כרעיים עוף מזרחי",
    description:"כרעי עוף ברוטב מזרחי עגבניות ופלפלים — ביתי, עשיר ומנחם",
    price:0, image:IMG.chicken, category:"chicken", badge:"popular" },

  { id:"ch-03", name:"כרעיים עוף בסופריטו",
    description:"כרעי עוף ברוטב סופריטו סמיך וריחני — מסורתי וביתי",
    price:0, image:IMG.chicken, category:"chicken" },

  { id:"ch-04", name:"נתחי עוף מוקפצים עם ירקות",
    description:"נתחי עוף מוקפצים עם ירקות טריים ורוטב ייחודי — קל ומזין",
    price:0, image:IMG.stirFry, category:"chicken", badge:"new" },

  { id:"ch-05", name:"חזה עוף ממולא בציפוי פריך",
    description:"חזה עוף ממולא בציפוי פריך מושלם — מנה מרשימה ומיוחדת לאירועים",
    price:0, image:IMG.schnitzel, category:"chicken", badge:"new" },

  { id:"ch-06", name:"סטייק פרגית בגריל",
    description:"סטייק פרגית מוזהב על הגריל — עסיסי, עשיר בטעם ומגרה",
    price:0, image:IMG.chicken, category:"chicken", badge:"popular" },

  { id:"ch-07", name:"פרגית במילוי פיסטוק",
    description:"פרגית ממולאת פיסטוק ועשבי תיבול — יוקרתי, מרשים ובלתי נשכח",
    price:0, image:IMG.chicken, category:"chicken", badge:"new" },

  { id:"ch-08", name:"סטייק עוף על האש",
    description:"סטייק עוף על האש — פריך ומוזהב מבחוץ, עסיסי ורך מבפנים",
    price:0, image:IMG.chicken, category:"chicken" },

  { id:"ch-09", name:"קציצות עוף ברוטב",
    description:"קציצות עוף עדינות ורכות ברוטב ביתי — קל, מזין ומנחם",
    price:0, image:IMG.meatballs, category:"chicken", badge:"popular" },

  { id:"ch-10", name:"כבד עוף על הגריל",
    description:"כבד עוף על הגריל עם בצל מקורמל — מסורתי, עשיר ומיוחד",
    price:0, image:IMG.chicken, category:"chicken" },

  { id:"ch-11", name:"מעורב ירושלמי",
    description:"מעורב ירושלמי קלאסי — לבבות עוף ופרגיות על האש, ריחני ועוצמתי",
    price:0, image:IMG.kebab, category:"chicken", badge:"bestseller" },

  { id:"ch-12", name:"שווארמה",
    description:"שווארמה עוף מסורתית עם תבלינים ייחודיים — מנה ישראלית אהובה ואייקונית",
    price:0, image:IMG.kebab, category:"chicken", badge:"bestseller" },
];
