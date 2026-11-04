'use client';

import React, { useState, useEffect } from 'react';
import { Flame, Clock } from 'lucide-react';

export default function HotDealCountdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });

  useEffect(() => {
    const end = targetDate ? new Date(targetDate).getTime() : Date.now() + 14 * 24 * 60 * 60 * 1000;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = end - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + Math.floor(difference / (1000 * 60 * 60 * 24)) * 24;
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 text-[#F97316] font-black text-sm uppercase tracking-wider">
        <Flame className="w-5 h-5 fill-[#F97316] animate-bounce" /> Hot Deal Kết Thúc Sau:
      </div>
      <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-white">
        <span className="bg-[#10243A] px-2.5 py-1 rounded-md shadow-xs border border-slate-700">
          {String(timeLeft.hours).padStart(2, '0')}h
        </span>
        <span className="text-slate-400">:</span>
        <span className="bg-[#10243A] px-2.5 py-1 rounded-md shadow-xs border border-slate-700">
          {String(timeLeft.minutes).padStart(2, '0')}m
        </span>
        <span className="text-slate-400">:</span>
        <span className="bg-[#F97316] px-2.5 py-1 rounded-md shadow-xs font-black">
          {String(timeLeft.seconds).padStart(2, '0')}s
        </span>
      </div>
    </div>
  );
}
