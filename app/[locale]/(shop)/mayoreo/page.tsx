import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isLocale } from '@/domain/i18n/config';
import { MayoreoHero } from '@/features/mayoreo/MayoreoHero';
import { AudienceCards } from '@/features/mayoreo/AudienceCards';
import { ValueProps } from '@/features/mayoreo/ValueProps';
import { BulkInquiryForm } from '@/features/mayoreo/BulkInquiryForm';
import { MayoreoContact } from '@/features/mayoreo/MayoreoContact';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: 'mayoreo' });
  return { title: t('title'), description: t('heroBody') };
}

export default async function MayoreoPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  return (
    <>
      <MayoreoHero locale={locale} />
      <AudienceCards locale={locale} />
      <ValueProps locale={locale} />
      <BulkInquiryForm />
      <MayoreoContact locale={locale} />
    </>
  );
}
