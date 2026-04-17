import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isLocale } from '@/domain/i18n/config';
import { findBySlug, findRelated } from '@/domain/product/queries';
import { getAllProducts } from '@/domain/product/repository';
import { PDPBreadcrumbs } from '@/features/pdp/PDPBreadcrumbs';
import { ProductGallery } from '@/features/pdp/ProductGallery';
import { ProductInfo } from '@/features/pdp/ProductInfo';
import { RelatedProducts } from '@/features/pdp/RelatedProducts';
import { productJsonLd } from '@/lib/seo';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const product = findBySlug(slug);
  if (!product) return {};
  return {
    title: product.name[locale],
    description: product.description[locale],
    openGraph: {
      title: product.name[locale],
      description: product.description[locale],
      images: product.images[0] ? [{ url: product.images[0] }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const product = findBySlug(slug);
  if (!product) notFound();

  const related = findRelated(product, 6);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product, locale)) }}
      />

      <section className="border-b border-mist pt-6">
        <div className="container-shell">
          <PDPBreadcrumbs product={product} locale={locale} />
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container-shell grid gap-10 md:gap-16 lg:grid-cols-2">
          <ProductGallery product={product} locale={locale} />
          <ProductInfo product={product} />
        </div>
      </section>

      <section className="pb-20">
        <RelatedProducts products={related} locale={locale} />
      </section>
    </>
  );
}
