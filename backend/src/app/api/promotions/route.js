import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Promotion from '@/lib/models/Promotion';
import { getAdminSession } from '@/lib/auth';

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get('activeOnly');

    const filter = {};
    if (activeOnly === 'true') {
      const now = new Date();
      filter.isActive = true;
      filter.startDate = { $lte: now };
      filter.endDate = { $gte: now };
    }

    const promotions = await Promotion.find(filter).populate('applicableProducts', 'name slug').sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: promotions });
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

    if (!body.name || !body.value || !body.startDate || !body.endDate) {
      return NextResponse.json({ success: false, message: 'Vui lòng điền đầy đủ Tên, Giá trị và Thời gian hiệu lực' }, { status: 400 });
    }

    const promotion = await Promotion.create({
      name: body.name,
      type: body.type || 'percentage',
      value: body.value,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      applicableProducts: body.applicableProducts || [],
      isActive: body.isActive !== undefined ? body.isActive : true,
    });

    return NextResponse.json({ success: true, message: 'Tạo khuyến mãi thành công', data: promotion }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi máy chủ' }, { status: 500 });
  }
}
