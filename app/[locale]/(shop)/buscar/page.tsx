import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { isLocale } from '@/domain/i18n/config';
import { filterProducts } from '@/domain/product/queries';
import { ProductGrid } from '@/features/catalog/ProductGrid';
import { SearchInput } from '@/features/search/SearchInput';
import { CATEGORY_TREE } from '@/domain/category/tree';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: 'search' });
  return { title: t('title'), description: t('placeholder') };
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const { q = '' } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'search' });
  const base = locale === 'en' ? '/en' : '';

  const results = q ? filterProducts({ search: q }) : [];

  return (
    <section className="py-16 md:py-24">
      <div className="container-shell">
        <h1 className="display-l">{q ? t('resultsFor', { query: q }) : t('title')}</h1>

        <div className="mt-8">
          <SearchInput defaultValue={q} />
        </div>

        <div className="mt-12">
          {q && results.length === 0 ? (
            <div>
              <p className="text-slate">{t('noResults', { query: q })}</p>
              <p className="mt-6 text-sm text-slate">{t('tryOther')}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {CATEGORY_TREE.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`${base}/tienda/${cat.slug}`}
                      className="rounded-full border border-mist px-3 py-1.5 text-sm hover:bg-mist"
                    >
                      {cat.name[locale]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : q ? (
            <ProductGrid products={results} locale={locale} />
          ) : (
            <div>
              <p className="mt-6 text-sm text-slate">{t('popular')}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {CATEGORY_TREE.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`${base}/tienda/${cat.slug}`}
                      className="rounded-full border border-mist px-3 py-1.5 text-sm hover:bg-mist"
                    >
                      {cat.name[locale]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
