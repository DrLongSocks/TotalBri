export const LOCALES = ['es'] as const;
export const DEFAULT_LOCALE = 'es' as const;

export type Locale = (typeof LOCALES)[number];

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
