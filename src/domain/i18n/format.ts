import type { Locale } from './config';

const currencyFormatters: Record<Locale, Intl.NumberFormat> = {
  es: new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }),
  en: new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }),
};

export function formatPrice(amount: number, locale: Locale = 'es'): string {
  return currencyFormatters[locale].format(amount);
}

export function formatList(items: string[], locale: Locale = 'es'): string {
  const fmt = new Intl.ListFormat(locale === 'es' ? 'es-MX' : 'en-US', {
    style: 'long',
    type: 'conjunction',
  });
  return fmt.format(items);
}
