import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Admin from '@/lib/models/Admin';
import bcrypt from 'bcryptjs';
import { getAdminSession } from '@/lib/auth';

export async function POST(req) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Bạn cần đăng nhập' }, { status: 401 });
    }

    await connectToDatabase();
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, message: 'Vui lòng điền đầy đủ thông tin' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ success: false, message: 'Mật khẩu mới phải từ 6 ký tự trở lên' }, { status: 400 });
    }

    const admin = await Admin.findById(session.id);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy tài khoản admin' }, { status: 44 });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Mật khẩu hiện tại không đúng' }, { status: 400 });
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    return NextResponse.json({ success: true, message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({ success: false, message: 'Lỗi khi cập nhật mật khẩu' }, { status: 500 });
  }
}
