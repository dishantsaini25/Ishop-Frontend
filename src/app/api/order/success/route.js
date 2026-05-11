import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('user_token')?.value;
    const body = await request.json();
    const backendUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

    const response = await fetch(`${backendUrl}/order/success`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Cookie': `user_token=${token}` }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error('Order success error:', e.message);
    return NextResponse.json({ success: false, message: 'Server error' });
  }
}
