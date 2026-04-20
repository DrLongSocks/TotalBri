import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isLocale } from '@/domain/i18n/config';
import { HeroCarousel } from '@/features/home/HeroCarousel';
import { findFeatured } from '@/domain/product/queries';
import { ProductCard } from '@/features/catalog/ProductCard';
import { localBusinessJsonLd } from '@/lib/seo';
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
      />

      {/* Hero */}
      <HeroCarousel />

      {/* Bestsellers */}
      {favorites.length > 0 && (
        <section id="mas-vendidos" className="mt-10">
          <SectionHeading>Más vendidos</SectionHeading>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
            {favorites.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale as Locale} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
