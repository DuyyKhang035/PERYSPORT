import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/co-so-du-lieu';
import Category from '@/lib/models/DanhMuc';
import { getAdminSession } from '@/lib/xac-thuc';
import { slugify } from '@/lib/tien-ich';

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy danh mục' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: category });
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

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy danh mục' }, { status: 404 });
    }

    if (body.name) category.name = body.name;
    if (body.slug) category.slug = slugify(body.slug);
    if (body.description !== undefined) category.description = body.description;
    if (body.image !== undefined) category.image = body.image;
    if (body.isActive !== undefined) category.isActive = body.isActive;
    if (body.displayOrder !== undefined) category.displayOrder = body.displayOrder;

    await category.save();
    return NextResponse.json({ success: true, message: 'Cập nhật thành công', data: category });
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
    await Category.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Xóa danh mục thành công' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi khi xóa danh mục' }, { status: 500 });
  }
}
