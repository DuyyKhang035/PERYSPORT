'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/cua-hang/bo-cuc/DauTrang';
import Footer from '@/components/cua-hang/bo-cuc/ChanTrang';
import CartDrawer from '@/components/cua-hang/gio-hang/NganKeGioHang';
import { formatVND, formatDateTime } from '@/lib/tien-ich';
import { CheckCircle2, Package, Phone, Mail, MapPin, ArrowRight, Search } from 'lucide-react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get('orderCode');
  const phone = searchParams.get('phone');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderCode || !phone) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/orders/lookup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderCode, contactInfo: phone }),
        });
        const data = await res.json();
        if (data.success) {
          setOrder(data.data);
        }
      } catch (e) {
        console.error('Error fetching order confirmation:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderCode, phone]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center">
      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">ĐẶT HÀNG THÀNH CÔNG</span>
      <h1 className="text-2xl md:text-3xl font-black text-[#10243A] mt-1 mb-2">Cảm Ơn Quý Khách Đã Mua Sắm!</h1>
      <p className="text-xs text-slate-500 max-w-md mx-auto mb-8">
        Mã đơn hàng của bạn là <strong className="text-[#F97316] font-mono text-sm">{orderCode}</strong>. Nhân viên PERY SPORT sẽ liên hệ xác nhận đơn hàng trong thời gian sớm nhất.
      </p>

      {order && (
        <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200 text-left space-y-6 mb-8">
          <div className="flex flex-wrap justify-between items-center pb-4 border-b border-slate-200 gap-2">
            <div>
              <span className="text-xs text-slate-400 font-bold">Mã Đơn Hàng</span>
              <h3 className="text-base font-black text-[#10243A] font-mono">{order.orderCode}</h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 font-bold">Ngày Đặt Hàng</span>
              <p className="text-xs text-slate-700 font-semibold">{formatDateTime(order.createdAt)}</p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 bg-white p-4 rounded-2xl border border-slate-100">
            <div>
              <p className="font-bold text-slate-800 mb-1">Thông Tin Người Nhận:</p>
              <p><strong>Họ tên:</strong> {order.customerName}</p>
              <p><strong>Số điện thoại:</strong> {order.customerPhone}</p>
              <p><strong>Email:</strong> {order.customerEmail}</p>
            </div>
            <div>
              <p className="font-bold text-slate-800 mb-1">Địa Chỉ & Giao Hàng:</p>
              <p><strong>Địa chỉ:</strong> {order.shippingAddress}</p>
              <p><strong>Thanh toán:</strong> {order.paymentMethod === 'COD' ? 'Thanh toán COD khi nhận hàng' : 'Chuyển khoản QR'}</p>
            </div>
          </div>

          {/* Items List */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 mb-3">Sản Phẩm Trong Đơn Hàng:</h4>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.productName} className="w-12 h-12 object-cover rounded-lg border border-slate-200" />
                    <div>
                      <span className="font-bold text-[#10243A] block">{item.productName}</span>
                      <span className="text-slate-500 text-[11px]">Màu: {item.color} | Size: {item.size} x{item.quantity}</span>
                    </div>
                  </div>
                  <strong className="text-[#10243A] font-extrabold">{formatVND(item.totalPrice)}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Total Amount */}
          <div className="pt-4 border-t border-slate-200 flex justify-between items-baseline">
            <span className="text-sm font-bold text-[#10243A]">Tổng Tiền Đơn Hàng:</span>
            <span className="text-xl font-black text-[#F97316]">{formatVND(order.totalAmount)}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <Link
          href={`/tra-cuu?orderCode=${orderCode}&contact=${encodeURIComponent(phone || '')}`}
          className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-6 py-3.5 rounded-xl transition-colors"
        >
          <Search className="w-4 h-4" /> Tra Cứu Tiến Độ Đơn Hàng
        </Link>
        <Link
          href="/san-pham"
          className="inline-flex items-center justify-center gap-2 bg-[#10243A] hover:bg-[#F97316] text-white text-xs font-bold px-8 py-3.5 rounded-xl transition-colors"
        >
          Tiếp Tục Mua Sắm <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      <CartDrawer />
      <main className="flex-1">
        <Suspense fallback={<div className="text-center py-20">Đang tải thông tin xác nhận...</div>}>
          <OrderSuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
