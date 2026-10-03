import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Admin from '@/lib/models/Admin';
import bcrypt from 'bcryptjs';
import { signAdminToken, setAdminSessionCookie } from '@/lib/auth';

export async function POST(req) {
  try {
    await connectToDatabase();
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ success: false, message: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu' }, { status: 400 });
    }

    const admin = await Admin.findOne({ username: username.trim() });
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Tài khoản hoặc mật khẩu không chính xác' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Tài khoản hoặc mật khẩu không chính xác' }, { status: 401 });
    }

    const token = signAdminToken(admin);
    await setAdminSessionCookie(token);

    return NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công',
      admin: {
        id: admin._id,
        username: admin.username,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ success: false, message: 'Lỗi máy chủ khi đăng nhập' }, { status: 500 });
  }
}
