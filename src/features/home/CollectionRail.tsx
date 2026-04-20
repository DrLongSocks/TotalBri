import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/domain/i18n/config';
import type { Product, Category } from '@/domain/product/schema';
import { CATEGORY_META } from '@/domain/category/metadata';
import { ProductCarousel } from '@/features/catalog/ProductCarousel';

type Props = {
  locale: Locale;
  products: Product[];
  category: Category;
};

export async function CollectionRail({ locale, products, category }: Props) {
  const t = await getTranslations({ locale, namespace: 'home' });
  const tn = await getTranslations({ locale, namespace: 'nav' });
  const meta = CATEGORY_META[category];
  const basePath = '';

  if (products.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="container-shell mb-8 flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow mb-3 text-slate">{t('shopCollection')}</p>
          <h2 className="display-l">{meta.name[locale]}</h2>
        </div>
        <Link
          href={`${basePath}/tienda/${category}`}
          className="hidden shrink-0 text-sm font-medium hover:underline md:inline-block"
        >
          {tn('viewAll')} →
        </Link>
      </div>
      <ProductCarousel products={products} locale={locale} ariaLabel={meta.name[locale]} />
    </section>
  );
}
