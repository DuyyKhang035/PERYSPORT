'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Loader2, ArrowRight } from 'lucide-react';
import ProductCard from '@/components/cua-hang/san-pham/TheSanPham';

export default function CategoryShowcase({ categories = [] }) {
  // null = "Tất Cả", hoặc category._id
  const [activeId, setActiveId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Carousel refs
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const activeCategory = categories.find((c) => c._id === activeId) || null;

  /* ─── Fetch products khi tab thay đổi ─── */
  const fetchProducts = useCallback(async (categorySlug) => {
    setLoading(true);
    try {
      const url = categorySlug
        ? `/api/products?category=${categorySlug}&limit=4&sort=best-selling`
        : `/api/products?limit=8&sort=best-selling`;
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data.data || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(activeCategory?.slug || null);
  }, [activeCategory, fetchProducts]);

  /* ─── Carousel scroll logic ─── */
  const updateButtons = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

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
  }, [categories, updateButtons]);

  const scroll = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const cardEl = el.firstElementChild;
    const step = cardEl ? cardEl.offsetWidth + 8 : 120;
    el.scrollBy({ left: dir === 'next' ? step * 3 : -step * 3, behavior: 'smooth' });
  };

  if (categories.length === 0) return null;

  const viewAllHref = activeCategory
    ? `/san-pham?category=${activeCategory.slug}`
    : '/san-pham';

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


        {/* Header */}
        <div className="text-left mb-6">
          <h2 className="text-2xl font-black text-[#10243A]">Dòng Giày Theo Chức Năng</h2>
          <p className="text-xs text-slate-500 mt-1">Lựa chọn chuyên biệt cho từng môn thể thao</p>
          <Link href={viewAllHref} className="text-xs font-bold text-[#F97316] hover:underline inline-flex items-center gap-1 mt-2">
            Xem tất cả <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Carousel (hien khi tab = Tat Ca) */}
        {activeId === null && (
          <div className="relative mb-10">
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

            <div
              ref={trackRef}
              className="flex gap-4 overflow-x-auto scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setActiveId(cat._id)}
                  className="group relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 shadow-xs hover:shadow-lg transition-all flex-shrink-0 cursor-pointer"
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
                </button>
              ))}
            </div>

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
        )}

        {/* Products khi chon tab category cu the */}
        {activeId !== null && (
          <>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#10243A]" />
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-4">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <Link
                    href={viewAllHref}
                    className="inline-flex items-center gap-2 bg-[#10243A] hover:bg-[#F97316] text-white text-xs font-bold px-6 py-3 rounded-full transition-colors shadow-sm"
                  >
                    Xem tất cả {activeCategory ? activeCategory.name : 'sản phẩm'}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </>
            ) : (
              <p className="text-center text-sm text-slate-400 py-12">Chưa có sản phẩm nào.</p>
            )}
          </>
        )}

      </div>
    </section>
  );
}
