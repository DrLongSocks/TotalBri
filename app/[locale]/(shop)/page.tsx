import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isLocale } from '@/domain/i18n/config';
import { HeroCarousel } from '@/features/home/HeroCarousel';
import { CollectionRail } from '@/features/home/CollectionRail';
import { EditorialSplit } from '@/features/home/EditorialSplit';
import { MayoreoBand } from '@/features/home/MayoreoBand';
import { CategoryRail } from '@/features/catalog/CategoryRail';
import { FavoritesCarousel } from '@/features/home/FavoritesCarousel';
import { NewsletterBlock } from '@/features/home/NewsletterBlock';
import {
  findByCategory,
  findFeatured,
} from '@/domain/product/queries';
import { localBusinessJsonLd } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'home' });
  const base = locale === 'en' ? '/en' : '';

  const homeCleaning = findByCategory('limpieza-hogar', 10);
  const janitorial = findByCategory('jarceria', 10);
  const favorites = findFeatured(12);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
      />
      <HeroCarousel />
      <CollectionRail locale={locale} products={homeCleaning} category="limpieza-hogar" />
      <EditorialSplit
        eyebrow={t('editorial1Eyebrow')}
        headline={t('editorial1Headline')}
        body={t('editorial1Body')}
        ctaLabel={t('editorial1Cta')}
        ctaHref={`${base}/nosotros`}
        gradient="from-azure-deep to-ink"
      />
      <CollectionRail locale={locale} products={janitorial} category="jarceria" />
      <MayoreoBand locale={locale} />
      <section className="py-16 md:py-24">
        <CategoryRail locale={locale} />
      </section>
      <EditorialSplit
        eyebrow={t('editorial2Eyebrow')}
        headline={t('editorial2Headline')}
        body={t('editorial2Body')}
        ctaLabel={t('editorial2Cta')}
        ctaHref={`${base}/tienda`}
        reversed
        tone="paper"
        gradient="from-teal to-azure"
      />
      <FavoritesCarousel locale={locale} products={favorites} />
      <NewsletterBlock />
    </>
  );
}
