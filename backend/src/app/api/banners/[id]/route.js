import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/co-so-du-lieu';
import Banner from '@/lib/models/BannerQuangCao';
import { getAdminSession } from '@/lib/xac-thuc';

export async function PUT(req, { params }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Không có quyền truy cập' }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();

    const banner = await Banner.findById(id);
    if (!banner) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy banner' }, { status: 404 });
    }

    if (body.title) banner.title = body.title;
    if (body.description !== undefined) banner.description = body.description;
    if (body.desktopImage) banner.desktopImage = body.desktopImage;
    if (body.mobileImage) banner.mobileImage = body.mobileImage;
    if (body.ctaText) banner.ctaText = body.ctaText;
    if (body.ctaLink) banner.ctaLink = body.ctaLink;
    if (body.displayOrder !== undefined) banner.displayOrder = body.displayOrder;
    if (body.isActive !== undefined) banner.isActive = body.isActive;

    await banner.save();
    return NextResponse.json({ success: true, message: 'Cập nhật banner thành công', data: banner });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi khi cập nhật banner' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Không có quyền truy cập' }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = await params;
    await Banner.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Xóa banner thành công' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi khi xóa banner' }, { status: 500 });
  }
}
