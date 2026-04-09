"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Leaf, Clock, Award } from "lucide-react";

const values = [
  { icon: Heart,  title: "מבושל עם אהבה",      desc: "כל מנה מוכנה בבית עם מרכיבים שנבחרו בקפידה" },
  { icon: Leaf,   title: "מרכיבים טריים",       desc: "קנייה טרייה בכל שבוע ישירות מהשוק" },
  { icon: Clock,  title: "מוכן ביום שישי",      desc: "האוכל מגיע חם וטרי בבוקר שישי" },
  { icon: Award,  title: "מתכונים מסורתיים",    desc: "עשרות שנים של ניסיון וסבלנות במטבח" },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 px-4 bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">
              הסיפור שלנו
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-brown-900 mb-6 leading-tight">
              אוכל ביתי,
              <br />
              <span className="text-amber-500">כמו בבית סבתא</span>
            </h2>
            <p className="text-brown-600 text-lg leading-relaxed mb-5">
              שבת פוד נוסדה מתוך אהבה עמוקה לאוכל ביתי ומסורתי. אנחנו
              משפחה שמאמינה שהאוכל הכי טוב נולד במטבח ביתי, עם מתכונים
              שעברו מדור לדור.
            </p>
            <p className="text-brown-500 leading-relaxed mb-8">
              כל שבוע אנחנו מכינים מנות טריות שמגיעות ישירות לשולחן השבת
              שלכם — עם כל הניחוח, החמימות והאהבה שהכנה ביתית מביאה איתה.
            </p>

            {/* Values grid */}
            <div className="grid grid-cols-2 gap-4">
              {values.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-3 items-start">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon size={18} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="font-bold text-brown-900 text-sm">{title}</p>
                    <p className="text-brown-500 text-xs leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="relative h-[480px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80"
                alt="מטבח ביתי חמים"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {/* Decorative overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent" />
            </div>

            {/* Floating stat card */}
            <div className="absolute -bottom-6 -start-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center">
                <span className="text-2xl">🍽️</span>
              </div>
              <div>
                <p className="text-2xl font-black text-brown-900">500+</p>
                <p className="text-xs text-brown-500 font-medium">משפחות מרוצות בכל שבוע</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
