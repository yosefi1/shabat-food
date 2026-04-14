"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

/* Selector for all focusable elements inside a container */
const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalItems, totalPrice } =
    useCart();

  const drawerRef    = useRef<HTMLElement>(null);
  const triggerRef   = useRef<HTMLElement | null>(null); // element that opened the drawer

  /* ── FIX C4 + C5: Focus management + focus trap ──────────────────────── */
  useEffect(() => {
    if (isOpen) {
      // Remember who opened the drawer so we can restore focus on close
      triggerRef.current = document.activeElement as HTMLElement;

      // Move focus into the drawer (to the close button)
      requestAnimationFrame(() => {
        const first = drawerRef.current?.querySelector<HTMLElement>(FOCUSABLE);
        first?.focus();
      });
    } else {
      // Restore focus to the element that triggered the drawer
      triggerRef.current?.focus();
      triggerRef.current = null;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeCart();
        return;
      }

      if (e.key !== "Tab") return;

      const drawer = drawerRef.current;
      if (!drawer) return;
      const focusable = Array.from(drawer.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last  = focusable[focusable.length - 1];

      if (e.shiftKey) {
        // Shift+Tab — wrap to last element
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab — wrap to first element
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-50"
            aria-hidden="true"
          />

          {/* Drawer — slides from RIGHT (start in RTL) */}
          <motion.aside
            key="drawer"
            ref={drawerRef}
            role="dialog"
            aria-label="עגלת קניות"
            aria-modal="true"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed end-0 top-0 h-full w-full sm:w-[420px] bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-brown-100">
              <button
                onClick={closeCart}
                aria-label="סגור עגלה"
                className="p-2 rounded-lg text-brown-500 hover:bg-brown-50 hover:text-brown-900 focus-visible:ring-2 focus-visible:ring-amber-400 transition-colors"
              >
                <X size={20} aria-hidden="true" />
              </button>

              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-brown-900">העגלה שלי</h2>
                {totalItems > 0 && (
                  <span
                    className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full"
                    aria-label={`${totalItems} פריטים`}
                  >
                    {totalItems}
                  </span>
                )}
              </div>

              {/* FIX H8 — decorative icon, aria-hidden */}
              <ShoppingCart size={22} className="text-amber-500" aria-hidden="true" />
            </div>

            {/* Empty state */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <ShoppingBag size={56} className="text-brown-200 mb-5" aria-hidden="true" />
                <p className="text-xl font-bold text-brown-800 mb-2">העגלה ריקה</p>
                <p className="text-brown-400 text-sm mb-6">הוסיפו פריטים טעימים מהתפריט</p>
                <button
                  onClick={closeCart}
                  className="bg-amber-500 hover:bg-amber-600 focus-visible:ring-2 focus-visible:ring-amber-400 text-white font-bold px-8 py-3 rounded-xl transition-colors"
                >
                  לתפריט
                </button>
              </div>
            ) : (
              <>
                {/* Items list */}
                <ul className="flex-1 overflow-y-auto p-5 space-y-4" aria-label="פריטים בעגלה">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-3 bg-cream rounded-xl p-3">
                      {/* Thumbnail — decorative, described by name below */}
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-cream-100">
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-brown-900 truncate">{item.name}</p>
                        <p className="text-amber-600 font-bold text-sm">
                          {item.price === 0 ? "??" : `₪${item.price}`}
                        </p>

                        {/* Qty controls */}
                        <div className="flex items-center gap-2 mt-2" role="group" aria-label={`כמות — ${item.name}`}>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label={`הפחת כמות של ${item.name}`}
                            className="w-7 h-7 rounded-full bg-brown-100 hover:bg-brown-200 focus-visible:ring-2 focus-visible:ring-amber-400 flex items-center justify-center transition-colors"
                          >
                            <Minus size={12} aria-hidden="true" />
                          </button>
                          <span
                            className="text-sm font-black w-5 text-center text-brown-900"
                            aria-label={`${item.quantity} יחידות`}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label={`הוסף כמות של ${item.name}`}
                            className="w-7 h-7 rounded-full bg-amber-500 hover:bg-amber-600 focus-visible:ring-2 focus-visible:ring-amber-400 text-white flex items-center justify-center transition-colors"
                          >
                            <Plus size={12} aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal + remove */}
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeItem(item.id)}
                          aria-label={`הסר ${item.name} מהעגלה`}
                          className="p-1 text-brown-300 hover:text-red-500 focus-visible:ring-2 focus-visible:ring-red-400 rounded transition-colors"
                        >
                          <Trash2 size={15} aria-hidden="true" />
                        </button>
                        <span className="text-xs font-semibold text-brown-500">
                          {item.price === 0 ? "??" : `₪${item.price * item.quantity}`}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Footer */}
                <div className="p-5 border-t border-brown-100 bg-white space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-brown-500 font-medium">סה&quot;כ לתשלום</span>
                    <span className="text-3xl font-black text-brown-900">
                      {totalPrice === 0 ? "??" : `₪${totalPrice.toLocaleString("he-IL")}`}
                    </span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="block w-full bg-amber-500 hover:bg-amber-600 active:scale-95 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 text-white font-bold py-4 rounded-xl text-center text-lg transition-all"
                  >
                    המשך לתשלום
                  </Link>
                  <p className="text-center text-xs text-brown-400">
                    משלוח חינם להזמנות מעל ₪200
                  </p>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
