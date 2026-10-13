import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/co-so-du-lieu';
import Product from '@/lib/models/SanPham';
import Brand from '@/lib/models/ThuongHieu';
import Category from '@/lib/models/DanhMuc';
import Promotion from '@/lib/models/KhuyenMai';
import { getAdminSession } from '@/lib/xac-thuc';
import { slugify, calculateDiscount } from '@/lib/tien-ich';

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    let query = {};
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query._id = id;
    } else {
      query.slug = id;
    }

    const rawProduct = await Product.findOne(query)
      .populate('brand', 'name slug logo')
      .populate('categories', 'name slug')
      .populate('promotion')
      .lean();

    if (!rawProduct) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy sản phẩm' }, { status: 404 });
    }

    // Process promotion logic
    const now = new Date();
    let finalPrice = rawProduct.salePrice || rawProduct.originalPrice;
    let discountPercentage = 0;
    let isPromoActive = false;

    if (rawProduct.promotion && rawProduct.promotion.isActive) {
      const start = new Date(rawProduct.promotion.startDate);
      const end = new Date(rawProduct.promotion.endDate);
      if (start <= now && now <= end) {
        isPromoActive = true;
        const calc = calculateDiscount(rawProduct.originalPrice, rawProduct.promotion);
        finalPrice = calc.finalPrice;
        discountPercentage = calc.percentage;
      }
    }

    if (!isPromoActive && rawProduct.originalPrice > rawProduct.salePrice && rawProduct.salePrice > 0) {
      discountPercentage = Math.round(((rawProduct.originalPrice - rawProduct.salePrice) / rawProduct.originalPrice) * 100);
      finalPrice = rawProduct.salePrice;
    }

    const totalStock = rawProduct.variants ? rawProduct.variants.reduce((acc, v) => acc + (v.stock || 0), 0) : 0;

    const product = {
      ...rawProduct,
      finalPrice,
      discountPercentage,
      isPromoActive,
      totalStock,
    };

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Fetch single product error:', error);
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

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy sản phẩm' }, { status: 404 });
    }

    if (body.name) product.name = body.name;
    if (body.slug) product.slug = slugify(body.slug);
    if (body.brand) product.brand = body.brand;
    if (body.categories) product.categories = body.categories;
    if (body.description !== undefined) product.description = body.description;
    if (body.images) product.images = body.images;
    if (body.variants) product.variants = body.variants;
    if (body.originalPrice !== undefined) product.originalPrice = body.originalPrice;
    if (body.salePrice !== undefined) product.salePrice = body.salePrice;
    if (body.promotion !== undefined) product.promotion = body.promotion || null;
    if (body.soldCount !== undefined) product.soldCount = body.soldCount;
    if (body.isActive !== undefined) product.isActive = body.isActive;
    if (body.isFeatured !== undefined) product.isFeatured = body.isFeatured;
    if (body.seoTitle !== undefined) product.seoTitle = body.seoTitle;
    if (body.seoDescription !== undefined) product.seoDescription = body.seoDescription;

    await product.save();
    return NextResponse.json({ success: true, message: 'Cập nhật sản phẩm thành công', data: product });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ success: false, message: 'Lỗi khi cập nhật sản phẩm' }, { status: 500 });
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
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi khi xóa sản phẩm' }, { status: 500 });
  }
}
