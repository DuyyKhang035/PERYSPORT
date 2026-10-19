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
    if (userToken) {
      const redirect = request.nextUrl.searchParams.get('redirect');
      return NextResponse.redirect(new URL(redirect || '/tai-khoan', request.url));
    }
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

  // ── Bảo vệ trang Thanh toán (chỉ bắt đăng nhập khi mua hàng) ──────────
  if (pathname.startsWith('/thanh-toan') || pathname.startsWith('/dat-hang-thanh-cong')) {
    if (!userToken) return NextResponse.redirect(new URL('/dang-nhap?redirect=' + encodeURIComponent(pathname), request.url));
    return NextResponse.next();
  }

  // Các trang còn lại không yêu cầu đăng nhập
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|sitemap.js|robots.js|uploads/).*)',
  ],
};
