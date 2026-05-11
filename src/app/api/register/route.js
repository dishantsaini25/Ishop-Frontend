import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    const backendUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
    
    console.log('Proxy: Forwarding registration to:', `${backendUrl}/user/register`);
    
    const response = await fetch(`${backendUrl}/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    console.log('Proxy: Backend response status:', response.status, 'data:', data);
    
    // Always return 200 to frontend so fetch doesn't throw
    // Pass the actual success/message from backend
    return NextResponse.json(data, { status: 200 });
    
  } catch (error) {
    console.error('Proxy: Error:', error.message);
    return NextResponse.json(
      { success: false, message: 'Server error. Please try again.' },
      { status: 200 }
    );
  }
}
