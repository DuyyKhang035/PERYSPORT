import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw, Headphones, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#10243A] text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="h-14 w-auto overflow-hidden shrink-0 group/logo cursor-pointer">
              <img
                src="/logoThay2.png"
                alt="PERY SPORT"
                className="h-full w-auto object-contain transition-transform duration-300 group-hover/logo:scale-105"
              />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Thương hiệu giày thể thao nam hàng đầu. Chúng tôi cam kết mang tới cho Quý khách những sản phẩm chất lượng cao, thiết kế tối giản, hiện đại và êm ái cho mọi hành trình.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <ShieldCheck className="w-5 h-5 text-[#F97316]" /> 100% Sản Phẩm Chính Hãng
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 uppercase tracking-wider">Hỗ Trợ Khách Hàng</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/tra-cuu" className="hover:text-[#F97316] transition-colors">Tra cứu đơn hàng</Link></li>
              <li><a href="#" className="hover:text-[#F97316] transition-colors">Chính sách bảo hành 12 tháng</a></li>
              <li><a href="#" className="hover:text-[#F97316] transition-colors">Chính sách đổi trả 30 ngày</a></li>
              <li><a href="#" className="hover:text-[#F97316] transition-colors">Chính sách vận chuyển toàn quốc</a></li>
              <li><a href="#" className="hover:text-[#F97316] transition-colors">Hướng dẫn chọn size giày chuẩn</a></li>
            </ul>
          </div>

          {/* Products Col */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 uppercase tracking-wider">Danh Mục Sản Phẩm</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/san-pham?category=chay-bo" className="hover:text-[#F97316] transition-colors">Giày Chạy Bộ Chuyên Dụng</Link></li>
              <li><Link href="/san-pham?category=tap-gym" className="hover:text-[#F97316] transition-colors">Giày Tập Gym & Nâng Tạ</Link></li>
              <li><Link href="/san-pham?category=di-bo" className="hover:text-[#F97316] transition-colors">Giày Đi Bộ Êm Ái</Link></li>
              <li><Link href="/san-pham?category=bong-ro" className="hover:text-[#F97316] transition-colors">Giày Bóng Rổ Cổ Cao</Link></li>
              <li><Link href="/san-pham?category=thoi-trang-the-thao" className="hover:text-[#F97316] transition-colors">Sneaker Thời Trang Nam</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 uppercase tracking-wider">Thông Tin Liên Hệ</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#F97316] shrink-0 mt-0.5" />
                <span>Showroom: 188 Nguyễn Trãi, Thanh Xuân, Hà Nội</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#F97316] shrink-0" />
                <span>Hotline: <strong className="text-white">1900 8888</strong></span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#F97316] shrink-0" />
                <span>Email: support@perysport.vn</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 PERY SPORT. Tất cả quyền được bảo lưu.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300">Điều khoản sử dụng</a>
            <a href="#" className="hover:text-slate-300">Chính sách bảo mật</a>
            <Link href="/quan-tri/dang-nhap" className="hover:text-[#F97316]">Hệ Thống Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
