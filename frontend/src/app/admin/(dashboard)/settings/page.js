'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ShieldCheck, Check, AlertCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMsg({ type: 'error', text: 'Vui lòng điền đầy đủ các trường mật khẩu' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMsg({ type: 'error', text: 'Mật khẩu mới và nhập lại mật khẩu không khớp' });
      return;
    }
    if (newPassword.length < 6) {
      setMsg({ type: 'error', text: 'Mật khẩu mới phải từ 6 ký tự trở lên' });
      return;
    }

    setLoading(true);
    setMsg({ type: '', text: '' });

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (data.success) {
        setMsg({ type: 'success', text: 'Đổi mật khẩu thành công! Vui lòng ghi nhớ mật khẩu mới.' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMsg({ type: 'error', text: data.message || 'Lỗi khi đổi mật khẩu' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Lỗi kết nối máy chủ' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[#10243A]">Tài Khoản & Mật Khẩu Admin</h1>
        <p className="text-xs text-slate-500 mt-1">Thay đổi mật khẩu đăng nhập hệ thống quản trị PERY SPORT</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        {msg.text && (
          <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
            msg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
          }`}>
            {msg.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            {msg.text}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Mật Khẩu Hiện Tại (*)</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#10243A]"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Mật Khẩu Mới (*)</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Tối thiểu 6 ký tự..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#10243A]"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Xác Nhận Mật Khẩu Mới (*)</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#10243A]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#10243A] hover:bg-[#F97316] text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition-colors shadow-md disabled:opacity-50"
          >
            {loading ? 'Đang Đổi Mật Khẩu...' : 'Cập Nhật Mật Khẩu Admin'}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 space-y-1">
          <p className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Mật khẩu được mã hóa an toàn bằng thuật toán bcrypt.
          </p>
        </div>
      </div>
    </div>
  );
}
