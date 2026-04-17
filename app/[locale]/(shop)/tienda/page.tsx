import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isLocale } from '@/domain/i18n/config';
import {
  filterProducts,
  paginate,
  getAllTagsFor,
  type SortOption,
} from '@/domain/product/queries';
import { CatalogShell } from '@/features/catalog/CatalogShell';
import { CATEGORY_TREE } from '@/domain/category/tree';
import { parseFilterParams } from '@/lib/url';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: 'shop' });
  return { title: t('title'), description: t('intro') };
}

function toSearchParams(input: Record<string, string | string[] | undefined>): URLSearchParams {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(input)) {
    if (Array.isArray(value)) value.forEach((v) => sp.append(key, v));
    else if (value !== undefined) sp.set(key, value);
  }
  return sp;
}

export default async function TiendaPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'shop' });
  const rawParams = await searchParams;
  const filters = parseFilterParams(toSearchParams(rawParams));

  const filtered = filterProducts({
    subcategories: filters.sub,
    tags: filters.tag,
    minPrice: filters.min,
    maxPrice: filters.max,
    inStockOnly: filters.inStock,
    sort: (filters.sort as SortOption) ?? 'relevance',
  });

  const { items, page, totalPages, total } = paginate(filtered, filters.page ?? 1);
  const allSubs = CATEGORY_TREE.flatMap((c) => c.subcategories.map((s) => s.slug));
  const allTags = getAllTagsFor();

  return (
    <>
      <section className="border-b border-mist bg-porcelain">
        <div className="container-shell py-16 md:py-24">
          <p className="eyebrow mb-3 text-slate">{t('breadcrumbShop')}</p>
          <h1 className="display-l">{t('allProducts')}</h1>
          <p className="mt-4 max-w-xl text-slate">{t('intro')}</p>
        </div>
      </section>
      <CatalogShell
        locale={locale}
        products={items}
        page={page}
        totalPages={totalPages}
        total={total}
        subcategories={allSubs}
        tags={allTags}
        priceBounds={{ min: 0, max: 1000 }}
      />
    </>
  );
}
