import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, message: 'Chưa xác thực' }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    admin: session,
  });
}
