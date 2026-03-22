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
    '/api/admin/:path*',
    '/api/events/:path*'
  ],
};
