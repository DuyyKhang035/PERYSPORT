'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Check, X, Upload, FileText } from 'lucide-react';
import { formatDate, slugify } from '@/lib/tien-ich';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    image: '',
    status: 'published',
    seoTitle: '',
    seoDescription: '',
  });
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState('');

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      if (data.success) setPosts(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleOpenModal = (p = null) => {
    if (p) {
      setEditingPost(p);
      setForm({
        title: p.title,
        slug: p.slug,
        summary: p.summary || '',
        content: p.content,
        image: p.image || '',
        status: p.status || 'published',
        seoTitle: p.seoTitle || '',
        seoDescription: p.seoDescription || '',
      });
    } else {
      setEditingPost(null);
      setForm({
        title: '',
        slug: '',
        summary: '',
        content: '',
        image: '',
        status: 'published',
        seoTitle: '',
        seoDescription: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (data.success) {
        setForm((prev) => ({ ...prev, image: data.url }));
        showToast('Tải ảnh bài viết thành công');
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Lỗi tải ảnh');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingPost ? `/api/posts/${editingPost._id}` : '/api/posts';
      const method = editingPost ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchPosts();
        showToast(editingPost ? 'Cập nhật bài viết thành công' : 'Đăng bài viết thành công');
      } else {
        alert(data.message);
      }
    } catch (e) {
      alert('Lỗi lưu bài viết');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      try {
        const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          fetchPosts();
          showToast('Đã xóa bài viết');
        } else {
          alert(data.message);
        }
      } catch (e) {
        alert('Lỗi khi xóa bài viết');
      }
    }
  };

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#10243A] text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" /> {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#10243A]">Quản Lý Bài Viết & Blog</h1>
          <p className="text-xs text-slate-500 mt-1">Viết bài chia sẻ kinh nghiệm, mẹo chọn giày và tin tức thương hiệu</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-[#10243A] hover:bg-[#F97316] text-white text-xs font-extrabold px-5 py-3 rounded-xl transition-colors flex items-center gap-2 shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" /> Đăng Bài Viết Mới
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Tìm bài viết theo tiêu đề..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs bg-transparent focus:outline-none"
        />
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-12 text-center text-xs font-bold text-slate-400">Đang tải bài viết...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">Chưa có bài viết nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold">
                  <th className="p-4">Ảnh đại diện</th>
                  <th className="p-4">Tiêu Đề Bài Viết</th>
                  <th className="p-4">Trạng Thái</th>
                  <th className="p-4">Ngày Đăng</th>
                  <th className="p-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="w-14 h-10 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden">
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-[#10243A] block line-clamp-1">{p.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{p.slug}</span>
                    </td>
                    <td className="p-4">
                      {p.status === 'published' ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Đã xuất bản</span>
                      ) : (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Bản nháp</span>
                      )}
                    </td>
                    <td className="p-4 text-slate-500">{formatDate(p.createdAt)}</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(p)}
                        className="p-2 text-slate-600 hover:text-[#10243A] hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-[#10243A]">
                {editingPost ? 'Chỉnh Sửa Bài Viết' : 'Soạn Bài Viết Mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tiêu Đề Bài Viết (*)</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#10243A]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Slug URL</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Ảnh Đại Diện (URL)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                  />
                  <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl cursor-pointer flex items-center gap-1 font-bold shrink-0">
                    <Upload className="w-4 h-4" />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tóm Tắt Ngắn</label>
                <textarea
                  rows={2}
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nội Dung Chi Tiết (*)</label>
                <textarea
                  rows={8}
                  required
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Trạng Thái Bài Viết</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                >
                  <option value="published">Xuất bản ngay</option>
                  <option value="draft">Lưu bản nháp</option>
                </select>
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-[#10243A] hover:bg-[#F97316] text-white font-bold rounded-xl transition-colors"
                >
                  Lưu Bài Viết
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
