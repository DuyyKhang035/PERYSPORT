import React from 'react';
import Link from 'next/link';
import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';
import CartDrawer from '@/components/store/CartDrawer';
import { fetchBackend } from '@/lib/server-api';
import { ArrowRight } from 'lucide-react';

export const revalidate = 60;

async function getBrandsData() {
  const response = await fetchBackend('/api/brands?active=true');
  return response.data || [];
}

export default async function BrandsPage() {
  const brands = await getBrandsData();

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      <CartDrawer />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#F97316] uppercase tracking-widest block mb-1">
            ĐỐI TÁC CHÍNH HÃNG
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-[#10243A]">Thương Hiệu Giày Thể Thao Nam</h1>
          <p className="text-xs text-slate-500 mt-2">
            Khám phá các dòng sản phẩm chất lượng từ PERY SPORT và các thương hiệu uy tín thế giới.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {brands.map((brand) => (
            <div
              key={brand._id}
              className="bg-slate-50 p-8 rounded-3xl border border-slate-200/80 hover:shadow-xl hover:border-[#F97316] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white p-2 border border-slate-200 shrink-0 overflow-hidden">
                    <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover rounded-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#10243A] group-hover:text-[#F97316] transition-colors">
                      {brand.name}
                    </h3>
                    <span className="text-xs font-bold text-slate-400">
                      {brand.productCount} mẫu giày sẵn có
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {brand.description}
                </p>
              </div>

              <Link
                href={`/products?brand=${brand.slug}`}
                className="inline-flex items-center justify-between w-full py-3 px-5 bg-white group-hover:bg-[#10243A] group-hover:text-white text-[#10243A] text-xs font-extrabold rounded-xl border border-slate-200 transition-all"
              >
                <span>Xem Sản Phẩm</span>
                <ArrowRight className="w-4 h-4 text-[#F97316]" />
              </Link>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
