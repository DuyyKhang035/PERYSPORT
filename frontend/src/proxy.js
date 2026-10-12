import { NextResponse } from 'next/server';

const USER_COOKIE = 'pery_user_session';
const ADMIN_COOKIE = 'pery_admin_session';

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const userToken = request.cookies.get(USER_COOKIE)?.value;
  const adminToken = request.cookies.get(ADMIN_COOKIE)?.value;

  // ── Trang đăng nhập chung (/login) ─────────────────────────────────────
  if (pathname === '/login') {
    if (adminToken) return NextResponse.redirect(new URL('/admin', request.url));
    if (userToken) return NextResponse.redirect(new URL('/profile', request.url));
    return NextResponse.next();
  }

  // ── Trang đăng ký (/register) ──────────────────────────────────────────
  if (pathname === '/register') {
    if (userToken) return NextResponse.redirect(new URL('/profile', request.url));
    return NextResponse.next();
  }

  // ── Trang đăng nhập admin (/admin/login) ───────────────────────────────
  if (pathname === '/admin/login') {
    if (adminToken) return NextResponse.redirect(new URL('/admin', request.url));
    return NextResponse.next();
  }

  // ── Bảo vệ trang Admin (trừ /admin/login) ──────────────────────────────
  if (pathname.startsWith('/admin')) {
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
  }

  // ── Bảo vệ trang Profile ───────────────────────────────────────────────
  if (pathname.startsWith('/profile')) {
    if (!userToken) return NextResponse.redirect(new URL('/login', request.url));
    return NextResponse.next();
  }

  // ── Bảo vệ tất cả trang Store & trang chủ ─────────────────────────────
  const protectedPaths = ['/', '/products', '/brands', '/blogs', '/cart', '/checkout', '/contact', '/lookup', '/order-success'];
  const isProtected = protectedPaths.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );

  if (isProtected) {
    if (!userToken) return NextResponse.redirect(new URL('/login', request.url));
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|sitemap.js|robots.js|uploads/).*)',
  ],
};
