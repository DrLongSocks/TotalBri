import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Logo } from './Logo';
import type { Locale } from '@/domain/i18n/config';
import { env } from '@/lib/env';
import { CATEGORY_TREE } from '@/domain/category/tree';
import { buildWhatsAppUrl } from '@/domain/whatsapp/link';

type Props = {
  locale: Locale;
};

export async function Footer({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'footer' });
  const tn = await getTranslations({ locale, namespace: 'nav' });
  const basePath = locale === 'en' ? '/en' : '';
  const primaryWa = buildWhatsAppUrl(
    env.NEXT_PUBLIC_WHATSAPP_PRIMARY,
    locale === 'es' ? '¡Hola Total Bri!' : 'Hi Total Bri!',
  );
  const secondary = env.NEXT_PUBLIC_WHATSAPP_SECONDARY
    ? buildWhatsAppUrl(env.NEXT_PUBLIC_WHATSAPP_SECONDARY, locale === 'es' ? '¡Hola Total Bri!' : 'Hi Total Bri!')
    : null;

  return (
    <footer className="bg-ink text-paper">
      <div className="container-shell py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Logo locale={locale} tone="paper" />
            <p className="mt-4 max-w-xs text-sm text-paper/70">{t('tagline')}</p>
          </div>

          <div>
            <h3 className="eyebrow mb-4 text-paper/60">{t('shop')}</h3>
            <ul className="flex flex-col gap-2 text-sm text-paper/85">
              {CATEGORY_TREE.slice(0, 5).map((cat) => (
                <li key={cat.slug}>
                  <Link href={`${basePath}/tienda/${cat.slug}`} className="hover:text-paper">
                    {cat.name[locale]}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={`${basePath}/tienda`} className="font-medium hover:text-paper">
                  {tn('viewAll')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="eyebrow mb-4 text-paper/60">{t('company')}</h3>
            <ul className="flex flex-col gap-2 text-sm text-paper/85">
              <li>
                <Link href={`${basePath}/nosotros`} className="hover:text-paper">
                  {tn('about')}
                </Link>
              </li>
              <li>
                <Link href={`${basePath}/mayoreo`} className="hover:text-paper">
                  {tn('wholesale')}
                </Link>
              </li>
              <li>
                <Link href={`${basePath}/tienda?sort=price-asc`} className="hover:text-paper">
                  {tn('offers')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="eyebrow mb-4 text-paper/60">{t('support')}</h3>
            <ul className="flex flex-col gap-2 text-sm text-paper/85">
              <li>
                <a
                  href={primaryWa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-paper"
                >
                  {t('whatsappPrimary')} · +52 354 688 0969
                </a>
              </li>
              {secondary ? (
                <li>
                  <a
                    href={secondary}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-paper"
                  >
                    {t('whatsappSecondary')} · +52 354 134 9764
                  </a>
                </li>
              ) : null}
              <li className="pt-2 text-paper/60 leading-relaxed">
                {t('address')}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-paper/10 pt-6 text-xs text-paper/50 md:flex-row md:items-center md:justify-between">
          <div>
            © {new Date().getFullYear()} {t('legal')} · {t('rfc')} · {t('rights')}
          </div>
        </div>
      </div>
    </footer>
  );
}
