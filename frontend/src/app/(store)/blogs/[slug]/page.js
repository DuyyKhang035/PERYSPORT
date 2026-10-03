import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';
import CartDrawer from '@/components/store/CartDrawer';
import { fetchBackend } from '@/lib/server-api';
import { formatDate } from '@/lib/utils';
import { Calendar, ArrowLeft, ArrowRight } from 'lucide-react';

export const revalidate = 60;

async function getPostData(slug) {
  const response = await fetchBackend(`/api/posts/${slug}`);
  if (!response.success || !response.data) return null;
  const relatedResponse = await fetchBackend('/api/posts?status=published&limit=4');
  return {
    post: response.data,
    related: (relatedResponse.data || []).filter((item) => item.slug !== slug).slice(0, 3),
  };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getPostData(slug);
  if (!data || !data.post) return { title: 'Bài viết | PERY SPORT' };

  return {
    title: `${data.post.seoTitle || data.post.title} | PERY SPORT`,
    description: data.post.seoDescription || data.post.summary,
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const data = await getPostData(slug);

  if (!data || !data.post) {
    notFound();
  }

  const { post, related } = data;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      <CartDrawer />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/blogs" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#10243A] font-semibold mb-6">
          <ArrowLeft className="w-3.5 h-3.5" /> Tất cả bài viết
        </Link>

        <article className="space-y-6">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F97316] bg-orange-50 px-3 py-1 rounded-full">
            <Calendar className="w-3.5 h-3.5" /> {formatDate(post.createdAt)}
          </span>

          <h1 className="text-2xl md:text-4xl font-black text-[#10243A] leading-tight">
            {post.title}
          </h1>

          {post.summary && (
            <p className="text-sm font-semibold text-slate-600 italic border-l-4 border-[#F97316] pl-4 py-1">
              {post.summary}
            </p>
          )}

          {post.image && (
            <div className="aspect-16/9 bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="prose max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-line pt-4">
            {post.content}
          </div>
        </article>

        {/* Related Posts */}
        {related.length > 0 && (
          <section className="mt-16 pt-10 border-t border-slate-200">
            <h3 className="text-xl font-black text-[#10243A] mb-6">Bài Viết Liên Quan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((item) => (
                <div key={item._id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <Link href={`/blogs/${item.slug}`} className="block font-bold text-xs text-[#10243A] hover:text-[#F97316] line-clamp-2 mb-2">
                    {item.title}
                  </Link>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{item.summary}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
