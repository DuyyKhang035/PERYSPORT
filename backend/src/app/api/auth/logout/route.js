import { NextResponse } from 'next/server';
import { clearUserSessionCookie } from '@/lib/xac-thuc';

export async function POST() {
  await clearUserSessionCookie();
  return NextResponse.json({ success: true, message: 'Đã đăng xuất' });
}
