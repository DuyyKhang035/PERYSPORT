'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatVND, formatDateTime } from '@/lib/tien-ich';
import { Tag, Layers, ShoppingBag, DollarSign, AlertTriangle, ArrowRight, Clock, CheckCircle2, Truck, XCircle } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-xs font-bold text-slate-500">Đang tải dữ liệu thống kê...</div>;
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">Chờ xác nhận</span>;
      case 'confirmed':
        return <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">Đã xác nhận</span>;
      case 'shipping':
        return <span className="bg-orange-100 text-orange-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">Đang giao</span>;
      case 'completed':
        return <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">Hoàn thành</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">Đã hủy</span>;
      default:
        return status;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[#10243A]">Bảng Điều Khiển Quản Trị</h1>
        <p className="text-xs text-slate-500 mt-1">Tổng quan hoạt động kinh doanh PERY SPORT</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 block mb-1">Tổng Sản Phẩm</span>
            <h3 className="text-2xl font-black text-[#10243A]">{stats?.totalProducts || 0}</h3>
          </div>
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl">
            <Tag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 block mb-1">Thương Hiệu Partner</span>
            <h3 className="text-2xl font-black text-[#10243A]">{stats?.totalBrands || 0}</h3>
          </div>
          <div className="p-3.5 bg-purple-50 text-purple-600 rounded-2xl">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 block mb-1">Tổng Đơn Hàng</span>
            <h3 className="text-2xl font-black text-[#10243A]">{stats?.totalOrders || 0}</h3>
          </div>
          <div className="p-3.5 bg-orange-50 text-[#F97316] rounded-2xl">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 block mb-1">Doanh Thu Đã Xác Nhận</span>
            <h3 className="text-xl font-black text-emerald-600">{formatVND(stats?.totalRevenue || 0)}</h3>
          </div>
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-black text-[#10243A]">Đơn Hàng Mới Nhất</h3>
            <Link href="/quan-tri/don-hang" className="text-xs font-bold text-[#F97316] hover:underline flex items-center gap-1">
              Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {!stats?.recentOrders || stats.recentOrders.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">Chưa có đơn hàng nào.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100 uppercase text-[10px]">
                    <th className="pb-3 font-bold">Mã Đơn</th>
                    <th className="pb-3 font-bold">Khách Hàng</th>
                    <th className="pb-3 font-bold">Tổng Tiền</th>
                    <th className="pb-3 font-bold">Trạng Thái</th>
                    <th className="pb-3 font-bold">Thời Gian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {stats.recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-mono font-bold text-[#10243A]">{order.orderCode}</td>
                      <td className="py-3">
                        <span className="font-bold text-slate-800 block">{order.customerName}</span>
                        <span className="text-[10px] text-slate-400">{order.customerPhone}</span>
                      </td>
                      <td className="py-3 font-extrabold text-slate-900">{formatVND(order.totalAmount)}</td>
                      <td className="py-3">{getStatusBadge(order.orderStatus)}</td>
                      <td className="py-3 text-slate-400">{formatDateTime(order.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Warning Box */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-black text-[#10243A] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Sản Phẩm Sắp Hết Hàng
            </h3>
          </div>

          {!stats?.lowStockProducts || stats.lowStockProducts.length === 0 ? (
            <p className="text-xs text-emerald-600 font-bold py-6 text-center">Tất cả sản phẩm đều đủ tồn kho! 🎉</p>
          ) : (
            <div className="space-y-3">
              {stats.lowStockProducts.map((p) => (
                <div key={p._id} className="flex items-center justify-between p-3 bg-amber-50/50 rounded-2xl border border-amber-100">
                  <div className="min-w-0 pr-2">
                    <h4 className="text-xs font-bold text-[#10243A] truncate">{p.name}</h4>
                    <span className="text-[10px] text-slate-400">{p.brand?.name}</span>
                  </div>
                  <span className="text-xs font-black text-red-600 bg-red-100 px-2.5 py-1 rounded-lg shrink-0">
                    Còn {p.totalStock} đôi
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
