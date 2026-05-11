import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const backendUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

    // 25 second timeout - Render can be slow on cold start + email sending
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    let response;
    try {
      response = await fetch(`${backendUrl}/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { success: false, message: 'Server is taking too long. Please try again.' },
          { status: 200 }
        );
      }
      throw fetchError;
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Register proxy error:', error.message);
    return NextResponse.json(
      { success: false, message: 'Server error. Please try again.' },
      { status: 200 }
    );
  }
}
