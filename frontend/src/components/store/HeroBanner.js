'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HeroBanner({ initialBanners = [] }) {
  return (
    <div className="relative w-full bg-[#10243A] overflow-hidden">
      <div className="relative min-h-[380px] md:min-h-[480px] lg:min-h-[520px] flex items-center">

        {/* Background Image — banner.png cố định */}
        <div className="absolute inset-0 z-0">
          <img
            src="/banner.png"
            alt="PERY SPORT Banner"
            className="w-full h-full object-cover object-center opacity-60 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#10243A] via-[#10243A]/70 to-transparent" />
        </div>

        {/* Content Box */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white max-w-2xl">
          <span className="inline-block bg-[#F97316] text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            PERY SPORT 2026
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-4 text-white drop-shadow-md">
            ĐỈNH CAO THỂ THAO NAM
          </h1>
          <p className="text-slate-300 text-sm md:text-base mb-8 leading-relaxed font-normal">
            Thiết kế tối giản, công nghệ đệm êm ái, bứt phá từng bước chạy.
          </p>
          <div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-extrabold px-8 py-4 rounded-xl text-sm md:text-base transition-all transform hover:-translate-y-0.5 shadow-xl"
            >
              Khám Phá Ngay <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
