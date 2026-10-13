'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CategoryCarousel({ categories = [] }) {
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  // Cập nhật trạng thái nút sau mỗi lần scroll
  const updateButtons = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateButtons();
    el.addEventListener('scroll', updateButtons, { passive: true });
    window.addEventListener('resize', updateButtons);
    return () => {
      el.removeEventListener('scroll', updateButtons);
      window.removeEventListener('resize', updateButtons);
    };
  }, [categories]);

  const scroll = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    // Tính card width (bao gồm gap 16px)
    const cardEl = el.firstElementChild;
    const step = cardEl ? cardEl.offsetWidth + 16 : 240;
    el.scrollBy({ left: dir === 'next' ? step * 2 : -step * 2, behavior: 'smooth' });
  };

  if (categories.length === 0) return null;

  return (
    <div className="relative">
      {/* Nút trái */}
      <button
        onClick={() => scroll('prev')}
        disabled={!canPrev}
        aria-label="Trước"
        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10
          w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm
          flex items-center justify-center transition-all
          ${canPrev
            ? 'text-[#10243A] hover:border-[#10243A] hover:shadow-md cursor-pointer'
            : 'text-slate-300 border-slate-100 cursor-not-allowed'
          }`}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Track */}
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`.cat-track::-webkit-scrollbar { display: none; }`}</style>

        {categories.map((cat) => (
          <Link
            key={cat._id}
            href={`/san-pham?category=${cat.slug}`}
            className="group relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 shadow-xs hover:shadow-lg transition-all flex-shrink-0"
            style={{ width: 'clamp(140px, 18vw, 220px)', aspectRatio: '4/3' }}
          >
            <img
              src={cat.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'}
              alt={cat.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#10243A]/90 via-[#10243A]/40 to-transparent flex items-end p-4">
              <h3 className="text-sm font-black text-white group-hover:text-[#F97316] transition-colors line-clamp-1">
                {cat.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Nút phải */}
      <button
        onClick={() => scroll('next')}
        disabled={!canNext}
        aria-label="Tiếp theo"
        className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10
          w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm
          flex items-center justify-center transition-all
          ${canNext
            ? 'text-[#10243A] hover:border-[#10243A] hover:shadow-md cursor-pointer'
            : 'text-slate-300 border-slate-100 cursor-not-allowed'
          }`}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
