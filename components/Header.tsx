"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { href: "#menu",    label: "תפריט" },
  { href: "#about",   label: "אודות" },
  { href: "#contact", label: "צור קשר" },
];

export default function Header() {
  const { totalItems, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const textCls = scrolled
    ? "text-brown-800 hover:text-amber-600"
    : "text-white/90 hover:text-amber-300";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">

          {/* Logo — first in DOM → appears on RIGHT in RTL */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-2xl">🕯️</span>
            <span
              className={`text-xl font-black tracking-tight transition-colors ${
                scrolled ? "text-brown-900" : "text-white"
              }`}
            >
              שבת פוד
            </span>
          </Link>

          {/* Desktop Nav — center */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className={`font-semibold text-sm transition-colors ${textCls}`}>
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Cart button — last in DOM → appears on LEFT in RTL */}
          <button
            onClick={openCart}
            aria-label={`עגלת קניות — ${totalItems} פריטים`}
            className="relative p-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white transition-all"
          >
            <ShoppingCart size={22} />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -top-2 -end-2 flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black"
                >
                  {totalItems > 9 ? "9+" : totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

        </div>
      </div>
    </header>
  );
}
