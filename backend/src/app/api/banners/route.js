import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Banner from '@/lib/models/Banner';
import { getAdminSession } from '@/lib/auth';

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const active = searchParams.get('active');

    const filter = {};
    if (active === 'true') filter.isActive = true;

    const banners = await Banner.find(filter).sort({ displayOrder: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: banners });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi máy chủ' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Không có quyền truy cập' }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();

    if (!body.title || !body.desktopImage) {
      return NextResponse.json({ success: false, message: 'Tiêu đề và Ảnh desktop là bắt buộc' }, { status: 400 });
    }

    const banner = await Banner.create({
      title: body.title,
      description: body.description || '',
      desktopImage: body.desktopImage,
      mobileImage: body.mobileImage || body.desktopImage,
      ctaText: body.ctaText || 'Khám Phá Ngay',
      ctaLink: body.ctaLink || '/products',
      displayOrder: body.displayOrder || 0,
      isActive: body.isActive !== undefined ? body.isActive : true,
    });

    return NextResponse.json({ success: true, message: 'Tạo Hero Banner thành công', data: banner }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi máy chủ' }, { status: 500 });
  }
}
