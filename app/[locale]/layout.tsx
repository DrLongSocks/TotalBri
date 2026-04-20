import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileNav';
import { CartDrawerProvider } from '@/features/cart/CartDrawerProvider';
import { isLocale, LOCALES } from '@/domain/i18n/config';
import { getAllProducts } from '@/domain/product/repository';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: 'brand' });
  return {
    title: { default: `Total Bri — ${t('tagline')}`, template: '%s · Total Bri' },
    description: t('tagline'),
    openGraph: {
      locale: 'es_MX',
      siteName: 'Total Bri',
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const products = getAllProducts().map((p) => ({ ...p }));

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <CartDrawerProvider products={products}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Ir al contenido
        </a>
        <Header locale={locale} />
        <main id="main">{children}</main>
        <Footer locale={locale} />
        <MobileBottomNav />
      </CartDrawerProvider>
    </NextIntlClientProvider>
  );
}
