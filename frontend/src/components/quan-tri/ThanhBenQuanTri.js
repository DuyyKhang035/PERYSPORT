'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Tag, Image as ImageIcon, FileText, Layers, Percent, Settings, LogOut, ExternalLink, Menu, X } from 'lucide-react';

export default function AdminSidebar({ isMobileOpen, setIsMobileOpen }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi hệ thống Admin?')) {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/quan-tri/dang-nhap');
      router.refresh();
    }
  };

  const navItems = [
    { label: 'Tổng Quan', href: '/quan-tri', icon: LayoutDashboard },
    { label: 'Quản Lý Đơn Hàng', href: '/quan-tri/don-hang', icon: ShoppingBag },
    { label: 'Quản Lý Sản Phẩm', href: '/quan-tri/san-pham', icon: Tag },
    { label: 'Thương Hiệu', href: '/quan-tri/thuong-hieu', icon: Layers },
    { label: 'Danh Mục / Chức Năng', href: '/quan-tri/danh-muc', icon: Layers },
    { label: 'Khuyến Mãi & Deals', href: '/quan-tri/khuyen-mai', icon: Percent },
    { label: 'Hero Banners', href: '/quan-tri/banner', icon: ImageIcon },
    { label: 'Bài Viết & Blog', href: '/quan-tri/bai-viet', icon: FileText },
    { label: 'Tài Khoản & Mật Khẩu', href: '/quan-tri/cai-dat', icon: Settings },
  ];

  const sidebarContent = (
    <div className="h-full bg-[#10243A] text-slate-300 flex flex-col justify-between p-4">
      <div className="space-y-6">
        {/* Brand */}
        <div className="flex items-center justify-between px-2 pt-2 pb-4 border-b border-slate-800">
          <Link href="/quan-tri" className="flex items-center shrink-0">
            <div className="h-9 w-auto overflow-hidden shrink-0">
              <img src="/logoThay2.png" alt="PERY SPORT" className="h-full w-auto object-contain" />
            </div>
          </Link>
          {setIsMobileOpen && (
            <button onClick={() => setIsMobileOpen(false)} className="lg:hidden p-1 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/quan-tri' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#F97316] text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer controls */}
      <div className="space-y-2 pt-4 border-t border-slate-800">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ExternalLink className="w-4 h-4" /> Xem Website Khách Hàng
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3.5 py-2.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white text-xs font-bold rounded-xl transition-all"
        >
          <LogOut className="w-4 h-4" /> Đăng Xuất
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex">
          <div className="w-64 bg-[#10243A] h-full shadow-2xl">
            {sidebarContent}
          </div>
          <div className="flex-1" onClick={() => setIsMobileOpen(false)} />
        </div>
      )}
    </>
  );
}
