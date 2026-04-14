"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, Check } from "lucide-react";
import { MenuItem } from "@/types";
import { useCart } from "@/context/CartContext";

const BADGE_LABELS: Record<string, { visual: string; accessible: string }> = {
  bestseller: { visual: "הנמכר ביותר 🔥", accessible: "הנמכר ביותר" },
  popular:    { visual: "פופולרי ⭐",       accessible: "פופולרי"       },
  new:        { visual: "חדש ✨",            accessible: "חדש"           },
};

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=60";

interface Props {
  item: MenuItem;
  index: number;
}

export default function MenuCard({ item, index }: Props) {
  const { addItem } = useCart();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError]   = useState(false);
  const [added, setAdded]         = useState(false);

  const handleAdd = () => {
    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const badge = item.badge ? BADGE_LABELS[item.badge] : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 bg-cream-100 overflow-hidden flex-shrink-0">
        {!imgLoaded && <div className="absolute inset-0 shimmer" aria-hidden="true" />}

        <Image
          src={imgError ? PLACEHOLDER : item.image}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover transition-all duration-500 group-hover:scale-105 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImgLoaded(true)}
          onError={() => { setImgError(true); setImgLoaded(true); }}
        />

        {/* FIX M4 — badge: emoji is aria-hidden, accessible text is sr-only */}
        {badge && (
          <span className="absolute top-3 start-3 bg-amber-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
            <span aria-hidden="true">{badge.visual}</span>
            <span className="sr-only">{badge.accessible}</span>
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-bold text-lg text-brown-900 leading-snug mb-1">
          {item.name}
        </h3>
        <p className="text-sm text-brown-500 leading-relaxed line-clamp-2 flex-1 mb-4">
          {item.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-2xl font-black text-amber-600" aria-label={
            item.price === 0 ? "מחיר לפי הצעה" : `מחיר: ₪${item.price}`
          }>
            {item.price === 0 ? "??" : `₪${item.price}`}
          </span>

          {/*
            FIX H6 — "נוסף!" state change announced via aria-live="polite".
            The span updates its text when the item is added; assistive tech
            announces the change without stealing focus. WCAG 1.3.3.
          */}
          <div className="relative">
            <span
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="sr-only"
            >
              {added ? `${item.name} נוסף לעגלה` : ""}
            </span>

            <motion.button
              onClick={handleAdd}
              whileTap={{ scale: 0.9 }}
              aria-label={added ? `${item.name} נוסף לעגלה` : `הוסף ${item.name} לעגלה`}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1 ${
                added
                  ? "bg-green-500 text-white"
                  : "bg-amber-500 hover:bg-amber-600 text-white"
              }`}
            >
              {added ? (
                <>
                  <Check size={15} aria-hidden="true" />
                  <span aria-hidden="true">נוסף!</span>
                </>
              ) : (
                <>
                  <Plus size={15} aria-hidden="true" />
                  הוסף
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
