import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/co-so-du-lieu';
import User from '@/lib/models/NguoiDung';
import { getUserSession, clearUserSessionCookie } from '@/lib/xac-thuc';

export async function GET() {
  try {
    const session = await getUserSession();
    if (!session) {
      await clearUserSessionCookie();
      return NextResponse.json({ success: false, message: 'Chưa đăng nhập' }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById(session.id).select('-password').lean();

    // Xóa cookie lỗi thời để proxy không đẩy /dang-nhap ↔ /tai-khoan vô hạn
    if (!user) {
      await clearUserSessionCookie();
      return NextResponse.json({ success: false, message: 'Tài khoản không tồn tại' }, { status: 404 });
    }

    if (!user.isActive) {
      await clearUserSessionCookie();
      return NextResponse.json({ success: false, message: 'Tài khoản đã bị vô hiệu hóa' }, { status: 403 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ success: false, message: 'Lỗi máy chủ' }, { status: 500 });
  }
}
