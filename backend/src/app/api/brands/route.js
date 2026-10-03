import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Brand from '@/lib/models/Brand';
import { getAdminSession } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const homepage = searchParams.get('homepage');
    const active = searchParams.get('active');

    const query = {};
    if (homepage === 'true') query.showOnHomepage = true;
    if (active === 'true') query.isActive = true;

    const brands = await Brand.find(query).sort({ displayOrder: 1, name: 1 });
    return NextResponse.json({ success: true, data: brands });
  } catch (error) {
    console.error('Fetch brands error:', error);
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
      return NextResponse.json({ success: false, message: 'Tên thương hiệu không được để trống' }, { status: 400 });
    }

    const slug = body.slug ? slugify(body.slug) : slugify(body.name);
    const existing = await Brand.findOne({ slug });
    if (existing) {
      return NextResponse.json({ success: false, message: 'Slug này đã tồn tại' }, { status: 400 });
    }

    const brand = await Brand.create({
      name: body.name,
      slug,
      logo: body.logo || '',
      description: body.description || '',
      isActive: body.isActive !== undefined ? body.isActive : true,
      showOnHomepage: body.showOnHomepage || false,
      displayOrder: body.displayOrder || 0,
    });

    return NextResponse.json({ success: true, message: 'Tạo thương hiệu thành công', data: brand }, { status: 201 });
  } catch (error) {
    console.error('Create brand error:', error);
    return NextResponse.json({ success: false, message: 'Lỗi máy chủ' }, { status: 500 });
  }
}
