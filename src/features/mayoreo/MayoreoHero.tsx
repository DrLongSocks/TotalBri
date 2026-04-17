import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/primitives/FadeIn';
import { buildWhatsAppUrl } from '@/domain/whatsapp/link';
import { env } from '@/lib/env';
import type { Locale } from '@/domain/i18n/config';

type Props = {
  locale: Locale;
};

export async function MayoreoHero({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'mayoreo' });
  const waUrl = buildWhatsAppUrl(
    env.NEXT_PUBLIC_WHATSAPP_PRIMARY,
    locale === 'es'
      ? '¡Hola Total Bri! Me interesa una cotización al mayoreo.'
      : 'Hi Total Bri! I would like a wholesale quote.',
  );

  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <div className="noise" />
      <div className="container-shell relative z-10 pb-24 pt-32 md:pb-32 md:pt-40">
        <FadeIn className="max-w-3xl">
          <p className="eyebrow mb-4 text-paper/70">{t('heroEyebrow')}</p>
          <h1 className="display-xl text-paper">{t('heroHeadline')}</h1>
          <p className="mt-6 max-w-xl text-lg text-paper/80">{t('heroBody')}</p>
          <div className="mt-10">
            <Button asChild variant="whatsapp" size="lg">
              <a href={waUrl} target="_blank" rel="noopener noreferrer">
                {t('heroCta')}
              </a>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
