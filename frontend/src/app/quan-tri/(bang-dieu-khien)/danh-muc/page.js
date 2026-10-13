'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Check, X, Upload } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    isActive: true,
    displayOrder: 0,
  });
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleOpenModal = (cat = null) => {
    if (cat) {
      setEditingCategory(cat);
      setForm({
        name: cat.name,
        slug: cat.slug,
        description: cat.description || '',
        image: cat.image || '',
        isActive: cat.isActive,
        displayOrder: cat.displayOrder || 0,
      });
    } else {
      setEditingCategory(null);
      setForm({
        name: '',
        slug: '',
        description: '',
        image: '',
        isActive: true,
        displayOrder: 0,
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

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setForm((prev) => ({ ...prev, image: data.url }));
        showToast('Tải ảnh danh mục thành công');
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
      const url = editingCategory ? `/api/categories/${editingCategory._id}` : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchCategories();
        showToast(editingCategory ? 'Cập nhật danh mục thành công' : 'Tạo mới danh mục thành công');
      } else {
        alert(data.message);
      }
    } catch (e) {
      alert('Lỗi lưu danh mục');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      try {
        const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          fetchCategories();
          showToast('Đã xóa danh mục');
        } else {
          alert(data.message);
        }
      } catch (e) {
        alert('Lỗi khi xóa');
      }
    }
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
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
          <h1 className="text-2xl font-black text-[#10243A]">Quản Lý Dòng Giày / Chức Năng</h1>
          <p className="text-xs text-slate-500 mt-1">Quản lý các nhóm chức năng (Chạy bộ, Gym, Đi bộ, Bóng rổ, Thời trang...)</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-[#10243A] hover:bg-[#F97316] text-white text-xs font-extrabold px-5 py-3 rounded-xl transition-colors flex items-center gap-2 shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" /> Thêm Danh Mục Mới
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Tìm kiếm theo tên danh mục..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs bg-transparent focus:outline-none"
        />
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-12 text-center text-xs font-bold text-slate-400">Đang tải danh mục...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">Không tìm thấy danh mục nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold">
                  <th className="p-4">Hình Ảnh</th>
                  <th className="p-4">Tên Chức Năng</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Thứ Tự</th>
                  <th className="p-4">Trạng Thái</th>
                  <th className="p-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden">
                        {c.image ? (
                          <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-slate-200 flex items-center justify-center font-bold text-slate-400">C</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-[#10243A]">{c.name}</td>
                    <td className="p-4 font-mono text-slate-500">{c.slug}</td>
                    <td className="p-4 font-bold text-slate-700">{c.displayOrder}</td>
                    <td className="p-4">
                      {c.isActive ? (
                        <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Hoạt động</span>
                      ) : (
                        <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Ẩn</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(c)}
                        className="p-2 text-slate-600 hover:text-[#10243A] hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c._id)}
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
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-[#10243A]">
                {editingCategory ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục Mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tên Danh Mục / Chức Năng (*)</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#10243A]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Hình Ảnh Minh Họa URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                  />
                  <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl cursor-pointer flex items-center gap-1 font-bold shrink-0">
                    <Upload className="w-4 h-4" />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                {uploading && <p className="text-[10px] text-[#F97316] mt-1 font-bold">Đang tải ảnh...</p>}
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mô Tả</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Thứ Tự Hiển Thị</label>
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
                  Lưu Danh Mục
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
