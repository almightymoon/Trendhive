import { NextResponse } from 'next/server';

export function middleware(request) {
  // Only apply to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
}; 