import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const base = () => (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

const getAdminToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get('admin_token')?.value || null;
};

// Generic proxy for admin GET requests
// Usage: /api/admin/proxy?path=category%3Fstatus%3Dtrue
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');
    if (!path) return NextResponse.json({ success: false, message: 'Path required' });

    const token = await getAdminToken();
    const response = await fetch(`${base()}/${path}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Cookie': `admin_token=${token}` }),
      },
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Server error' });
  }
}
