export type AdminLocale = 'es' | 'en';

// Admin's language is a saved preference, not a URL — independent of the
// storefront's next-intl routing. Resolution order: cookie from a past
// visit, then the device/browser language, then Spanish as the fallback.
export function resolveAdminLocale({
  cookieValue,
  acceptLanguageHeader,
}: {
  cookieValue?: string | null;
  acceptLanguageHeader?: string | null;
}): AdminLocale {
  if (cookieValue === 'es' || cookieValue === 'en') {
    return cookieValue;
  }

  const preferred = acceptLanguageHeader?.split(',')[0]?.trim().toLowerCase();
  if (preferred?.startsWith('en')) {
    return 'en';
  }

  return 'es';
}
