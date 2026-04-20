import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { env } from '@/lib/env';
import { buildWhatsAppUrl } from '@/domain/whatsapp/link';
import { FadeIn } from '@/components/primitives/FadeIn';
import type { Locale } from '@/domain/i18n/config';

type Props = {
  locale: Locale;
};

export async function MayoreoBand({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'home' });
  const basePath = '';
  const waUrl = buildWhatsAppUrl(
    env.NEXT_PUBLIC_WHATSAPP_PRIMARY,
    locale === 'es'
      ? '¡Hola Total Bri! Me interesa una cotización al mayoreo.'
      : 'Hi Total Bri! I would like a wholesale quote.',
  );

  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <div className="noise" />
      <div className="container-shell relative z-10 py-20 md:py-32">
        <FadeIn className="max-w-3xl">
          <p className="eyebrow mb-4 text-paper/70">{t('mayoreoEyebrow')}</p>
          <h2 className="display-l text-paper">{t('mayoreoHeadline')}</h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-paper/80 md:text-lg">
            {t('mayoreoBody')}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="whatsapp" size="lg">
              <a href={waUrl} target="_blank" rel="noopener noreferrer">
                {t('mayoreoCta')}
              </a>
            </Button>
            <Button asChild variant="ghost" size="lg" className="text-paper hover:bg-paper/10">
              <Link href={`${basePath}/mayoreo`}>→</Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
