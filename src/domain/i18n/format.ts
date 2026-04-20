import type { Locale } from './config';

const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 2,
});

export function formatPrice(amount: number, _locale: Locale = 'es'): string {
  return currencyFormatter.format(amount);
}

export function formatList(items: string[], _locale: Locale = 'es'): string {
  const fmt = new Intl.ListFormat('es-MX', {
    style: 'long',
    type: 'conjunction',
  });
  return fmt.format(items);
}
