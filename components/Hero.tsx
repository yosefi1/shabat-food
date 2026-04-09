"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import CountdownTimer from "./CountdownTimer";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80"
          alt="שולחן שבת מסורתי"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Layered gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
      </div>

      {/* Floating candle glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-amber-400/8 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-block bg-amber-500/20 border border-amber-400/40 text-amber-300 font-semibold text-sm px-4 py-1.5 rounded-full mb-6 tracking-wide"
          >
            🕯️ ברוכים הבאים לשבת פוד
          </motion.p>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-tight mb-6">
            האוכל הכי טוב
            <br />
            <span className="text-amber-400">לשבת שלך</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-white/85 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            בישול ביתי אמיתי, מתכונים מסורתיים שעברו מדור לדור —<br className="hidden sm:block" />
            מוכן עם אהבה לשולחן השבת שלכם
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <a
            href="#menu"
            className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold py-4 px-10 rounded-2xl text-lg transition-all shadow-lg shadow-amber-500/30"
          >
            לתפריט המלא
            <span className="text-xl">←</span>
          </a>
          <a
            href="#about"
            className="inline-flex items-center justify-center border-2 border-white/40 hover:border-white/80 hover:bg-white/10 text-white font-semibold py-4 px-10 rounded-2xl text-lg transition-all"
          >
            קראו עלינו
          </a>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <CountdownTimer />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
      >
        <span className="text-xs font-light tracking-widest">גלגל מטה</span>
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </motion.div>
    </section>
  );
}
