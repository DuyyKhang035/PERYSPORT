import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Promotion from '@/lib/models/Promotion';
import { getAdminSession } from '@/lib/auth';

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const promotion = await Promotion.findById(id).populate('applicableProducts', 'name slug');
    if (!promotion) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy khuyến mãi' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: promotion });
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

    const promotion = await Promotion.findById(id);
    if (!promotion) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy khuyến mãi' }, { status: 404 });
    }

    if (body.name) promotion.name = body.name;
    if (body.type) promotion.type = body.type;
    if (body.value !== undefined) promotion.value = body.value;
    if (body.startDate) promotion.startDate = new Date(body.startDate);
    if (body.endDate) promotion.endDate = new Date(body.endDate);
    if (body.applicableProducts) promotion.applicableProducts = body.applicableProducts;
    if (body.isActive !== undefined) promotion.isActive = body.isActive;

    await promotion.save();
    return NextResponse.json({ success: true, message: 'Cập nhật khuyến mãi thành công', data: promotion });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi khi cập nhật khuyến mãi' }, { status: 500 });
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
    await Promotion.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Xóa khuyến mãi thành công' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi khi xóa khuyến mãi' }, { status: 500 });
  }
}
