import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/co-so-du-lieu';
import Brand from '@/lib/models/ThuongHieu';
import { getAdminSession } from '@/lib/xac-thuc';
import { slugify } from '@/lib/tien-ich';

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const brand = await Brand.findById(id);
    if (!brand) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy thương hiệu' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: brand });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi máy chủ' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Không có quyền truy cập' }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();

    const brand = await Brand.findById(id);
    if (!brand) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy thương hiệu' }, { status: 404 });
    }

    if (body.name) brand.name = body.name;
    if (body.slug) brand.slug = slugify(body.slug);
    if (body.logo !== undefined) brand.logo = body.logo;
    if (body.description !== undefined) brand.description = body.description;
    if (body.isActive !== undefined) brand.isActive = body.isActive;
    if (body.showOnHomepage !== undefined) brand.showOnHomepage = body.showOnHomepage;
    if (body.displayOrder !== undefined) brand.displayOrder = body.displayOrder;

    await brand.save();
    return NextResponse.json({ success: true, message: 'Cập nhật thành công', data: brand });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi khi cập nhật' }, { status: 500 });
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
    await Brand.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Xóa thương hiệu thành công' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi khi xóa thương hiệu' }, { status: 500 });
  }
}
