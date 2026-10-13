import { NextResponse } from 'next/server';

const USER_COOKIE = 'pery_user_session';
const ADMIN_COOKIE = 'pery_admin_session';

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const userToken = request.cookies.get(USER_COOKIE)?.value;
  const adminToken = request.cookies.get(ADMIN_COOKIE)?.value;

  // ── Trang đăng nhập chung (/dang-nhap) ─────────────────────────────────────
  if (pathname === '/dang-nhap') {
    if (adminToken) return NextResponse.redirect(new URL('/quan-tri', request.url));
    if (userToken) return NextResponse.redirect(new URL('/tai-khoan', request.url));
    return NextResponse.next();
  }

  // ── Trang đăng ký (/dang-ky) ──────────────────────────────────────────
  if (pathname === '/dang-ky') {
    if (userToken) return NextResponse.redirect(new URL('/tai-khoan', request.url));
    return NextResponse.next();
  }

  // ── Trang đăng nhập admin (/quan-tri/dang-nhap) ───────────────────────────────
  if (pathname === '/quan-tri/dang-nhap') {
    if (adminToken) return NextResponse.redirect(new URL('/quan-tri', request.url));
    return NextResponse.next();
  }

  // ── Bảo vệ trang Admin (trừ /quan-tri/dang-nhap) ──────────────────────────────
  if (pathname.startsWith('/quan-tri')) {
    if (!adminToken) {
      return NextResponse.redirect(new URL('/quan-tri/dang-nhap', request.url));
    }
    return NextResponse.next();
  }

  // ── Bảo vệ trang Profile ───────────────────────────────────────────────
  if (pathname.startsWith('/tai-khoan')) {
    if (!userToken) return NextResponse.redirect(new URL('/dang-nhap', request.url));
    return NextResponse.next();
  }

  // ── Bảo vệ tất cả trang Store & trang chủ ─────────────────────────────
  const protectedPaths = ['/', '/san-pham', '/thuong-hieu', '/tin-tuc', '/gio-hang', '/thanh-toan', '/lien-he', '/tra-cuu', '/dat-hang-thanh-cong'];
  const isProtected = protectedPaths.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );

  if (isProtected) {
    if (!userToken) return NextResponse.redirect(new URL('/dang-nhap', request.url));
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|sitemap.js|robots.js|uploads/).*)',
  ],
};
