import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';








const NOT_PROTECTED = ['/login','/register']



export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const pathname = request.nextUrl.pathname;

  // Jeśli nie ma tokena, a próbuje wejść na stronę chronioną
  if (!token && !NOT_PROTECTED.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && NOT_PROTECTED.includes(pathname)) {
    return NextResponse.redirect(new URL('/home', request.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};







