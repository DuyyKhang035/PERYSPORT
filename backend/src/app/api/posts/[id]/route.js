import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/co-so-du-lieu';
import Post from '@/lib/models/BaiViet';
import { getAdminSession } from '@/lib/xac-thuc';
import { slugify } from '@/lib/tien-ich';

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

    const post = await Post.findOne(query);
    if (!post) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy bài viết' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: post });
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

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy bài viết' }, { status: 404 });
    }

    if (body.title) post.title = body.title;
    if (body.slug) post.slug = slugify(body.slug);
    if (body.summary !== undefined) post.summary = body.summary;
    if (body.content) post.content = body.content;
    if (body.image !== undefined) post.image = body.image;
    if (body.status) post.status = body.status;
    if (body.seoTitle !== undefined) post.seoTitle = body.seoTitle;
    if (body.seoDescription !== undefined) post.seoDescription = body.seoDescription;

    await post.save();
    return NextResponse.json({ success: true, message: 'Cập nhật bài viết thành công', data: post });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi khi cập nhật bài viết' }, { status: 500 });
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
    await Post.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Xóa bài viết thành công' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi khi xóa bài viết' }, { status: 500 });
  }
}
