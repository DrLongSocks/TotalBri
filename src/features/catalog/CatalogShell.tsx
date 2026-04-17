import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/domain/i18n/config';
import type { Product } from '@/domain/product/schema';
import { FilterPanel } from './FilterPanel';
import { FilterSheet } from './FilterSheet';
import { SortSelect } from './SortSelect';
import { ProductGrid } from './ProductGrid';
import { Pagination } from './Pagination';

type Props = {
  locale: Locale;
  products: Product[];
  page: number;
  totalPages: number;
  total: number;
  subcategories: string[];
  tags: string[];
  priceBounds: { min: number; max: number };
};

export async function CatalogShell({
  locale,
  products,
  page,
  totalPages,
  total,
  subcategories,
  tags,
  priceBounds,
}: Props) {
  const t = await getTranslations({ locale, namespace: 'shop' });

  return (
    <div className="container-shell grid gap-10 py-10 md:py-16 lg:grid-cols-[240px_1fr] lg:gap-16">
      <aside className="hidden lg:block">
        <h3 className="eyebrow mb-5 text-slate">{t('filters')}</h3>
        <FilterPanel
          locale={locale}
          subcategories={subcategories}
          tags={tags}
          priceBounds={priceBounds}
        />
      </aside>

      <div className="min-w-0">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
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
          <>
            <ProductGrid products={products} locale={locale} />
            <Pagination page={page} totalPages={totalPages} />
          </>
        )}
      </div>
    </div>
  );
}
