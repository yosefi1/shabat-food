"use client";

import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { menuItems, categories } from "@/data/menuData";
import MenuCard from "./MenuCard";

export default function Menu() {
  const [active, setActive] = useState("all");

  const filtered = useMemo(
    () => (active === "all" ? menuItems : menuItems.filter((i) => i.category === active)),
    [active]
  );

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

        {/* Category pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12" role="tablist" aria-label="קטגוריות תפריט">
          {categories.map((cat) => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={active === cat.id}
              onClick={() => setActive(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all focus-visible:outline-2 focus-visible:outline-amber-500 ${
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

        {/* Menu grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item, idx) => (
              <MenuCard key={item.id} item={item} index={idx} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="text-center text-brown-400 py-16 text-lg">אין פריטים בקטגוריה זו כרגע</p>
        )}
      </div>
    </section>
  );
}
