import { NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import jwt from 'jsonwebtoken';

const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'always'
});

export default async function middleware(req) {
  const pathname = req.nextUrl.pathname;

  // Pattern for admin pages: /en/admin, /ar/admin, etc.
  const isAdminPage = /^\/(en|ar)\/admin($|\/)/.test(pathname);

  if (isAdminPage) {
    const token = req.cookies.get('auth_token')?.value;

    if (!token) {
      const locale = pathname.split('/')[1] || 'en';
      return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return intlMiddleware(req);
    } catch (err) {
      const locale = pathname.split('/')[1] || 'en';
      return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
