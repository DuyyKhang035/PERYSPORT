'use client';

import React, { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <div>
      {submitted ? (
        <p className="text-xs font-bold text-emerald-400 bg-slate-800 py-3 px-4 rounded-xl inline-block">
          🎉 Cảm ơn bạn đã đăng ký nhận tin từ PERY SPORT!
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
          <input
            type="email"
            placeholder="Nhập địa chỉ email của bạn..."
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white placeholder-slate-400 px-4 py-3 rounded-xl text-sm flex-1 focus:outline-none focus:border-[#F97316]"
          />
          <button
            type="submit"
            className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors shrink-0"
          >
            Đăng Ký
          </button>
        </form>
      )}
    </div>
  );
}
