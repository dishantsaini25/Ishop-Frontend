import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('user_token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, data: [] }, { status: 200 });
    }

    const backendUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

    const response = await fetch(`${backendUrl}/order/my-orders`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `user_token=${token}`,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, data: [] }, { status: 200 });
  }
}
