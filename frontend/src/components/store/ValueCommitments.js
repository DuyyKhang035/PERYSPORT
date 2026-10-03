import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react';

export default function ValueCommitments() {
  const commitments = [
    {
      icon: ShieldCheck,
      title: '100% CHÍNH HÃNG',
      desc: 'Cam kết nguồn gốc xuất xứ rõ ràng, đền bù 200% nếu phát hiện hàng giả',
    },
    {
      icon: Truck,
      title: 'GIAO HÀNG TOÀN QUỐC',
      desc: 'Miễn phí vận chuyển cho đơn hàng từ 1.000.000₫. Kiểm tra hàng trước khi thanh toán',
    },
    {
      icon: RotateCcw,
      title: 'ĐỔI TRẢ 30 NGÀY',
      desc: 'Hỗ trợ đổi size và mẫu dễ dàng trong vòng 30 ngày nếu không vừa ý',
    },
    {
      icon: Headphones,
      title: 'HỖ TRỢ 24/7',
      desc: 'Đội ngũ tư vấn viên nhiệt tình, giải đáp thắc mắc mọi lúc qua Hotline 1900 8888',
    },
  ];

  return (
    <section className="bg-[#F5F7FA] py-12 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {commitments.map((c, idx) => {
            const Icon = c.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-start gap-4 hover:shadow-md transition-shadow"
              >
                <div className="p-3 bg-orange-50 text-[#F97316] rounded-xl shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#10243A] mb-1">{c.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{c.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
