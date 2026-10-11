'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Search, Menu, X, User, Phone, ChevronDown, Truck, Tag, Layers } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function Header() {
  const router = useRouter();
  const { cartCount, setIsCartOpen } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const searchInputRef = useRef(null);

  useEffect(() => {
    async function loadNavData() {
      try {
        const [catRes, brandRes] = await Promise.all([
          fetch('/api/categories?active=true'),
          fetch('/api/brands?active=true'),
        ]);
        const catData = await catRes.json();
        const brandData = await brandRes.json();

        if (catData.success) setCategories(catData.data);
        if (brandData.success) setBrands(brandData.data);
      } catch (e) {
        console.error('Failed loading nav data:', e);
      }
    }
    loadNavData();
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-xs border-b border-slate-100">
      {/* Top Announcement Bar */}
      <div className="bg-[#10243A] text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-[#F97316]" /> Hotline: <strong className="text-white">1900 8888</strong>
            </span>
            <span className="hidden md:flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-[#F97316]" /> Miễn phí giao hàng cho đơn từ 1.000.000₫
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/lookup" className="hover:text-[#F97316] transition-colors flex items-center gap-1">
              <Search className="w-3 h-3" /> Tra cứu đơn hàng
            </Link>
            <Link href="/admin/login" className="hover:text-[#F97316] transition-colors flex items-center gap-1">
              <User className="w-3 h-3" /> Quản trị Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Main Single-Row Navbar: Logo - Centered Navigation - Action Icons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 relative">
        
        {/* Left: Mobile Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-[#10243A] rounded-lg"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link href="/" className="flex items-center shrink-0 group/logo">
            <div className="h-12 w-auto overflow-hidden shrink-0">
              <img
                src="/logoThay2.png"
                alt="PERY SPORT"
                className="h-full w-auto object-contain transition-transform duration-300 group-hover/logo:scale-105"
              />
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation List (Centered horizontally and vertically) */}
        <nav className="hidden lg:flex items-center justify-center flex-1 mx-4">
          <ul className="flex items-center gap-6 text-sm font-semibold text-slate-800">
            <li>
              <Link href="/" className="hover:text-[#F97316] transition-colors py-2 block">
                Trang Chủ
              </Link>
            </li>

            <li>
              <Link href="/products" className="hover:text-[#F97316] transition-colors py-2 block">
                Tất Cả Sản Phẩm
              </Link>
            </li>

            <li>
              <Link href="/products?hotDeal=true" className="text-[#F97316] font-extrabold flex items-center gap-1 hover:underline py-2">
                <Tag className="w-4 h-4" /> Hot Deals
              </Link>
            </li>

            {/* Giày Theo Chức Năng Dropdown */}
            <li className="relative group py-2">
              <button className="flex items-center gap-1 hover:text-[#F97316] transition-colors cursor-pointer">
                Giày Theo Chức Năng <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
              </button>
              
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white shadow-2xl rounded-2xl border border-slate-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/products?category=${cat.slug}`}
                    className="block px-4 py-2.5 text-slate-700 hover:bg-[#F5F7FA] hover:text-[#F97316] rounded-xl text-xs font-bold transition-colors"
                  >
                    • {cat.name}
                  </Link>
                ))}
              </div>
            </li>

            {/* Thương Hiệu Dropdown (Requirement 3: Shows all DB brands on hover) */}
            <li className="relative group py-2">
              <Link href="/brands" className="flex items-center gap-1 hover:text-[#F97316] transition-colors">
                Thương Hiệu <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
              </Link>

              <div className="absolute top-full left-1/2 -translate-x-1/2 w-72 bg-white shadow-2xl rounded-2xl border border-slate-100 p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 pb-2 border-b border-slate-100 mb-2">
                  Thương Hiệu Chính Hãng
                </div>
                
                <div className="space-y-1 max-h-72 overflow-y-auto">
                  {brands.map((brand) => (
                    <Link
                      key={brand._id}
                      href={`/products?brand=${brand.slug}`}
                      className="flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:bg-orange-50 hover:text-[#F97316] rounded-xl text-xs font-bold transition-all group/brand"
                    >
                      <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 group-hover/brand:border-[#F97316]/40 overflow-hidden shrink-0 flex items-center justify-center p-1 transition-all shadow-xs">
                        <img
                          src={brand.logo || '/logoThay2.png'}
                          alt={brand.name}
                          className="w-full h-full object-contain filter grayscale group-hover/brand:grayscale-0 transition-all duration-300"
                        />
                      </div>
                      <span className="truncate">{brand.name}</span>
                    </Link>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 mt-2 text-center">
                  <Link href="/brands" className="text-[11px] font-extrabold text-[#F97316] hover:underline">
                    Xem tất cả thương hiệu →
                  </Link>
                </div>
              </div>
            </li>

            <li>
              <Link href="/blogs" className="hover:text-[#F97316] transition-colors py-2 block">
                Bài Viết & Kinh Nghiệm
              </Link>
            </li>

            <li>
              <Link href="/contact" className="hover:text-[#F97316] transition-colors py-2 block">
                Liên Hệ
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right: Action Icons (Search Toggle & Cart Icon) */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Search Toggle Icon Button (Requirement 1) */}
          <div className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-2.5 rounded-full transition-all ${
                searchOpen ? 'bg-[#10243A] text-white shadow-md' : 'text-slate-800 hover:text-[#F97316] bg-slate-50 hover:bg-orange-50'
              }`}
              aria-label="Toggle Search Bar"
              title="Tìm kiếm sản phẩm"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Expandable Search Input Popup */}
            {searchOpen && (
              <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white shadow-2xl rounded-2xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Tìm kiếm tên giày, thương hiệu, size..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#F5F7FA] border border-slate-200 rounded-xl py-2.5 pl-3 pr-8 text-xs font-semibold focus:outline-none focus:border-[#10243A] focus:bg-white transition-all"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="bg-[#10243A] hover:bg-[#F97316] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shrink-0"
                  >
                    Tìm
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Cart Icon Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 text-slate-800 hover:text-[#F97316] bg-slate-50 hover:bg-orange-50 rounded-full transition-all"
            aria-label="Open Shopping Cart"
            title="Giỏ hàng"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#F97316] text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <span className="text-lg font-black text-[#10243A]">PERY SPORT</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Search Input */}
            <form onSubmit={handleSearchSubmit} className="mb-6 relative">
              <input
                type="text"
                placeholder="Tìm kiếm giày thể thao..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F5F7FA] border border-slate-200 rounded-xl py-2.5 pl-4 pr-10 text-xs focus:outline-none"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-slate-500">
                <Search className="w-4 h-4" />
              </button>
            </form>

            <nav className="flex flex-col gap-4 text-sm font-semibold text-slate-800">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#F97316]">
                Trang Chủ
              </Link>
              <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#F97316]">
                Tất Cả Sản Phẩm
              </Link>
              <Link href="/products?hotDeal=true" onClick={() => setMobileMenuOpen(false)} className="text-[#F97316] font-bold flex items-center gap-1">
                <Tag className="w-4 h-4" /> Hot Deals Khuyến Mãi
              </Link>

              {/* Mobile Brands Section */}
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs uppercase text-slate-400 font-bold mb-2 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" /> Thương Hiệu Partner
                </p>
                {brands.map((b) => (
                  <Link
                    key={b._id}
                    href={`/products?brand=${b.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-[#F97316] pl-2 text-xs font-medium"
                  >
                    • {b.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Categories Section */}
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs uppercase text-slate-400 font-bold mb-2">Giày Theo Chức Năng</p>
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/products?category=${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-[#F97316] pl-2 text-xs font-medium"
                  >
                    • {cat.name}
                  </Link>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-2">
                <Link href="/blogs" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#F97316]">
                  Bài Viết & Kinh Nghiệm
                </Link>
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#F97316]">
                  Liên Hệ
                </Link>
                <Link href="/lookup" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#F97316]">
                  Tra Cứu Đơn Hàng
                </Link>
                <Link href="/admin/login" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#F97316]">
                  Quản Trị Admin
                </Link>
              </div>
            </nav>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
}
