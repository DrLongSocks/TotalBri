import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { AnnouncementBar } from './AnnouncementBar';
import { Logo } from './Logo';
import { MegaMenu } from './MegaMenu';
import { MobileNav } from './MobileNav';
import { LocaleSwitcher } from './LocaleSwitcher';
import { CartTrigger } from '@/features/cart/CartTrigger';
import { SearchTrigger } from '@/features/search/SearchTrigger';
import type { Locale } from '@/domain/i18n/config';

type Props = {
  locale: Locale;
};

export async function Header({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'nav' });
  const basePath = locale === 'en' ? '/en' : '';

  return (
    <header className="sticky top-0 z-30 w-full bg-paper/95 backdrop-blur">
      <AnnouncementBar />
      <div className="border-b border-mist">
        <div className="container-shell flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-2 md:gap-6">
            <MobileNav locale={locale} />
            <Logo locale={locale} />
          </div>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            <MegaMenu locale={locale} />
            <Link
              href={`${basePath}/tienda?sort=price-asc`}
              className="inline-flex h-10 items-center rounded-full px-3 text-sm font-medium hover:bg-mist"
            >
              {t('offers')}
            </Link>
            <Link
              href={`${basePath}/mayoreo`}
              className="inline-flex h-10 items-center rounded-full px-3 text-sm font-medium hover:bg-mist"
            >
              {t('wholesale')}
            </Link>
            <Link
              href={`${basePath}/nosotros`}
              className="inline-flex h-10 items-center rounded-full px-3 text-sm font-medium hover:bg-mist"
            >
              {t('about')}
            </Link>
          </nav>

          <div className="flex items-center gap-1">
            <SearchTrigger />
            <LocaleSwitcher className="hidden md:inline-flex" />
            <CartTrigger />
          </div>
        </div>
      </div>
    </header>
  );
}
