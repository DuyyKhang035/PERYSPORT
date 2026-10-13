import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/co-so-du-lieu';
import Order from '@/lib/models/DonHang';

export async function POST(req) {
  try {
    await connectToDatabase();
    const { orderCode, contactInfo } = await req.json();

    if (!orderCode || !contactInfo) {
      return NextResponse.json({ success: false, message: 'Vui lòng nhập Mã đơn hàng và Số điện thoại hoặc Email xác minh' }, { status: 400 });
    }

    const code = orderCode.trim().toUpperCase();
    const contact = contactInfo.trim().toLowerCase();

    const order = await Order.findOne({
      orderCode: code,
      $or: [
        { customerPhone: contact },
        { customerEmail: contact },
      ],
    });

    if (!order) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy đơn hàng trùng khớp với thông tin đã nhập' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('Order lookup error:', error);
    return NextResponse.json({ success: false, message: 'Lỗi khi tra cứu đơn hàng' }, { status: 500 });
  }
}
