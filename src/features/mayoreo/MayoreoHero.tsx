import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { FadeIn } from '@/components/primitives/FadeIn';
import { buildWhatsAppUrl } from '@/domain/whatsapp/link';
import { env } from '@/lib/env';
import type { Locale } from '@/domain/i18n/config';
import { DottedSurface } from '@/components/ui/DottedSurface';
import { MayoreoHeroCTA } from './MayoreoHeroCTA';

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
      <DottedSurface />
      <div className="noise pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-azure/20 blur-[120px]" />

      <div className="container-shell relative z-10 flex flex-col items-center gap-8 pb-24 pt-32 md:flex-row md:items-center md:pb-32 md:pt-40">
        {/* Left: copy */}
        <FadeIn className="flex-1 max-w-2xl">
          <p className="eyebrow mb-4 text-paper/70">{t('heroEyebrow')}</p>
          <h1 className="display-xl text-paper">{t('heroHeadline')}</h1>
          <p className="mt-6 max-w-xl text-lg text-paper/80">{t('heroBody')}</p>
          <div className="mt-10">
            <MayoreoHeroCTA waUrl={waUrl} label={t('heroCta')} />
          </div>
        </FadeIn>

        {/* Right: logo — statement piece */}
        <div className="relative flex flex-shrink-0 items-center justify-center md:translate-x-12">
          <div className="absolute h-[500px] w-[500px] rounded-full bg-azure/30 blur-[100px]" />
          <Image
            src="/logo.png"
            alt="Total Bri"
            width={520}
            height={520}
            className="relative z-10 h-64 w-64 object-contain md:h-[440px] md:w-[440px] drop-shadow-2xl"
            priority
          />
        </div>
      </div>
    </section>
  );
}
