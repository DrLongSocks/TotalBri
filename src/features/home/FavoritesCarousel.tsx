import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/domain/i18n/config';
import type { Product } from '@/domain/product/schema';
import { ProductCarousel } from '@/features/catalog/ProductCarousel';

type Props = {
  locale: Locale;
  products: Product[];
};

export async function FavoritesCarousel({ locale, products }: Props) {
  if (products.length === 0) return null;
  const t = await getTranslations({ locale, namespace: 'home' });
  const tn = await getTranslations({ locale, namespace: 'nav' });
  const basePath = locale === 'en' ? '/en' : '';

  return (
    <section className="py-16 md:py-24">
      <div className="container-shell mb-8 flex items-end justify-between gap-6">
        <h2 className="display-l">{t('favoritesTitle')}</h2>
        <Link
          href={`${basePath}/tienda`}
          className="hidden shrink-0 text-sm font-medium hover:underline md:inline-block"
        >
          {tn('viewAll')} →
        </Link>
      </div>
      <ProductCarousel products={products} locale={locale} ariaLabel={t('favoritesTitle')} />
    </section>
  );
}
