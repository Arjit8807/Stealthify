import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// if only this is present , the next-auth works on entire site
//TODO: learn about this too
export { default } from 'next-auth/middleware';

// when u want auth only on certain pages u can export config object with a matcher
//TODO: learn about matcher eactly
export const config = {
  matcher: ['/dashboard', '/sign-in', '/sign-up', '/', '/verify/:path*'],
};


export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // Redirect to dashboard if the user is already authenticated
  // and trying to access sign-in, sign-up, or home page
  if (
    token &&
    (url.pathname === '/sign-in' ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify') 
    )
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}