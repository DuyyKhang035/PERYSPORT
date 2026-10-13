'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, Tag } from 'lucide-react';
import { formatVND, formatDate } from '@/lib/tien-ich';

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [form, setForm] = useState({
    name: '',
    type: 'percentage',
    value: 10,
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    isActive: true,
  });
  const [toast, setToast] = useState('');

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/promotions');
      const data = await res.json();
      if (data.success) setPromotions(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleOpenModal = (p = null) => {
    if (p) {
      setEditingPromo(p);
      setForm({
        name: p.name,
        type: p.type,
        value: p.value,
        startDate: new Date(p.startDate).toISOString().slice(0, 16),
        endDate: new Date(p.endDate).toISOString().slice(0, 16),
        isActive: p.isActive,
      });
    } else {
      setEditingPromo(null);
      setForm({
        name: '',
        type: 'percentage',
        value: 10,
        startDate: new Date().toISOString().slice(0, 16),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingPromo ? `/api/promotions/${editingPromo._id}` : '/api/promotions';
      const method = editingPromo ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchPromotions();
        showToast(editingPromo ? 'Cập nhật khuyến mãi thành công' : 'Tạo mới khuyến mãi thành công');
      } else {
        alert(data.message);
      }
    } catch (e) {
      alert('Lỗi lưu khuyến mãi');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa chương trình khuyến mãi này?')) {
      try {
        const res = await fetch(`/api/promotions/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          fetchPromotions();
          showToast('Đã xóa chương trình khuyến mãi');
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
          <h1 className="text-2xl font-black text-[#10243A]">Quản Lý Khuyến Mãi & Hot Deals</h1>
          <p className="text-xs text-slate-500 mt-1">Chương trình giảm giá % hoặc cố định trong khoảng thời gian</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-[#10243A] hover:bg-[#F97316] text-white text-xs font-extrabold px-5 py-3 rounded-xl transition-colors flex items-center gap-2 shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" /> Tạo Chương Trình Mới
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-12 text-center text-xs font-bold text-slate-400">Đang tải khuyến mãi...</div>
        ) : promotions.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">Chưa có chương trình khuyến mãi nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold">
                  <th className="p-4">Tên Chương Trình</th>
                  <th className="p-4">Loại Giảm</th>
                  <th className="p-4">Giá Trị</th>
                  <th className="p-4">Ngày Bắt Đầu</th>
                  <th className="p-4">Ngày Kết Thúc</th>
                  <th className="p-4">Trạng Thái</th>
                  <th className="p-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {promotions.map((p) => {
                  const now = new Date();
                  const isRunning = p.isActive && new Date(p.startDate) <= now && now <= new Date(p.endDate);
                  return (
                    <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-[#10243A]">{p.name}</td>
                      <td className="p-4">
                        <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          {p.type === 'percentage' ? 'Phần trăm %' : 'Số tiền cố định'}
                        </span>
                      </td>
                      <td className="p-4 font-black text-[#F97316]">
                        {p.type === 'percentage' ? `${p.value}%` : formatVND(p.value)}
                      </td>
                      <td className="p-4 text-slate-600">{formatDate(p.startDate)}</td>
                      <td className="p-4 text-slate-600">{formatDate(p.endDate)}</td>
                      <td className="p-4">
                        {isRunning ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Đang diễn ra</span>
                        ) : p.isActive ? (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Kích hoạt</span>
                        ) : (
                          <span className="bg-slate-100 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full">Tắt</span>
                        )}
                      </td>
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
                  );
                })}
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
                {editingPromo ? 'Chỉnh Sửa Khuyến Mãi' : 'Thêm Khuyến Mãi Mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tên Chương Trình (*)</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="VD: Siêu Sale Mùa Hè 30%"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#10243A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Loại Khuyến Mãi</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                  >
                    <option value="percentage">Giảm theo %</option>
                    <option value="fixed">Giảm số tiền cố định (₫)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Giá Trị Giảm (*)</label>
                  <input
                    type="number"
                    required
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: parseFloat(e.target.value) || 0 })}
                    placeholder="30 hoặc 200000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Thời Gian Bắt Đầu (*)</label>
                  <input
                    type="datetime-local"
                    required
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Thời Gian Kết Thúc (*)</label>
                  <input
                    type="datetime-local"
                    required
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="accent-[#F97316] w-4 h-4"
                  />
                  Kích Hoạt Chương Trình
                </label>
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
                  Lưu Khuyến Mãi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
