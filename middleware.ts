import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { DEFAULT_LOCALE, LOCALES } from '@/domain/i18n/config';
import { auth } from '@/lib/auth/auth-edge';

const intlMiddleware = createMiddleware({
  locales: LOCALES as unknown as string[],
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'as-needed',
});

const PUBLIC_ADMIN_PATHS = ['/admin/login', '/admin/invite/accept'];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    return handleAdminPath(req);
  }

  // Unchanged for every other path — the storefront's locale routing never
  // sees the admin branch above.
  return intlMiddleware(req);
}

async function handleAdminPath(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === '/admin' || pathname === '/admin/') {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url));
  }

  const isPublic = PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p));
  const session = isPublic ? null : await auth();

  if (!isPublic && !session) {
    const url = new URL('/admin/login', req.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|images|og|favicon|robots.txt|sitemap.xml|.*\\..*).*)'],
};
