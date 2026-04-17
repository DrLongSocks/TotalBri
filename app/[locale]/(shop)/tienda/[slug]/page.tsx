import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ChevronRight } from 'lucide-react';
import { isLocale } from '@/domain/i18n/config';
import { CategoryEnum } from '@/domain/product/schema';
import { CATEGORY_META } from '@/domain/category/metadata';
import { getCategoryNode } from '@/domain/category/tree';
import {
  filterProducts,
  paginate,
  getSubcategoriesFor,
  getAllTagsFor,
  type SortOption,
} from '@/domain/product/queries';
import { CatalogShell } from '@/features/catalog/CatalogShell';
import { parseFilterParams } from '@/lib/url';
import { collectionJsonLd } from '@/lib/seo';
import { env } from '@/lib/env';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const parsed = CategoryEnum.safeParse(slug);
  if (!parsed.success) return {};
  const meta = CATEGORY_META[parsed.data];
  return { title: meta.name[locale], description: meta.intro[locale] };
}

function toSearchParams(input: Record<string, string | string[] | undefined>): URLSearchParams {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(input)) {
    if (Array.isArray(value)) value.forEach((v) => sp.append(key, v));
    else if (value !== undefined) sp.set(key, value);
  }
  return sp;
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const parsed = CategoryEnum.safeParse(slug);
  if (!parsed.success) notFound();
  const category = parsed.data;

  const t = await getTranslations({ locale, namespace: 'shop' });
  const meta = CATEGORY_META[category];
  const node = getCategoryNode(category);
  const base = locale === 'en' ? '/en' : '';

  const rawParams = await searchParams;
  const filters = parseFilterParams(toSearchParams(rawParams));

  const results = filterProducts({
    category,
    subcategories: filters.sub,
    tags: filters.tag,
    minPrice: filters.min,
    maxPrice: filters.max,
    inStockOnly: filters.inStock,
    sort: (filters.sort as SortOption) ?? 'relevance',
  });

  const { items, page, totalPages, total } = paginate(results, filters.page ?? 1);
  const subs = node ? node.subcategories.map((s) => s.slug) : getSubcategoriesFor(category);
  const tags = getAllTagsFor(category);

  const jsonLd = collectionJsonLd(
    meta.name[locale],
    `${env.NEXT_PUBLIC_SITE_URL}${base}/tienda/${slug}`,
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="relative overflow-hidden bg-ink text-paper">
        <div className={`absolute inset-0 bg-gradient-to-br ${meta.heroAccent}`} aria-hidden />
        <div className="noise" />
        <div className="container-shell relative z-10 py-20 md:py-32">
          <nav className="mb-6 flex items-center gap-1 text-xs text-paper/70">
            <Link href={base || '/'} className="hover:text-paper">
              {t('breadcrumbHome')}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href={`${base}/tienda`} className="hover:text-paper">
              {t('breadcrumbShop')}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-paper">{meta.name[locale]}</span>
          </nav>
          <p className="eyebrow mb-4 text-paper/70">{meta.tagline[locale]}</p>
          <h1 className="display-xl text-paper">{meta.name[locale]}</h1>
          <p className="mt-6 max-w-xl text-lg text-paper/80">{meta.intro[locale]}</p>
        </div>
      </section>
      <CatalogShell
        locale={locale}
        products={items}
        page={page}
        totalPages={totalPages}
        total={total}
        subcategories={subs}
        tags={tags}
        priceBounds={{ min: 0, max: 1000 }}
      />
    </>
  );
}

export async function generateStaticParams() {
  return CategoryEnum.options.map((slug) => ({ slug }));
}
