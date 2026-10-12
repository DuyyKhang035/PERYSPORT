import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/lib/models/Order';
import User from '@/lib/models/User';
import { getUserSession } from '@/lib/auth';

// GET /api/auth/orders — lịch sử đơn hàng của chính user đang đăng nhập
export async function GET() {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Chưa đăng nhập' }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById(session.id).select('email isActive').lean();
    if (!user || !user.isActive) {
      return NextResponse.json({ success: false, message: 'Tài khoản không hợp lệ' }, { status: 403 });
    }

    const orders = await Order.find({ customerEmail: new RegExp(`^${user.email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') })
      .select('orderCode totalAmount orderStatus paymentStatus createdAt items')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('User orders error:', error);
    return NextResponse.json({ success: false, message: 'Lỗi máy chủ' }, { status: 500 });
  }
}
