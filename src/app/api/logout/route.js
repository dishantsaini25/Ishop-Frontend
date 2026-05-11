import { NextResponse } from 'next/server';

export async function POST(request) {
  // Tell backend to clear its cookie
  try {
    const backendUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
    const cookieHeader = request.headers.get('cookie') || '';
    await fetch(`${backendUrl}/user/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookieHeader },
    }).catch(() => {});
  } catch (_) {}

  // Clear cookie from browser - set expired date
  const response = NextResponse.json({ success: true });

  // Delete with same attributes as when it was set (production: secure + sameSite none)
  response.cookies.set({
    name: 'user_token',
    value: '',
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    expires: new Date(0), // Immediately expire
  });

  return response;
}
