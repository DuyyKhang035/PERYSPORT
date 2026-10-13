import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const SESSION_SECRET = process.env.SESSION_SECRET || 'pery_sport_super_secret_session_jwt_key_2026';

// ─── ADMIN AUTH ──────────────────────────────────────────────────────────────
const ADMIN_COOKIE = 'pery_admin_session';

export function signAdminToken(adminData) {
  return jwt.sign(
    {
      id: adminData._id || adminData.id,
      username: adminData.username,
      name: adminData.name,
      role: adminData.role || 'superadmin',
    },
    SESSION_SECRET,
    { expiresIn: '1d' }
  );
}

export function verifyAdminToken(token) {
  try {
    return jwt.verify(token, SESSION_SECRET);
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export async function setAdminSessionCookie(token) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 ngày
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

// ─── USER AUTH ───────────────────────────────────────────────────────────────
const USER_COOKIE = 'pery_user_session';

export function signUserToken(userData) {
  return jwt.sign(
    {
      id: userData._id || userData.id,
      email: userData.email,
      fullName: userData.fullName || '',
      role: userData.role || 'user',
    },
    SESSION_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyUserToken(token) {
  try {
    return jwt.verify(token, SESSION_SECRET);
  } catch {
    return null;
  }
}

export async function getUserSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_COOKIE)?.value;
  if (!token) return null;
  return verifyUserToken(token);
}

export async function setUserSessionCookie(token) {
  const cookieStore = await cookies();
  cookieStore.set(USER_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 ngày
  });
}

export async function clearUserSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(USER_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
