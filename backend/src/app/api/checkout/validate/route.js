import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/co-so-du-lieu';
import Product from '@/lib/models/SanPham';
import Promotion from '@/lib/models/KhuyenMai';
import { calculateDiscount } from '@/lib/tien-ich';

export async function POST(req) {
  try {
    await connectToDatabase();
    const { items } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, message: 'Giỏ hàng trống' }, { status: 400 });
    }

    const validatedItems = [];
    let subtotal = 0;
    let totalDiscount = 0;
    const now = new Date();

    for (const item of items) {
      const product = await Product.findById(item.productId).populate('promotion').lean();

      if (!product || !product.isActive) {
        return NextResponse.json({
          success: false,
          message: `Sản phẩm "${item.productName || 'Không xác định'}" hiện tại không còn kinh doanh`,
        }, { status: 400 });
      }

      const variant = product.variants.find(
        (v) => v.color === item.color && v.size === String(item.size)
      );

      if (!variant) {
        return NextResponse.json({
          success: false,
          message: `Mẫu "${product.name}" phiên bản Màu ${item.color} - Size ${item.size} không còn tồn tại`,
        }, { status: 400 });
      }

      if (variant.stock < item.quantity) {
        return NextResponse.json({
          success: false,
          message: `Sản phẩm "${product.name}" (${variant.color} - Size ${variant.size}) chỉ còn ${variant.stock} sản phẩm trong kho`,
        }, { status: 400 });
      }

      const originalUnitPrice = variant.price || product.originalPrice;
      let unitPrice = variant.price || product.salePrice || product.originalPrice;
      let promotionName = '';

      if (product.promotion && product.promotion.isActive) {
        const start = new Date(product.promotion.startDate);
        const end = new Date(product.promotion.endDate);
        if (start <= now && now <= end) {
          const calc = calculateDiscount(originalUnitPrice, product.promotion);
          unitPrice = calc.finalPrice;
          promotionName = product.promotion.name;
        }
      }

      const itemTotalPrice = unitPrice * item.quantity;
      subtotal += originalUnitPrice * item.quantity;
      totalDiscount += (originalUnitPrice - unitPrice) * item.quantity;

      validatedItems.push({
        product: product._id,
        productName: product.name,
        sku: variant.sku,
        color: variant.color,
        size: String(variant.size),
        image: variant.image || product.images[0] || '',
        unitPrice: unitPrice,
        originalUnitPrice: originalUnitPrice,
        quantity: item.quantity,
        totalPrice: itemTotalPrice,
        promotionName: promotionName,
      });
    }

    const shippingFee = 0; // Free shipping
    const totalAmount = subtotal - totalDiscount + shippingFee;

    return NextResponse.json({
      success: true,
      data: {
        items: validatedItems,
        subtotal,
        discountAmount: totalDiscount,
        shippingFee,
        totalAmount,
      },
    });
  } catch (error) {
    console.error('Checkout validation error:', error);
    return NextResponse.json({ success: false, message: 'Lỗi xác thực đơn hàng' }, { status: 500 });
  }
}
