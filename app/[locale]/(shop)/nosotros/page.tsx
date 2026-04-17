import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isLocale } from '@/domain/i18n/config';
import { EditorialSplit } from '@/features/home/EditorialSplit';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: 'about' });
  return { title: t('title'), description: t('body1') };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'about' });

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-paper">
        <div className="absolute inset-0 bg-gradient-to-br from-azure-deep to-ink" aria-hidden />
        <div className="noise" />
        <div className="container-shell relative z-10 pb-20 pt-32 md:pt-40">
          <p className="eyebrow mb-4 text-paper/70">{t('eyebrow1')}</p>
          <h1 className="display-xl max-w-3xl text-paper">{t('headline1')}</h1>
          <p className="mt-6 max-w-xl text-lg text-paper/80">{t('body1')}</p>
        </div>
      </section>

      <EditorialSplit
        eyebrow={t('eyebrow2')}
        headline={t('headline2')}
        body={t('body2')}
        gradient="from-teal to-teal-soft"
      />

      <EditorialSplit
        eyebrow={t('eyebrow3')}
        headline={t('headline3')}
        body={t('body3')}
        reversed
        tone="paper"
        gradient="from-ink to-azure-deep"
      />
    </>
  );
}
