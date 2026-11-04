'use client';

import React from 'react';
import { Menu, User, Bell } from 'lucide-react';

export default function AdminHeader({ onMenuClick, adminInfo }) {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-400">BẢNG QUẢN TRỊ PERY SPORT</span>
          <h2 className="text-sm font-black text-[#10243A]">Xin chào, {adminInfo?.name || 'Administrator'}</h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
          <div className="w-6 h-6 rounded-full bg-[#10243A] text-white flex items-center justify-center font-bold text-xs">
            A
          </div>
          <span className="text-xs font-bold text-[#10243A]">admin</span>
        </div>
      </div>
    </header>
  );
}
