import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const getToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get('user_token')?.value || null;
};

const base = () =>
  (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

// POST /api/user/address?user_id=xxx  - add address
export async function POST(request) {
  try {
    const token = await getToken();
    if (!token) return NextResponse.json({ success: false, message: 'Not authenticated' });

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const body = await request.json();

    const response = await fetch(`${base()}/user/address/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': `user_token=${token}` },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Server error' });
  }
}

// PUT /api/user/address?user_id=xxx&index=0  - update address
export async function PUT(request) {
  try {
    const token = await getToken();
    if (!token) return NextResponse.json({ success: false, message: 'Not authenticated' });

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const index = searchParams.get('index');
    const body = await request.json();

    const response = await fetch(`${base()}/user/address/${userId}/${index}`, {
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

// DELETE /api/user/address?user_id=xxx&index=0  - delete address
export async function DELETE(request) {
  try {
    const token = await getToken();
    if (!token) return NextResponse.json({ success: false, message: 'Not authenticated' });

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const index = searchParams.get('index');

    const response = await fetch(`${base()}/user/address/${userId}/${index}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Cookie': `user_token=${token}` },
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Server error' });
  }
}
