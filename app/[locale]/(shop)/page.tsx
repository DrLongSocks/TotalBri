import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isLocale } from '@/domain/i18n/config';
import { HeroCarousel } from '@/features/home/HeroCarousel';
import { findFeatured, findByCategory } from '@/domain/product/queries';
import { ProductCard } from '@/features/catalog/ProductCard';
import { MobileCategoryCarousel } from '@/features/home/MobileCategoryCarousel';
import { CATEGORY_TREE } from '@/domain/category/tree';
import { localBusinessJsonLd, safeJsonLd } from '@/lib/seo';
import type { Locale } from '@/domain/i18n/config';

type Props = { params: Promise<{ locale: string }> };

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <div className="h-6 w-1.5 flex-shrink-0 rounded-full bg-azure" />
      <h2 className="font-display text-[26px] font-extrabold uppercase tracking-wide text-ink">
        {children}
      </h2>
    </div>
  );
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const favorites = findFeatured(8);

  const categoryCards = CATEGORY_TREE.flatMap((cat) => {
    const products = findByCategory(cat.slug);
    if (!products.length) return [];
    return [{ slug: cat.slug, name: cat.name.es, image: products[0].images[0], count: products.length, locale }];
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(localBusinessJsonLd()) }}
      />

      {/* Hero */}
      <HeroCarousel />

      {/* Bestsellers */}
      {favorites.length > 0 && (
        <section id="mas-vendidos" className="mt-12">
          <SectionHeading>Más vendidos</SectionHeading>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {favorites.map((p, i) => (
              <div key={p.id} className={i >= 4 ? 'hidden md:block' : undefined}>
                <ProductCard product={p} locale={locale as Locale} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Categories carousel — mobile only */}
      {categoryCards.length > 0 && (
        <section id="categorias" className="mt-12 md:hidden">
          <SectionHeading>Categorías</SectionHeading>
          <MobileCategoryCarousel categories={categoryCards} />
        </section>
      )}
    </>
  );
}
