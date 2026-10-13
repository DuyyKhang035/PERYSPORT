import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/co-so-du-lieu';
import Product from '@/lib/models/SanPham';
import Brand from '@/lib/models/ThuongHieu';
import Order from '@/lib/models/DonHang';
import { getAdminSession } from '@/lib/xac-thuc';

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Không có quyền truy cập' }, { status: 401 });
    }

    await connectToDatabase();

    const [totalProducts, totalBrands, totalOrders] = await Promise.all([
      Product.countDocuments({}),
      Brand.countDocuments({}),
      Order.countDocuments({}),
    ]);

    // Calculate revenue from completed or confirmed/shipping orders
    const revenueAggregation = await Order.aggregate([
      {
        $match: {
          orderStatus: { $in: ['confirmed', 'shipping', 'completed'] },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
        },
      },
    ]);

    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

    // Recent orders
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Low stock products (total stock <= 10)
    const allProducts = await Product.find({}).lean();
    const lowStockProducts = allProducts
      .map((p) => {
        const totalStock = p.variants ? p.variants.reduce((sum, v) => sum + (v.stock || 0), 0) : 0;
        return {
          ...p,
          totalStock,
        };
      })
      .filter((p) => p.totalStock <= 10)
      .slice(0, 5);

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        totalBrands,
        totalOrders,
        totalRevenue,
        recentOrders,
        lowStockProducts,
      },
    });
  } catch (error) {
    console.error('Fetch stats error:', error);
    return NextResponse.json({ success: false, message: 'Lỗi máy chủ' }, { status: 500 });
  }
}
