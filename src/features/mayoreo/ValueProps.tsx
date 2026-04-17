import { getTranslations } from 'next-intl/server';
import { FadeIn } from '@/components/primitives/FadeIn';
import type { Locale } from '@/domain/i18n/config';

type Props = { locale: Locale };

const keys = ['volume', 'delivery', 'quote', 'line', 'invoice'] as const;

export async function ValueProps({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'mayoreo' });

  return (
    <section className="py-16 md:py-24">
      <div className="container-shell">
        <h2 className="display-m mb-10">{t('valueTitle')}</h2>
        <ul className="grid gap-10 md:grid-cols-3">
          {keys.map((k, idx) => (
            <FadeIn key={k} delay={idx * 0.06} as="li">
              <h3 className="display-m text-2xl">{t(`value.${k}`)}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate">{t(`value.${k}Body`)}</p>
            </FadeIn>
          ))}
        </ul>
      </div>
    </section>
  );
}
