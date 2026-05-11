import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const getToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get('user_token')?.value || null;
};

const base = () =>
  (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

// PUT /api/user/password - change password
export async function PUT(request) {
  try {
    const token = await getToken();
    if (!token) return NextResponse.json({ success: false, message: 'Not authenticated' });

    const body = await request.json();
    const response = await fetch(`${base()}/user/change-password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Cookie': `user_token=${token}` },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Server error' });
  }
}
