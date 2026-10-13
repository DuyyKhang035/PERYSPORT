import React from 'react';
import Link from 'next/link';
import Header from '@/components/cua-hang/bo-cuc/DauTrang';
import Footer from '@/components/cua-hang/bo-cuc/ChanTrang';
import CartDrawer from '@/components/cua-hang/gio-hang/NganKeGioHang';
import { fetchBackend } from '@/lib/api-may-chu';
import { formatDate } from '@/lib/tien-ich';
import { ArrowRight, BookOpen } from 'lucide-react';

export const revalidate = 60;

async function getPostsData() {
  const response = await fetchBackend('/api/posts?status=published&limit=100');
  return response.data || [];
}

export default async function BlogsPage() {
  const posts = await getPostsData();

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      <CartDrawer />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#F97316] uppercase tracking-widest block mb-1">
            BLOG & KINH NGHIỆM
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-[#10243A]">Kiến Thức Giày Thể Thao Nam</h1>
          <p className="text-xs text-slate-500 mt-2">
            Chia sẻ mẹo chọn giày, cách bảo quản và cập nhật xu hướng thời trang thể thao nam mới nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post._id} className="group bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <Link href={`/tin-tuc/${post.slug}`} className="block aspect-16/9 bg-slate-100 overflow-hidden">
                  <img
                    src={post.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <div className="p-6">
                  <span className="text-[11px] font-bold text-slate-400 block mb-2">
                    {formatDate(post.createdAt)}
                  </span>
                  <Link href={`/tin-tuc/${post.slug}`}>
                    <h2 className="text-base font-bold text-[#10243A] group-hover:text-[#F97316] transition-colors line-clamp-2 mb-2 leading-snug">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {post.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href={`/tin-tuc/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#F97316] hover:underline"
                >
                  Đọc Bài Viết <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
