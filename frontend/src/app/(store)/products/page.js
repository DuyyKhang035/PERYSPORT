'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';
import CartDrawer from '@/components/store/CartDrawer';
import ProductCard from '@/components/store/ProductCard';
import { Filter, X, ChevronDown, RefreshCw, Search } from 'lucide-react';

function ProductCatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State from URL search params
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Filter options loaded from DB
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  // Active filters
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [selectedColor, setSelectedColor] = useState(searchParams.get('color') || '');
  const [selectedSize, setSelectedSize] = useState(searchParams.get('size') || '');
  const [inStock, setInStock] = useState(searchParams.get('inStock') === 'true');
  const [hotDeal, setHotDeal] = useState(searchParams.get('hotDeal') === 'true');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || 'newest');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch filter metadata
  useEffect(() => {
    async function loadMeta() {
      try {
        const [bRes, cRes] = await Promise.all([
          fetch('/api/brands?active=true'),
          fetch('/api/categories?active=true'),
        ]);
        const bData = await bRes.json();
        const cData = await cRes.json();

        if (bData.success) setBrands(bData.data);
        if (cData.success) setCategories(cData.data);
      } catch (e) {
        console.error('Error fetching filter options:', e);
      }
    }
    loadMeta();
  }, []);

  // Fetch Products based on filters
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedBrand) params.append('brand', selectedBrand);
        if (selectedCategory) params.append('category', selectedCategory);
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);
        if (selectedColor) params.append('color', selectedColor);
        if (selectedSize) params.append('size', selectedSize);
        if (inStock) params.append('inStock', 'true');
        if (hotDeal) params.append('hotDeal', 'true');
        if (searchQuery) params.append('search', searchQuery);
        if (sortOption) params.append('sort', sortOption);
        params.append('page', currentPage.toString());
        params.append('limit', '12');

        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();

        if (data.success) {
          setProducts(data.data);
          setPagination(data.pagination);
        }
      } catch (err) {
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [selectedBrand, selectedCategory, minPrice, maxPrice, selectedColor, selectedSize, inStock, hotDeal, searchQuery, sortOption, currentPage]);

  const resetFilters = () => {
    setSelectedBrand('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedColor('');
    setSelectedSize('');
    setInStock(false);
    setHotDeal(false);
    setSearchQuery('');
    setSortOption('newest');
    setCurrentPage(1);
    router.push('/products');
  };

  const availableColors = ['Đen Navy', 'Cam Pery', 'Trắng Xám'];
  const availableSizes = ['39', '40', '41', '42', '43'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title & Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#10243A]">Sản Phẩm PERY SPORT</h1>
          <p className="text-xs text-slate-500 mt-1">
            Hiển thị <strong>{pagination.total}</strong> sản phẩm giày thể thao nam chính hãng
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-[#10243A] text-white text-xs font-bold rounded-xl"
          >
            <Filter className="w-4 h-4" /> Bộ lọc
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 hidden sm:inline">Sắp xếp:</span>
            <select
              value={sortOption}
              onChange={(e) => { setSortOption(e.target.value); setCurrentPage(1); }}
              className="bg-white border border-slate-200 text-xs font-semibold text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-[#10243A]"
            >
              <option value="newest">Mới nhất</option>
              <option value="discount-desc">Giảm giá nhiều nhất</option>
              <option value="price-asc">Giá: Thấp đến Cao</option>
              <option value="price-desc">Giá: Cao đến Thấp</option>
              <option value="best-selling">Bán chạy nhất</option>
              <option value="featured">Nổi bật</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar Filter */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <h3 className="text-sm font-black text-[#10243A] flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#F97316]" /> Bộ Lọc Tìm Kiếm
            </h3>
            <button
              onClick={resetFilters}
              className="text-[11px] text-slate-400 hover:text-[#F97316] flex items-center gap-1 font-semibold"
            >
              <RefreshCw className="w-3 h-3" /> Đặt lại
            </button>
          </div>

          {/* Search query input */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">Từ khóa</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Nhập tên giày..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl py-2 pl-3 pr-8 focus:outline-none focus:bg-white focus:border-[#10243A]"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
            </div>
          </div>

          {/* Brand Filter */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">Thương hiệu</label>
            <select
              value={selectedBrand}
              onChange={(e) => { setSelectedBrand(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl p-2.5 focus:outline-none"
            >
              <option value="">Tất cả thương hiệu</option>
              {brands.map((b) => (
                <option key={b._id} value={b.slug}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">Dòng giày (Chức năng)</label>
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl p-2.5 focus:outline-none"
            >
              <option value="">Tất cả chức năng</option>
              {categories.map((c) => (
                <option key={c._id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Size Filter */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">Size giày</label>
            <div className="grid grid-cols-5 gap-1.5">
              {availableSizes.map((s) => (
                <button
                  key={s}
                  onClick={() => { setSelectedSize(selectedSize === s ? '' : s); setCurrentPage(1); }}
                  className={`py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                    selectedSize === s
                      ? 'bg-[#10243A] text-white border-[#10243A]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">Màu sắc</label>
            <div className="space-y-1.5">
              {availableColors.map((c) => (
                <label key={c} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="color"
                    checked={selectedColor === c}
                    onChange={() => { setSelectedColor(selectedColor === c ? '' : c); setCurrentPage(1); }}
                    className="accent-[#F97316]"
                  />
                  {c}
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">Khoảng giá (VNĐ)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Từ (₫)"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Đến (₫)"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2 focus:outline-none"
              />
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => { setInStock(e.target.checked); setCurrentPage(1); }}
                className="w-4 h-4 accent-[#F97316] rounded-xs"
              />
              Chỉ hiện sản phẩm còn hàng
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={hotDeal}
                onChange={(e) => { setHotDeal(e.target.checked); setCurrentPage(1); }}
                className="w-4 h-4 accent-[#F97316] rounded-xs"
              />
              🔥 Đang có Hot Deals Khuyến mãi
            </label>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-slate-100 rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-slate-50 rounded-2xl p-12 text-center my-8">
              <p className="text-base font-bold text-slate-700 mb-2">Không tìm thấy sản phẩm phù hợp</p>
              <p className="text-xs text-slate-400 mb-6">Thử thay đổi từ khóa hoặc bộ lọc của bạn.</p>
              <button
                onClick={resetFilters}
                className="bg-[#10243A] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#F97316] transition-colors"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12 pt-6 border-t border-slate-200">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 disabled:opacity-40 hover:bg-slate-50"
                  >
                    Trước
                  </button>

                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-9 h-9 text-xs font-bold rounded-xl ${
                        currentPage === i + 1
                          ? 'bg-[#10243A] text-white'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === pagination.totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 disabled:opacity-40 hover:bg-slate-50"
                  >
                    Sau
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-sm font-black text-[#10243A]">Bộ Lọc Sản Phẩm</h3>
              <button onClick={() => setMobileFilterOpen(false)}>
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Thương hiệu</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5"
              >
                <option value="">Tất cả thương hiệu</option>
                {brands.map((b) => (
                  <option key={b._id} value={b.slug}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Dòng giày</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5"
              >
                <option value="">Tất cả chức năng</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full bg-[#10243A] text-white py-3 rounded-xl text-xs font-bold"
            >
              Áp Dụng Bộ Lọc
            </button>
          </div>
          <div className="flex-1" onClick={() => setMobileFilterOpen(false)} />
        </div>
      )}
    </div>
  );
}

export default function ProductCatalogPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      <CartDrawer />
      <main className="flex-1">
        <Suspense fallback={<div className="text-center py-20">Đang tải danh sách sản phẩm...</div>}>
          <ProductCatalogContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
