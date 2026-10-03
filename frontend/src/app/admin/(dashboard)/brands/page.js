'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Check, X, Upload } from 'lucide-react';

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    logo: '',
    description: '',
    isActive: true,
    showOnHomepage: false,
    displayOrder: 0,
  });
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState('');

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/brands');
      const data = await res.json();
      if (data.success) setBrands(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleOpenModal = (brand = null) => {
    if (brand) {
      setEditingBrand(brand);
      setForm({
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo || '',
        description: brand.description || '',
        isActive: brand.isActive,
        showOnHomepage: brand.showOnHomepage || false,
        displayOrder: brand.displayOrder || 0,
      });
    } else {
      setEditingBrand(null);
      setForm({
        name: '',
        slug: '',
        logo: '',
        description: '',
        isActive: true,
        showOnHomepage: false,
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
        setForm((prev) => ({ ...prev, logo: data.url }));
        showToast('Tải ảnh logo thành công');
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
      const url = editingBrand ? `/api/brands/${editingBrand._id}` : '/api/brands';
      const method = editingBrand ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchBrands();
        showToast(editingBrand ? 'Cập nhật thành công' : 'Tạo mới thương hiệu thành công');
      } else {
        alert(data.message);
      }
    } catch (e) {
      alert('Lỗi lưu thương hiệu');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) {
      try {
        const res = await fetch(`/api/brands/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          fetchBrands();
          showToast('Đã xóa thương hiệu');
        } else {
          alert(data.message);
        }
      } catch (e) {
        alert('Lỗi khi xóa');
      }
    }
  };

  const filteredBrands = brands.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#10243A] text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" /> {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#10243A]">Quản Lý Thương Hiệu</h1>
          <p className="text-xs text-slate-500 mt-1">Danh sách đối tác & thương hiệu giày thể thao</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-[#10243A] hover:bg-[#F97316] text-white text-xs font-extrabold px-5 py-3 rounded-xl transition-colors flex items-center gap-2 shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" /> Thêm Thương Hiệu Mới
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Tìm kiếm thương hiệu theo tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs bg-transparent focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-12 text-center text-xs font-bold text-slate-400">Đang tải thương hiệu...</div>
        ) : filteredBrands.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">Không tìm thấy thương hiệu nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold">
                  <th className="p-4">Logo</th>
                  <th className="p-4">Tên Thương Hiệu</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Hiện Trang Chủ</th>
                  <th className="p-4">Thứ Tự</th>
                  <th className="p-4">Trạng Thái</th>
                  <th className="p-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredBrands.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden p-1">
                        {b.logo ? (
                          <img src={b.logo} alt={b.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <img src="/logoThay2.png" alt="PERY SPORT" className="w-full h-full object-cover rounded-lg" />
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-[#10243A]">{b.name}</td>
                    <td className="p-4 font-mono text-slate-500">{b.slug}</td>
                    <td className="p-4">
                      {b.showOnHomepage ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Có</span>
                      ) : (
                        <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">Không</span>
                      )}
                    </td>
                    <td className="p-4 font-bold text-slate-700">{b.displayOrder}</td>
                    <td className="p-4">
                      {b.isActive ? (
                        <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Hoạt động</span>
                      ) : (
                        <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Ẩn</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(b)}
                        className="p-2 text-slate-600 hover:text-[#10243A] hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(b._id)}
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

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-[#10243A]">
                {editingBrand ? 'Chỉnh Sửa Thương Hiệu' : 'Thêm Thương Hiệu Mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tên Thương Hiệu (*)</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#10243A]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Logo Thương Hiệu URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.logo}
                    onChange={(e) => setForm({ ...form, logo: e.target.value })}
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
                <label className="font-bold text-slate-700 block mb-1">Mô Tả Nắn</label>
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
                <div className="space-y-2 pt-4">
                  <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.showOnHomepage}
                      onChange={(e) => setForm({ ...form, showOnHomepage: e.target.checked })}
                      className="accent-[#F97316] w-4 h-4"
                    />
                    Hiện Trang Chủ
                  </label>
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
                  Lưu Thương Hiệu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
