"use client";

import { useState, useEffect } from "react";
import { Clock, AlertCircle } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getNextDeadline(): Date {
  const now = new Date();
  const thursday = 4; // 0=Sun … 6=Sat
  let daysUntil = (thursday - now.getDay() + 7) % 7;

  const deadline = new Date(now);
  deadline.setDate(now.getDate() + daysUntil);
  deadline.setHours(20, 0, 0, 0);

  // If today IS Thursday and we already passed 20:00 → next Thursday
  if (daysUntil === 0 && now >= deadline) {
    deadline.setDate(deadline.getDate() + 7);
  }

  return deadline;
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const deadline = getNextDeadline();

    const tick = () => {
      const diff = deadline.getTime() - Date.now();
      if (diff <= 0) {
        setExpired(true);
        return;
      }
      setTimeLeft({
        days:    Math.floor(diff / 86_400_000),
        hours:   Math.floor((diff % 86_400_000) / 3_600_000),
        minutes: Math.floor((diff % 3_600_000)  / 60_000),
        seconds: Math.floor((diff % 60_000)      / 1_000),
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!timeLeft && !expired) return null;

  if (expired) {
    return (
      <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-400/40 rounded-2xl px-6 py-3 text-white">
        <AlertCircle size={18} className="text-red-400" />
        <span className="font-bold text-sm">ההזמנות סגורות — ממתין למחזור הבא</span>
      </div>
    );
  }

  const units = [
    { value: timeLeft!.days,    label: "ימים" },
    { value: timeLeft!.hours,   label: "שעות" },
    { value: timeLeft!.minutes, label: "דקות" },
    { value: timeLeft!.seconds, label: "שניות" },
  ];

  return (
    <div className="inline-flex flex-col items-center gap-3 bg-white/10 backdrop-blur-md border border-white/25 rounded-2xl px-6 py-4">
      <div className="flex items-center gap-2 text-amber-300 text-sm font-semibold">
        <Clock size={15} />
        <span>ההזמנות נסגרות ביום חמישי בשעה 20:00</span>
      </div>

      <div className="flex gap-5 text-white">
        {units.map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center min-w-[48px]">
            <span className="text-4xl font-black tabular-nums leading-none">
              {String(value).padStart(2, "0")}
            </span>
            <span className="text-xs text-white/65 font-medium mt-1">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
