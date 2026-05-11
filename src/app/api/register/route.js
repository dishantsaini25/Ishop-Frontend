import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:5000';
    
    console.log('Proxy: Forwarding registration to:', `${backendUrl}/user/register`);
    
    const response = await fetch(`${backendUrl}/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    console.log('Proxy: Backend response:', data);
    
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('Proxy: Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
