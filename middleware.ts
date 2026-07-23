import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { DEFAULT_LOCALE, LOCALES } from '@/domain/i18n/config';
import { auth } from '@/lib/auth/auth-edge';

const intlMiddleware = createMiddleware({
  locales: LOCALES as unknown as string[],
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'as-needed',
});

const ADMIN_HOST = process.env.ADMIN_HOST ?? 'admin.totalbri.mx';
const PUBLIC_ADMIN_PATHS = ['/login', '/invite/accept'];

function isAdminHost(host: string) {
  return host === ADMIN_HOST || host.startsWith('admin.localhost') || host.startsWith('admin-');
}

export default async function middleware(req: NextRequest) {
  const host = req.headers.get('host') ?? '';

  if (isAdminHost(host)) {
    return handleAdminHost(req);
  }

  // Unchanged for every other host — the storefront's locale routing never
  // sees the admin branch above.
  return intlMiddleware(req);
}

async function handleAdminHost(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublic = PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p));
  const session = isPublic ? null : await auth();

  if (!isPublic && !session) {
    const url = new URL('/login', req.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  const url = req.nextUrl.clone();
  url.pathname = `/admin${pathname === '/' ? '/dashboard' : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|images|og|favicon|robots.txt|sitemap.xml|.*\\..*).*)'],
};
