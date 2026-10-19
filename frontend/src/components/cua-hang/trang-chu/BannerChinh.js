'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function HeroBanner({ initialBanners = [] }) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [routes, setRoutes] = useState([
    '/',
    '/san-pham',
    '/san-pham?hotDeal=true',
    '/thuong-hieu',
    '/tin-tuc',
    '/lien-he',
  ]);

  // Load categories to insert them into the route cycle
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories?active=true');
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          const catRoutes = data.data.map((cat) => `/san-pham?category=${cat.slug}`);
          setRoutes([
            '/',
            '/san-pham',
            '/san-pham?hotDeal=true',
            ...catRoutes,
            '/thuong-hieu',
            '/tin-tuc',
            '/lien-he',
          ]);
        }
      } catch (e) {
        // silently fail — default routes still work
      }
    }
    loadCategories();
  }, []);

  const handleClick = useCallback(() => {
    const nextIndex = (currentIndex + 1) % routes.length;
    setCurrentIndex(nextIndex);
    router.push(routes[nextIndex]);
  }, [currentIndex, routes, router]);

  return (
    <div
      className="relative w-full bg-[#10243A] overflow-hidden cursor-pointer select-none"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
      aria-label="Chuyển trang theo danh mục"
    >
      <div className="relative min-h-[380px] md:min-h-[480px] lg:min-h-[520px] flex items-center">

        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/Bannermoipng.png"
            alt="PERY SPORT Banner"
            className="w-full h-full object-cover object-center transition-all duration-700"
          />
        </div>


        {/* Subtle click hint */}
        <div className="absolute bottom-6 right-6 z-10 flex items-center gap-2 text-white/40 text-xs font-semibold pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-[#F97316]/70 animate-pulse inline-block" />
          Click để khám phá
        </div>

        {/* Progress dots — chỉ 2 chấm */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2 pointer-events-none">
          <span className="block w-5 h-1.5 rounded-full bg-[#F97316]" />
          <span className="block w-1.5 h-1.5 rounded-full bg-white/30" />
        </div>

      </div>
    </div>
  );
}
