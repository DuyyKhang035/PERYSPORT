'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#10243A] flex flex-col justify-center items-center p-4 font-sans text-white text-sm">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="font-semibold text-slate-300">Đang chuyển hướng vào Bảng Quản Trị...</p>
      </div>
    </div>
  );
}

