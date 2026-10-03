import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Post from '@/lib/models/Post';
import { getAdminSession } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const filter = {};
    if (status) filter.status = status;

    const posts = await Post.find(filter).sort({ createdAt: -1 }).limit(limit);
    return NextResponse.json({ success: true, data: posts });
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

    if (!body.title || !body.content) {
      return NextResponse.json({ success: false, message: 'Tiêu đề và nội dung bài viết không được để trống' }, { status: 400 });
    }

    const slug = body.slug ? slugify(body.slug) : slugify(body.title);
    const existing = await Post.findOne({ slug });
    if (existing) {
      return NextResponse.json({ success: false, message: 'Slug bài viết đã tồn tại' }, { status: 400 });
    }

    const post = await Post.create({
      title: body.title,
      slug,
      summary: body.summary || '',
      content: body.content,
      image: body.image || '',
      status: body.status || 'published',
      seoTitle: body.seoTitle || '',
      seoDescription: body.seoDescription || '',
    });

    return NextResponse.json({ success: true, message: 'Đăng bài viết thành công', data: post }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi máy chủ' }, { status: 500 });
  }
}
