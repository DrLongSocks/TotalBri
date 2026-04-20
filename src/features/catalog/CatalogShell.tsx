import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/domain/i18n/config';
import type { Product } from '@/domain/product/schema';
import { FilterSheet } from './FilterSheet';
import { SortSelect } from './SortSelect';
import { ProductGrid } from './ProductGrid';

type Props = {
  locale: Locale;
  products: Product[];
  total: number;
  subcategories: string[];
  tags: string[];
  priceBounds: { min: number; max: number };
};

export async function CatalogShell({
  locale,
  products,
  total,
  subcategories,
  tags,
  priceBounds,
}: Props) {
  const t = await getTranslations({ locale, namespace: 'shop' });

  return (
    <div className="min-w-0">
      {/* Top bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate">{t('resultsCount', { count: total })}</p>
        <div className="flex items-center gap-2">
          <FilterSheet
            locale={locale}
            subcategories={subcategories}
            tags={tags}
            priceBounds={priceBounds}
          />
          <SortSelect />
        </div>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <p className="text-slate">{t('emptyResults')}</p>
        </div>
      ) : (
        <ProductGrid products={products} locale={locale} />
      )}
    </div>
  );
}
