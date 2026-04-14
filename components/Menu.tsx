"use client";

import { useState, useMemo, useId } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { menuItems, categories } from "@/data/menuData";
import MenuCard from "./MenuCard";

export default function Menu() {
  const [active, setActive] = useState("all");
  /* FIX L3 — respect prefers-reduced-motion for layout animations */
  const reducedMotion = useReducedMotion();

  /* FIX C6 — proper ARIA: generate stable IDs linking each tab to its panel */
  const panelId  = useId();
  const tabPrefix = useId();
  const tabId = (catId: string) => `${tabPrefix}-tab-${catId}`;

  const filtered = useMemo(
    () => (active === "all" ? menuItems : menuItems.filter((i) => i.category === active)),
    [active]
  );

  const activeCategory = categories.find((c) => c.id === active);

  return (
    <section id="menu" className="py-20 px-4 bg-cream">
      <div className="mx-auto max-w-7xl">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">
            מה יש לאכול?
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-brown-900 mb-4">
            התפריט שלנו
          </h2>
          <p className="text-brown-500 text-lg max-w-xl mx-auto leading-relaxed">
            כל המנות מוכנות בבית עם מרכיבים טריים. ניתן להזמין עד יום חמישי בשעה 20:00.
          </p>
        </motion.div>

        {/*
          FIX C6 — Correct tablist / tab / tabpanel pattern.
          Each tab has: role="tab", aria-selected, aria-controls pointing to the panel.
          The panel has: role="tabpanel", aria-labelledby pointing to the active tab.
          WCAG 1.3.1 — Info and Relationships (Level A).
        */}
        <div
          role="tablist"
          aria-label="קטגוריות תפריט"
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={tabId(cat.id)}
              role="tab"
              aria-selected={active === cat.id}
              aria-controls={panelId}
              onClick={() => setActive(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:outline-none ${
                active === cat.id
                  ? "bg-amber-500 text-white shadow-md shadow-amber-200"
                  : "bg-white text-brown-700 hover:bg-amber-50 border border-brown-100"
              }`}
            >
              <span aria-hidden="true">{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* tabpanel — linked to whichever tab is active */}
        <div
          id={panelId}
          role="tabpanel"
          aria-labelledby={tabId(active)}
          aria-label={`${activeCategory?.name ?? "כל הפריטים"}`}
          tabIndex={0}
          className="outline-none"
        >
          <motion.div
            layout={!reducedMotion}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((item, idx) => (
                <MenuCard key={item.id} item={item} index={idx} />
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <p className="text-center text-brown-400 py-16 text-lg">
              אין פריטים בקטגוריה זו כרגע
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
