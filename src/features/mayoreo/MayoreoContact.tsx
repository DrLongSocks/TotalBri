import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { buildWhatsAppUrl } from '@/domain/whatsapp/link';
import { env } from '@/lib/env';
import type { Locale } from '@/domain/i18n/config';

type Props = { locale: Locale };

export async function MayoreoContact({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'mayoreo' });
  const greeting = locale === 'es' ? '¡Hola Total Bri!' : 'Hi Total Bri!';
  const primary = buildWhatsAppUrl(env.NEXT_PUBLIC_WHATSAPP_PRIMARY, greeting);
  const secondary = env.NEXT_PUBLIC_WHATSAPP_SECONDARY
    ? buildWhatsAppUrl(env.NEXT_PUBLIC_WHATSAPP_SECONDARY, greeting)
    : null;

  return (
    <section className="bg-ink py-20 text-paper md:py-28">
      <div className="container-shell flex flex-col items-start gap-6 md:items-center md:text-center">
        <h2 className="display-l text-paper md:max-w-2xl">{t('contactHeadline')}</h2>
        <p className="max-w-md text-paper/75">{t('contactBody')}</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild variant="whatsapp" size="lg">
            <a href={primary} target="_blank" rel="noopener noreferrer">
              +52 354 688 0969
            </a>
          </Button>
          {secondary ? (
            <Button asChild variant="ghost" size="lg" className="text-paper hover:bg-paper/10">
              <a href={secondary} target="_blank" rel="noopener noreferrer">
                +52 354 134 9764
              </a>
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
