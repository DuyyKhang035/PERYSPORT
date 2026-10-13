import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/co-so-du-lieu';
import Order from '@/lib/models/DonHang';
import Review from '@/lib/models/DanhGia';
import User from '@/lib/models/NguoiDung';
import { getUserSession } from '@/lib/xac-thuc';

async function getActiveUser() {
  const session = await getUserSession();
  if (!session) return { error: NextResponse.json({ success: false, message: 'Chưa đăng nhập' }, { status: 401 }) };
  await connectToDatabase();
  const user = await User.findById(session.id).select('email isActive').lean();
  if (!user || !user.isActive) {
    return { error: NextResponse.json({ success: false, message: 'Tài khoản không hợp lệ' }, { status: 403 }) };
  }
  return { user };
}

// GET /api/auth/reviews — các đánh giá của user hiện tại
export async function GET() {
  try {
    const { user, error } = await getActiveUser();
    if (error) return error;
    const reviews = await Review.find({ user: user._id }).select('order product rating comment').lean();
    return NextResponse.json({ success: true, data: reviews });
  } catch (err) {
    console.error('Get reviews error:', err);
    return NextResponse.json({ success: false, message: 'Lỗi máy chủ' }, { status: 500 });
  }
}

// POST /api/auth/reviews — đánh giá sản phẩm trong đơn đã hoàn thành
export async function POST(req) {
  try {
    const { user, error } = await getActiveUser();
    if (error) return error;

    const { orderId, productId, rating, comment } = await req.json();
    const stars = Number(rating);
    if (!orderId || !productId || !Number.isInteger(stars) || stars < 1 || stars > 5) {
      return NextResponse.json({ success: false, message: 'Vui lòng chọn số sao từ 1 đến 5' }, { status: 400 });
    }

    const order = await Order.findById(orderId).lean();
    const owns = order && order.customerEmail.toLowerCase() === user.email.toLowerCase();
    if (!owns) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy đơn hàng' }, { status: 404 });
    }
    if (order.orderStatus !== 'completed') {
      return NextResponse.json({ success: false, message: 'Chỉ đánh giá được đơn đã hoàn thành' }, { status: 400 });
    }
    const item = order.items.find((i) => String(i.product) === String(productId));
    if (!item) {
      return NextResponse.json({ success: false, message: 'Sản phẩm không thuộc đơn hàng' }, { status: 400 });
    }

    try {
      const review = await Review.create({
        user: user._id,
        order: order._id,
        product: item.product,
        productName: item.productName,
        rating: stars,
        comment: typeof comment === 'string' ? comment.slice(0, 1000) : '',
      });
      return NextResponse.json({ success: true, data: review, message: 'Cảm ơn bạn đã đánh giá' });
    } catch (e) {
      if (e.code === 11000) {
        return NextResponse.json({ success: false, message: 'Bạn đã đánh giá sản phẩm này' }, { status: 409 });
      }
      throw e;
    }
  } catch (err) {
    console.error('Create review error:', err);
    return NextResponse.json({ success: false, message: 'Lỗi máy chủ' }, { status: 500 });
  }
}
