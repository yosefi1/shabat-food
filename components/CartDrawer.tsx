"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalItems, totalPrice } =
    useCart();

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
                className="p-2 rounded-lg text-brown-500 hover:bg-brown-50 hover:text-brown-900 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-brown-900">העגלה שלי</h2>
                {totalItems > 0 && (
                  <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {totalItems}
                  </span>
                )}
              </div>

              <ShoppingCart size={22} className="text-amber-500" />
            </div>

            {/* Empty state */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <ShoppingBag size={56} className="text-brown-200 mb-5" />
                <p className="text-xl font-bold text-brown-800 mb-2">העגלה ריקה</p>
                <p className="text-brown-400 text-sm mb-6">הוסיפו פריטים טעימים מהתפריט</p>
                <button
                  onClick={closeCart}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-3 rounded-xl transition-colors"
                >
                  לתפריט
                </button>
              </div>
            ) : (
              <>
                {/* Items list */}
                <ul className="flex-1 overflow-y-auto p-5 space-y-4">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-3 bg-cream rounded-xl p-3">
                      {/* Thumbnail */}
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-cream-100">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-brown-900 truncate">{item.name}</p>
                        <p className="text-amber-600 font-bold text-sm">₪{item.price}</p>

                        {/* Qty controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label="הפחת כמות"
                            className="w-7 h-7 rounded-full bg-brown-100 hover:bg-brown-200 flex items-center justify-center transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-sm font-black w-5 text-center text-brown-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="הוסף כמות"
                            className="w-7 h-7 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal + remove */}
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeItem(item.id)}
                          aria-label={`הסר ${item.name}`}
                          className="p-1 text-brown-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                        <span className="text-xs font-semibold text-brown-500">
                          ₪{item.price * item.quantity}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Footer */}
                <div className="p-5 border-t border-brown-100 bg-white space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-brown-500 font-medium">סה"כ לתשלום</span>
                    <span className="text-3xl font-black text-brown-900">
                      ₪{totalPrice.toLocaleString("he-IL")}
                    </span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="block w-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold py-4 rounded-xl text-center text-lg transition-all"
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
