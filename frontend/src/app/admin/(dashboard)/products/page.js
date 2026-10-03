'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Search, Check, Star } from 'lucide-react';
import { formatVND } from '@/lib/utils';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products?activeOnly=false&limit=100');
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleDelete = async (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi cơ sở dữ liệu?')) {
      try {
        const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          fetchProducts();
          showToast('Đã xóa sản phẩm thành công');
        } else {
          alert(data.message);
        }
      } catch (e) {
        alert('Lỗi khi xóa sản phẩm');
      }
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand?.name && p.brand.name.toLowerCase().includes(search.toLowerCase()))
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
          <h1 className="text-2xl font-black text-[#10243A]">Quản Lý Sản Phẩm Giày</h1>
          <p className="text-xs text-slate-500 mt-1">Danh sách tất cả mẫu giày, biến thể màu-size, giá và tồn kho</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-[#10243A] hover:bg-[#F97316] text-white text-xs font-extrabold px-5 py-3 rounded-xl transition-colors flex items-center gap-2 shadow-md shrink-0 inline-flex"
        >
          <Plus className="w-4 h-4" /> Thêm Sản Phẩm Mới
        </Link>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm theo tên hoặc thương hiệu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs bg-transparent focus:outline-none"
        />
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-12 text-center text-xs font-bold text-slate-400">Đang tải sản phẩm...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">Không tìm thấy sản phẩm nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold">
                  <th className="p-4">Ảnh</th>
                  <th className="p-4">Tên Sản Phẩm</th>
                  <th className="p-4">Thương Hiệu</th>
                  <th className="p-4">Giá Gốc / Bán</th>
                  <th className="p-4">Biến Thể</th>
                  <th className="p-4">Tồn Kho</th>
                  <th className="p-4">Đã Bán</th>
                  <th className="p-4">Trạng Thái</th>
                  <th className="p-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((p) => {
                  const totalStock = p.variants ? p.variants.reduce((sum, v) => sum + (v.stock || 0), 0) : 0;
                  return (
                    <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden">
                          <img
                            src={p.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80'}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-[#10243A] block">{p.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{p.slug}</span>
                      </td>
                      <td className="p-4 font-bold text-slate-700">{p.brand?.name || '---'}</td>
                      <td className="p-4">
                        <span className="font-extrabold text-[#10243A] block">{formatVND(p.finalPrice || p.salePrice || p.originalPrice)}</span>
                        {p.originalPrice > p.salePrice && (
                          <span className="text-[10px] text-slate-400 line-through">{formatVND(p.originalPrice)}</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {p.variants?.length || 0} variants
                        </span>
                      </td>
                      <td className="p-4 font-bold">
                        {totalStock <= 5 ? (
                          <span className="text-red-600 font-extrabold">{totalStock} (Sắp hết)</span>
                        ) : (
                          <span className="text-slate-800">{totalStock}</span>
                        )}
                      </td>
                      <td className="p-4 font-bold text-slate-700">{p.soldCount || 0}</td>
                      <td className="p-4">
                        {p.isActive ? (
                          <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Kinh doanh</span>
                        ) : (
                          <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Tạm ngưng</span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <Link
                          href={`/admin/products/${p._id}`}
                          className="p-2 text-slate-600 hover:text-[#10243A] hover:bg-slate-100 rounded-lg transition-colors inline-block"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
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
    </div>
  );
}
