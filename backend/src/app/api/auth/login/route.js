import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/co-so-du-lieu';
import Admin from '@/lib/models/QuanTri';
import User from '@/lib/models/NguoiDung';
import bcrypt from 'bcryptjs';
import { signAdminToken, setAdminSessionCookie, signUserToken, setUserSessionCookie } from '@/lib/xac-thuc';

export async function POST(req) {
  try {
    await connectToDatabase();
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng nhập tên đăng nhập và mật khẩu' },
        { status: 400 }
      );
    }

    const id = identifier.trim().toLowerCase();

    // ── 1. Kiểm tra Admin (theo username) ──────────────────────────────────
    const admin = await Admin.findOne({ username: identifier.trim() });
    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return NextResponse.json(
          { success: false, message: 'Mật khẩu không chính xác' },
          { status: 401 }
        );
      }
      const token = signAdminToken(admin);
      await setAdminSessionCookie(token);
      return NextResponse.json({
        success: true,
        role: 'admin',
        redirect: '/quan-tri',
        user: { id: admin._id, name: admin.name, role: 'admin' },
      });
    }

    // ── 2. Kiểm tra User (theo email) ──────────────────────────────────────
    const user = await User.findOne({ email: id });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Tài khoản không tồn tại' },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: 'Tài khoản đã bị vô hiệu hóa' },
        { status: 403 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Mật khẩu không chính xác' },
        { status: 401 }
      );
    }

    const token = signUserToken(user);
    await setUserSessionCookie(token);
    return NextResponse.json({
      success: true,
      role: 'user',
      redirect: '/tai-khoan',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi máy chủ' },
      { status: 500 }
    );
  }
}
