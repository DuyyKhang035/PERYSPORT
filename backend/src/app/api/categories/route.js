import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/co-so-du-lieu';
import Category from '@/lib/models/DanhMuc';
import { getAdminSession } from '@/lib/xac-thuc';
import { slugify } from '@/lib/tien-ich';

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const active = searchParams.get('active');

    const query = {};
    if (active === 'true') query.isActive = true;

    const categories = await Category.find(query).sort({ displayOrder: 1, name: 1 });
    return NextResponse.json({ success: true, data: categories });
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

    if (!body.name) {
      return NextResponse.json({ success: false, message: 'Tên danh mục không được để trống' }, { status: 400 });
    }

    const slug = body.slug ? slugify(body.slug) : slugify(body.name);
    const existing = await Category.findOne({ slug });
    if (existing) {
      return NextResponse.json({ success: false, message: 'Slug này đã tồn tại' }, { status: 400 });
    }

    const category = await Category.create({
      name: body.name,
      slug,
      description: body.description || '',
      image: body.image || '',
      isActive: body.isActive !== undefined ? body.isActive : true,
      displayOrder: body.displayOrder || 0,
    });

    return NextResponse.json({ success: true, message: 'Tạo danh mục thành công', data: category }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi máy chủ' }, { status: 500 });
  }
}
