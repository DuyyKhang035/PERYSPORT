'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';
import CartDrawer from '@/components/store/CartDrawer';
import { useCart } from '@/lib/cart-context';
import { formatVND } from '@/lib/utils';
import { ShieldCheck, Truck, CreditCard, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    shippingAddress: '',
    note: '',
    paymentMethod: 'COD',
  });

  const [validatedData, setValidatedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Validate cart with server on load
  useEffect(() => {
    async function validateCart() {
      if (cartItems.length === 0) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/checkout/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: cartItems }),
        });
        const data = await res.json();

        if (data.success) {
          setValidatedData(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Lỗi kết nối máy chủ khi xác thực đơn hàng');
      } finally {
        setLoading(false);
      }
    }

    validateCart();
  }, [cartItems]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    if (!formData.customerName || !formData.customerPhone || !formData.customerEmail || !formData.shippingAddress) {
      setError('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: cartItems,
        }),
      });

      const data = await res.json();

      if (data.success && data.data) {
        clearCart();
        router.push(`/order-success?orderCode=${data.data.orderCode}&phone=${encodeURIComponent(formData.customerPhone)}`);
      } else {
        setError(data.message || 'Lỗi khi đặt hàng');
      }
    } catch (err) {
      setError('Lỗi máy chủ khi tạo đơn hàng');
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <Header />
        <div className="max-w-md mx-auto py-20 text-center px-4">
          <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Giỏ hàng của bạn đang trống</h2>
          <p className="text-xs text-slate-500 mb-6">Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.</p>
          <button
            onClick={() => router.push('/products')}
            className="bg-[#10243A] text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-[#F97316] transition-colors"
          >
            Khám Phá Sản Phẩm
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      <CartDrawer />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <button onClick={() => router.push('/cart')} className="flex items-center gap-1 hover:text-slate-800 font-semibold">
            <ArrowLeft className="w-3.5 h-3.5" /> Quay lại giỏ hàng
          </button>
        </div>

        <h1 className="text-2xl md:text-3xl font-black text-[#10243A] mb-8">Thanh Toán Đơn Hàng</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Form Shipping Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
              <h2 className="text-base font-black text-[#10243A] pb-3 border-b border-slate-200 flex items-center gap-2">
                1. Thông Tin Giao Hàng
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Họ và Tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full bg-white border border-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-[#10243A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Số Điện Thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0988 123 456"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full bg-white border border-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-[#10243A]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Địa Chỉ Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="nguyenvana@gmail.com"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="w-full bg-white border border-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-[#10243A]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Địa Chỉ Nhận Hàng Chân Thực <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                  value={formData.shippingAddress}
                  onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                  className="w-full bg-white border border-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-[#10243A]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Ghi Chú Đơn Hàng (Tùy chọn)</label>
                <input
                  type="text"
                  placeholder="Giao giờ hành chính, gọi trước khi giao..."
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full bg-white border border-slate-200 text-xs rounded-xl p-3 focus:outline-none"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
              <h2 className="text-base font-black text-[#10243A] pb-3 border-b border-slate-200 flex items-center gap-2">
                2. Phương Thức Thanh Toán
              </h2>

              <div className="space-y-3">
                <label className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  formData.paymentMethod === 'COD' ? 'border-[#F97316] bg-orange-50/50 shadow-xs' : 'border-slate-200 bg-white'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === 'COD'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'COD' })}
                    className="mt-1 accent-[#F97316]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#10243A] block">
                      Thanh toán khi nhận hàng (COD)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Thanh toán trực tiếp bằng tiền mặt cho shipper khi nhận và kiểm tra giày.
                    </span>
                  </div>
                </label>

                <label className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  formData.paymentMethod === 'BANK_TRANSFER' ? 'border-[#F97316] bg-orange-50/50 shadow-xs' : 'border-slate-200 bg-white'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="BANK_TRANSFER"
                    checked={formData.paymentMethod === 'BANK_TRANSFER'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'BANK_TRANSFER' })}
                    className="mt-1 accent-[#F97316]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#10243A] block">
                      Chuyển khoản Ngân hàng (QR Code)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Chuyển khoản nhanh qua quét mã VietQR ngân hàng sau khi xác nhận đơn.
                    </span>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Order Summary & Confirm Action */}
          <div className="lg:col-span-5">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 sticky top-28 space-y-6">
              <h2 className="text-base font-black text-[#10243A] pb-3 border-b border-slate-200">
                Sản Phẩm Đặt Mua
              </h2>

              <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                {cartItems.map((item) => (
                  <div key={item.sku} className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-100">
                    <img src={item.image} alt={item.productName} className="w-14 h-14 object-cover rounded-lg border border-slate-200 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#10243A] truncate">{item.productName}</h4>
                      <p className="text-[10px] text-slate-500">Màu: {item.color} | Size: {item.size} x{item.quantity}</p>
                    </div>
                    <span className="text-xs font-extrabold text-[#10243A] shrink-0">
                      {formatVND(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {validatedData && (
                <div className="space-y-2.5 pt-4 border-t border-slate-200 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Tạm tính giá gốc:</span>
                    <span>{formatVND(validatedData.subtotal)}</span>
                  </div>
                  {validatedData.discountAmount > 0 && (
                    <div className="flex justify-between text-[#F97316] font-semibold">
                      <span>Khuyến mãi giảm:</span>
                      <span>-{formatVND(validatedData.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span className="text-emerald-600 font-bold">MIỄN PHÍ</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-3 border-t border-slate-200">
                    <span className="text-sm font-bold text-[#10243A]">Tổng thanh toán:</span>
                    <span className="text-xl font-black text-[#F97316]">
                      {formatVND(validatedData.totalAmount)}
                    </span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || loading}
                className="w-full py-4 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? 'Đang Xử Lý Đơn Hàng...' : 'Xác Nhận Đặt Hàng Ngay'}
              </button>

              <div className="pt-2 text-[11px] text-slate-400 space-y-1.5 text-center">
                <p className="flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Cam kết bảo mật thông tin khách hàng
                </p>
              </div>

            </div>
          </div>

        </form>
      </main>

      <Footer />
    </div>
  );
}
