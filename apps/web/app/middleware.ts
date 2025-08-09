import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const PUBLIC_PATHS = ['/login', '/api/auth/login'];

export function middleware(req: NextRequest) {
  if (PUBLIC_PATHS.includes(req.nextUrl.pathname)) {
    return NextResponse.next();
  }
  const token = req.cookies.get('access_token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  try {
    // JWT_SECRET must match API workspace
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
};