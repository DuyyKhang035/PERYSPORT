'use client';

import React, { useState } from 'react';
import Header from '@/components/cua-hang/bo-cuc/DauTrang';
import Footer from '@/components/cua-hang/bo-cuc/ChanTrang';
import CartDrawer from '@/components/cua-hang/gio-hang/NganKeGioHang';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      <CartDrawer />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#F97316] uppercase tracking-widest block mb-1">
            PERY SPORT SUPPORT
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-[#10243A]">Liên Hệ Với Chúng Tôi</h1>
          <p className="text-xs text-slate-500 mt-2">
            Đội ngũ CSKH PERY SPORT luôn sẵn sàng lắng nghe và giải đáp thắc mắc của bạn 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-100 text-[#F97316] rounded-2xl shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#10243A] mb-1">Showroom Chính</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    188 Nguyễn Trãi, Phường Thượng Đình, Quận Thanh Xuân, Hà Nội
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-100 text-[#F97316] rounded-2xl shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#10243A] mb-1">Hotline CSKH</h4>
                  <p className="text-xs text-slate-600">
                    <strong>1900 8888</strong> (08:00 - 22:00 Hàng ngày)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-100 text-[#F97316] rounded-2xl shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#10243A] mb-1">Email Hỗ Trợ</h4>
                  <p className="text-xs text-slate-600">support@perysport.vn</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-100 text-[#F97316] rounded-2xl shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#10243A] mb-1">Giờ Mở Cửa</h4>
                  <p className="text-xs text-slate-600">Từ 08:00 đến 22:00 tất cả các ngày trong tuần</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
              <h3 className="text-lg font-black text-[#10243A] mb-6">Gửi Tin Nhắn Cho PERY SPORT</h3>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-2xl text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold text-emerald-800">Cảm Ơn Bạn Đã Phản Hồi!</h4>
                  <p className="text-xs text-slate-600">Chúng tôi đã ghi nhận phản hồi và sẽ liên hệ lại trong thời gian sớm nhất.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Họ và Tên (*)</label>
                      <input
                        type="text"
                        required
                        placeholder="Nguyễn Văn A"
                        className="w-full bg-white border border-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-[#10243A]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Số Điện Thoại (*)</label>
                      <input
                        type="tel"
                        required
                        placeholder="0988 123 456"
                        className="w-full bg-white border border-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-[#10243A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Email (*)</label>
                    <input
                      type="email"
                      required
                      placeholder="email@domain.com"
                      className="w-full bg-white border border-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-[#10243A]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Nội Dung Cần Hỗ Trợ (*)</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Bạn cần tư vấn về size giày, dòng sản phẩm hay đơn hàng..."
                      className="w-full bg-white border border-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-[#10243A]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#10243A] hover:bg-[#F97316] text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Gửi Phản Hồi
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
