'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, User, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Vui lòng điền tên đăng nhập và mật khẩu');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#10243A] flex flex-col justify-center items-center p-4 font-sans relative">
      <Link href="/" className="absolute top-6 left-6 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Về cửa hàng PERY SPORT
      </Link>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <img src="/logoThay2.png" alt="PERY SPORT" className="h-12 w-auto object-contain" />
          </div>
          <h1 className="text-2xl font-black text-[#10243A]">Đăng Nhập Admin</h1>
          <p className="text-xs text-slate-500">Hệ thống quản trị bán hàng PERY SPORT</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Tên Đăng Nhập</label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập username..."
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:bg-white focus:border-[#10243A]"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Mật Khẩu</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:bg-white focus:border-[#10243A]"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#10243A] hover:bg-[#F97316] text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition-colors shadow-lg disabled:opacity-50"
          >
            {loading ? 'Đang Đăng Nhập...' : 'Vào Bảng Quản Trị'}
          </button>
        </form>

        <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Xác thực Session & Cookie HTTP-Only bảo mật
        </p>
      </div>
    </div>
  );
}
