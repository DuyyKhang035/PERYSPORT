import { NextResponse } from 'next/server';

const USER_COOKIE = 'pery_user_session';
const ADMIN_COOKIE = 'pery_admin_session';

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const userToken = request.cookies.get(USER_COOKIE)?.value;
  const adminToken = request.cookies.get(ADMIN_COOKIE)?.value;

  // ── Trang đăng nhập chung (/dang-nhap) ─────────────────────────────────────
  if (pathname === '/login') {
    if (adminToken) return NextResponse.redirect(new URL('/admin', request.url));
    if (userToken) {
      const redirect = request.nextUrl.searchParams.get('redirect');
      return NextResponse.redirect(new URL(redirect || '/account', request.url));
    }
    return NextResponse.next();
  }

  // ── Trang đăng ký (/dang-ky) ──────────────────────────────────────────
  if (pathname === '/register') {
    if (userToken) return NextResponse.redirect(new URL('/account', request.url));
    return NextResponse.next();
  }

  // ── Chuyển hướng /admin/login thẳng vào /admin ─────────────────────────
  if (pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // ── Trang Admin truy cập trực tiếp không cần đăng nhập ─────────────────
  if (pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // ── Bảo vệ trang Profile ───────────────────────────────────────────────
  if (pathname.startsWith('/account')) {
    if (!userToken) return NextResponse.redirect(new URL('/login', request.url));
    return NextResponse.next();
  }

  // ── Bảo vệ trang Thanh toán (chỉ bắt đăng nhập khi mua hàng) ──────────
  if (pathname.startsWith('/checkout') || pathname.startsWith('/order-success')) {
    if (!userToken) return NextResponse.redirect(new URL('/login?redirect=' + encodeURIComponent(pathname), request.url));
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
