import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnAuthPage = req.nextUrl.pathname.startsWith('/sign-in') || 
                      req.nextUrl.pathname.startsWith('/sign-up');

  // If user is logged in and tries to access auth pages, redirect to home
  if (isLoggedIn && isOnAuthPage) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // If user is not logged in and tries to access protected pages
  if (!isLoggedIn && !isOnAuthPage && req.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  return NextResponse.next();
});

// Configure which paths need authentication
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 