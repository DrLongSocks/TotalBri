import { getTranslations } from 'next-intl/server';
import type { Product } from '@/domain/product/schema';
import type { Locale } from '@/domain/i18n/config';
import { ProductCarousel } from '@/features/catalog/ProductCarousel';

type Props = {
  products: Product[];
  locale: Locale;
};

export async function RelatedProducts({ products, locale }: Props) {
  if (products.length === 0) return null;
  const t = await getTranslations({ locale, namespace: 'pdp' });

  return (
    <div className="flex flex-col">
      <div className="container-shell mb-8 flex items-end justify-between">
        <h2 className="display-m">{t('related')}</h2>
      </div>
      <ProductCarousel products={products} locale={locale} ariaLabel={t('related')} />
    </div>
  );
}
