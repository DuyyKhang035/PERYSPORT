'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import ProductCard from '@/components/cua-hang/san-pham/TheSanPham';

export default function BrandShowcase({ brands = [] }) {
  // Tab đang active: null = "Tất Cả", hoặc brand._id
  const [activeId, setActiveId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const activeBrand = brands.find((b) => b._id === activeId) || null;

  const fetchProducts = useCallback(async (brandSlug) => {
    setLoading(true);
    try {
      const url = brandSlug
        ? `/api/products?brand=${brandSlug}&limit=4&sort=best-selling`
        : `/api/products?limit=5&sort=best-selling`;
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data.data || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load sản phẩm khi tab thay đổi
  useEffect(() => {
    fetchProducts(activeBrand?.slug || null);
  }, [activeBrand, fetchProducts]);

  if (brands.length === 0) return null;

  const viewAllHref = activeBrand
    ? `/san-pham?brand=${activeBrand.slug}`
    : '/san-pham';

  return (
    <section className="py-14 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Tiêu đề */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-[#10243A] mb-2">Thương Hiệu Nổi Bật</h2>
          <p className="text-xs text-slate-500">Sản phẩm chính hãng từ thương hiệu giày thể thao hàng đầu</p>
        </div>

        {/* Tabs: Tất Cả + từng thương hiệu */}
        <div className="flex items-center gap-2 flex-wrap justify-center mb-8">
          <button
            onClick={() => setActiveId(null)}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200
              ${activeId === null
                ? 'bg-[#10243A] text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-[#10243A] hover:text-[#10243A]'
              }`}
          >
            Tất Cả
          </button>
          {brands.map((brand) => (
            <button
              key={brand._id}
              onClick={() => setActiveId(brand._id)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200
                ${activeId === brand._id
                  ? 'bg-[#F97316] text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-[#F97316] hover:text-[#F97316]'
                }`}
            >
              {brand.name}
            </button>
          ))}
        </div>

        {/* Sản phẩm */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#10243A]" />
          </div>
        ) : products.length > 0 ? (
          <>
            <div className={`grid gap-6 ${
              products.length <= 4
                ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-4'
                : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5'
            }`}>
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Xem thêm */}
            <div className="mt-8 text-center">
              <Link
                href={viewAllHref}
                className="inline-flex items-center gap-2 bg-[#10243A] hover:bg-[#F97316] text-white text-xs font-bold px-6 py-3 rounded-full transition-colors shadow-sm"
              >
                Xem tất cả {activeBrand ? activeBrand.name : 'sản phẩm'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        ) : (
          <p className="text-center text-sm text-slate-400 py-12">Chưa có sản phẩm nào.</p>
        )}

      </div>
    </section>
  );
}
