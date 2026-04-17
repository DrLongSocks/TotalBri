import createMiddleware from 'next-intl/middleware';
import { DEFAULT_LOCALE, LOCALES } from '@/domain/i18n/config';

export default createMiddleware({
  locales: LOCALES as unknown as string[],
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'as-needed',
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|images|og|favicon|robots.txt|sitemap.xml|.*\\..*).*)'],
};
