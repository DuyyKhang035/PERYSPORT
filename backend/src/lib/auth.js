import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const SESSION_SECRET = process.env.SESSION_SECRET || 'pery_sport_super_secret_session_jwt_key_2026';
const COOKIE_NAME = 'pery_admin_session';

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
  } catch (error) {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export async function setAdminSessionCookie(token) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
