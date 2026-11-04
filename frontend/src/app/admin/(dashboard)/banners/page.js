'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, Upload, Image as ImageIcon } from 'lucide-react';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    desktopImage: '',
    mobileImage: '',
    ctaText: 'Khám Phá Ngay',
    ctaLink: '/products',
    displayOrder: 0,
    isActive: true,
  });
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState('');

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/banners');
      const data = await res.json();
      if (data.success) setBanners(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleOpenModal = (b = null) => {
    if (b) {
      setEditingBanner(b);
      setForm({
        title: b.title,
        description: b.description || '',
        desktopImage: b.desktopImage,
        mobileImage: b.mobileImage || b.desktopImage,
        ctaText: b.ctaText || 'Khám Phá Ngay',
        ctaLink: b.ctaLink || '/products',
        displayOrder: b.displayOrder || 0,
        isActive: b.isActive,
      });
    } else {
      setEditingBanner(null);
      setForm({
        title: '',
        description: '',
        desktopImage: '',
        mobileImage: '',
        ctaText: 'Khám Phá Ngay',
        ctaLink: '/products',
        displayOrder: 0,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (data.success) {
        setForm((prev) => ({ ...prev, [field]: data.url }));
        showToast('Tải ảnh banner thành công');
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
      const url = editingBanner ? `/api/banners/${editingBanner._id}` : '/api/banners';
      const method = editingBanner ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchBanners();
        showToast(editingBanner ? 'Cập nhật banner thành công' : 'Tạo mới banner thành công');
      } else {
        alert(data.message);
      }
    } catch (e) {
      alert('Lỗi lưu banner');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa banner này?')) {
      try {
        const res = await fetch(`/api/banners/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          fetchBanners();
          showToast('Đã xóa banner');
        } else {
          alert(data.message);
        }
      } catch (e) {
        alert('Lỗi khi xóa');
      }
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#10243A] text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" /> {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#10243A]">Quản Lý Hero Banner Slider</h1>
          <p className="text-xs text-slate-500 mt-1">Ảnh bìa trang chủ, tiêu đề, mô tả và đường dẫn nút bấm CTA</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-[#10243A] hover:bg-[#F97316] text-white text-xs font-extrabold px-5 py-3 rounded-xl transition-colors flex items-center gap-2 shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" /> Thêm Banner Mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((b) => (
          <div key={b._id} className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs space-y-4 p-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="aspect-16/9 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
                <img src={b.desktopImage} alt={b.title} className="w-full h-full object-cover" />
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Thứ tự: {b.displayOrder}</span>
                <h3 className="text-base font-black text-[#10243A] line-clamp-1">{b.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{b.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div>
                {b.isActive ? (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Hiển thị</span>
                ) : (
                  <span className="bg-slate-100 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full">Ẩn</span>
                )}
              </div>

              <div className="space-x-2">
                <button
                  onClick={() => handleOpenModal(b)}
                  className="p-2 text-slate-600 hover:text-[#10243A] hover:bg-slate-100 rounded-lg transition-colors inline-block"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(b._id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-block"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-[#10243A]">
                {editingBanner ? 'Chỉnh Sửa Banner' : 'Thêm Banner Mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tiêu Đề Banner (*)</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="VD: PERY SPORT - ĐỈNH CAO THỂ THAO NAM"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#10243A]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mô Tả Ngắn</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Ảnh Desktop URL (*)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={form.desktopImage}
                    onChange={(e) => setForm({ ...form, desktopImage: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                  />
                  <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl cursor-pointer flex items-center gap-1 font-bold shrink-0">
                    <Upload className="w-4 h-4" />
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'desktopImage')} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nút Nút Bấm (CTA)</label>
                  <input
                    type="text"
                    value={form.ctaText}
                    onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Đường Dẫn Link</label>
                  <input
                    type="text"
                    value={form.ctaLink}
                    onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Thứ Tự Bán Hiển Thị</label>
                  <input
                    type="number"
                    value={form.displayOrder}
                    onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                  />
                </div>
                <div className="pt-6">
                  <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="accent-[#F97316] w-4 h-4"
                    />
                    Hoạt Động
                  </label>
                </div>
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
                  Lưu Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
