import { getTranslations } from 'next-intl/server';
import { FadeIn } from '@/components/primitives/FadeIn';
import type { Locale } from '@/domain/i18n/config';

type Props = { locale: Locale };

const keys = ['restaurants', 'hotels', 'offices', 'schools', 'cleaners', 'stores'] as const;

export async function AudienceCards({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'mayoreo' });

  return (
    <section className="bg-porcelain py-16 md:py-24">
      <div className="container-shell">
        <h2 className="display-m mb-10">{t('audienceTitle')}</h2>
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {keys.map((k, idx) => (
            <FadeIn key={k} delay={idx * 0.05} as="li">
              <div className="flex h-40 flex-col justify-end rounded-2xl bg-paper p-6 shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-card-hover)]">
                <h3 className="text-lg font-medium">{t(`audience.${k}`)}</h3>
              </div>
            </FadeIn>
          ))}
        </ul>
      </div>
    </section>
  );
}
