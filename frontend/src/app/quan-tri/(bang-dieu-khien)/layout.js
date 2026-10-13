'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/quan-tri/ThanhBenQuanTri';
import AdminHeader from '@/components/quan-tri/TieuDeQuanTri';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [adminSession, setAdminSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/me');
        const data = await res.json();
        if (data.success && data.admin) {
          setAdminSession(data.admin);
        } else {
          router.push('/quan-tri/dang-nhap');
        }
      } catch (err) {
        router.push('/quan-tri/dang-nhap');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center font-sans text-xs font-bold text-slate-500">
        Đang xác thực quyền truy cập Admin...
      </div>
    );
  }

  if (!adminSession) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex font-sans">
      <AdminSidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onMenuClick={() => setIsMobileOpen(true)} adminInfo={adminSession} />
        <main className="p-6 md:p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
