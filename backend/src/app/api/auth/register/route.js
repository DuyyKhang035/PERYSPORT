import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/co-so-du-lieu';
import User from '@/lib/models/NguoiDung';
import bcrypt from 'bcryptjs';

// POST /api/auth/register — tạo tài khoản khách hàng mới
export async function POST(req) {
  try {
    await connectToDatabase();
    const { email, password, fullName, phone } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng nhập email và mật khẩu' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Email này đã được đăng ký' },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email.toLowerCase().trim(),
      password: hashed,
      fullName: fullName || '',
      phone: phone || '',
      role: 'user',
      isActive: true,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Đăng ký thành công',
        user: { id: user._id, email: user.email, fullName: user.fullName },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ success: false, message: 'Lỗi máy chủ' }, { status: 500 });
  }
}
