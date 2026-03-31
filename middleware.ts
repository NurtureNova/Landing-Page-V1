import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET is not defined in production environment');
}

const SECRET = new TextEncoder().encode(
  JWT_SECRET || 'fallback_secret_for_development_only'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- CORS HANDLING ---
  const origin = request.headers.get('origin');
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    const preflightHeaders = {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    };
    return new NextResponse(null, { status: 204, headers: preflightHeaders });
  }

  const response = await handleMiddleware(request, pathname);

  // Add CORS headers to all responses
  if (response) {
    response.headers.set('Access-Control-Allow-Origin', origin || '*');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  }

  return response;
}

// Extract existing logic into a separate function for clarity
async function handleMiddleware(request: NextRequest, pathname: string) {

  // 1. Protect /admin routes (pages)
  if (pathname.startsWith('/admin')) {
    // Exclude login page
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      await jwtVerify(token, SECRET);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // 2. Protect /api/admin routes (API)
  if (pathname.startsWith('/api/admin')) {
    // Exclude login API
    if (pathname === '/api/admin/login') {
      return NextResponse.next();
    }

    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
      await jwtVerify(token, SECRET);
      return NextResponse.next();
    } catch {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
  }

  // 3. Protect write operations on other API routes (e.g., /api/events)
  // Exclude public event application submissions (/api/events/[id]/applications POST)
  if (pathname.startsWith('/api/events') && request.method !== 'GET' && !pathname.endsWith('/applications')) {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
      await jwtVerify(token, SECRET);
      return NextResponse.next();
    } catch {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*'
  ],
};
