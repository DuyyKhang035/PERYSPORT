'use client';

import React, { useState, useEffect } from 'react';
import { Check, Upload, Image as ImageIcon, Save, RotateCcw, ExternalLink, Loader2, Sparkles } from 'lucide-react';

export default function AdminBannersPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState('');

  // Banner State (Chỉ quản lý đúng 1 banner duy nhất của trang chủ)
  const [bannerId, setBannerId] = useState(null);
  const [desktopImage, setDesktopImage] = useState('/banneruutien.png');
  const [title, setTitle] = useState('PERY SPORT - Đỉnh Cao Thể Thao Nam');
  const [description, setDescription] = useState('Khám phá các dòng giày thể thao nam cao cấp tại PERY SPORT.');
  const [isActive, setIsActive] = useState(true);

  const fetchBanner = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/banners');
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        const b = data.data[0];
        setBannerId(b._id);
        setDesktopImage(b.desktopImage || '/banneruutien.png');
        setTitle(b.title || 'PERY SPORT - Đỉnh Cao Thể Thao Nam');
        setDescription(b.description || '');
        setIsActive(b.isActive !== undefined ? b.isActive : true);
      } else {
        // Mặc định ban đầu dùng ảnh trang chủ hiện tại
        setBannerId(null);
        setDesktopImage('/banneruutien.png');
      }
    } catch (e) {
      console.error('Lỗi tải banner:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Upload ảnh mới từ thiết bị
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
        setDesktopImage(data.url);
        showToast('Đã tải ảnh banner lên thành công');
      } else {
        alert(data.message || 'Lỗi tải ảnh');
      }
    } catch (err) {
      alert('Lỗi tải ảnh lên máy chủ');
    } finally {
      setUploading(false);
    }
  };

  // Khôi phục lại ảnh mặc định ban đầu
  const handleResetDefault = () => {
    if (confirm('Khôi phục về ảnh banner mặc định (/banneruutien.png)?')) {
      setDesktopImage('/banneruutien.png');
      showToast('Đã chuyển về ảnh banner mặc định');
    }
  };

  // Lưu Banner vào cơ sở dữ liệu
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: title || 'PERY SPORT Banner',
        description,
        desktopImage: desktopImage || '/banneruutien.png',
        mobileImage: desktopImage || '/banneruutien.png',
        ctaText: 'Khám Phá Ngay',
        ctaLink: '/products',
        displayOrder: 0,
        isActive,
      };

      const url = bannerId ? `/api/banners/${bannerId}` : '/api/banners';
      const method = bannerId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        if (!bannerId && data.data?._id) {
          setBannerId(data.data._id);
        }
        showToast('Cập nhật Banner Trang Chủ thành công!');
      } else {
        alert(data.message || 'Lỗi khi lưu banner');
      }
    } catch (e) {
      alert('Lỗi kết nối máy chủ');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#10243A]" />
        <p className="text-xs text-slate-500 font-semibold">Đang tải dữ liệu Banner Trang Chủ...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Toast thông báo */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#10243A] text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" /> {toast}
        </div>
      )}

      {/* Header trang */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#10243A]">Quản Lý Banner Trang Chủ</h1>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Đang Áp Dụng
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Chỉnh sửa duy nhất một hình ảnh bìa chính hiển thị trên đỉnh đầu của Trang Chủ PERY SPORT.
          </p>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-[#10243A] hover:text-white text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs shrink-0"
        >
          <span>Xem Trang Chủ</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Khung Xem Trước Banner Trang Chủ */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-[#10243A] flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#F97316]" />
              Hình Ảnh Banner Hiện Tại Trên Trang Chủ
            </h2>
            <span className="text-[11px] text-slate-400 font-medium">
              Khuyến nghị: Tỉ lệ 16:9 hoặc 21:9 (ảnh ngang sắc nét)
            </span>
          </div>

          {/* Banner Preview Frame */}
          <div className="relative w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 aspect-16/9 md:aspect-21/9 shadow-inner group">
            <img
              src={desktopImage}
              alt={title}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />

            {/* Label watermark preview */}
            <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20">
              Live Preview: Trang Chủ
            </div>

            <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-3 py-1 rounded-full border border-white/20">
              URL: {desktopImage}
            </div>
          </div>

          {/* Nút thao tác nhanh với ảnh */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <label className="bg-[#10243A] hover:bg-[#F97316] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-2 shadow-xs">
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang tải ảnh...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Tải Ảnh Mới Lên Từ Máy Tính</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={handleResetDefault}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Khôi Phục Ảnh Gốc (/banneruutien.png)</span>
            </button>
          </div>
        </div>

        {/* Cấu hình chi tiết */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-black text-[#10243A] pb-2 border-b border-slate-100">
            Thông Tin Chi Tiết Banner
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Đường Dẫn Ảnh Desktop URL (*)
              </label>
              <input
                type="text"
                required
                value={desktopImage}
                onChange={(e) => setDesktopImage(e.target.value)}
                placeholder="/banneruutien.png hoặc link https://..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#10243A] font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Bạn có thể bấm nút "Tải Ảnh Mới Lên" ở trên hoặc dán trực tiếp đường dẫn ảnh vào ô này.
              </p>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Tiêu Đề Banner (*)
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: PERY SPORT - ĐỈNH CAO THỂ THAO NAM"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#10243A]"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Mô Tả Banner
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả tóm tắt..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#10243A]"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="accent-[#F97316] w-4 h-4 rounded"
                />
                <span>Kích hoạt hiển thị Banner này trên Trang Chủ</span>
              </label>
            </div>
          </div>
        </div>

        {/* Nút lưu thay đổi */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving || uploading}
            className="bg-[#10243A] hover:bg-[#F97316] text-white text-sm font-extrabold px-8 py-3.5 rounded-2xl transition-all shadow-md hover:shadow-xl inline-flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang Lưu Banner...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Lưu Cập Nhật Banner Trang Chủ</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
