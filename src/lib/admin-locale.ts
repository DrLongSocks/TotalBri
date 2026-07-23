'use server';

import { cookies, headers } from 'next/headers';
import { resolveAdminLocale, type AdminLocale } from '@/domain/admin-i18n/locale';

const ADMIN_LOCALE_COOKIE = 'admin_locale';

export async function getAdminLocale(): Promise<AdminLocale> {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  return resolveAdminLocale({
    cookieValue: cookieStore.get(ADMIN_LOCALE_COOKIE)?.value,
    acceptLanguageHeader: headerStore.get('accept-language'),
  });
}

export async function setAdminLocaleAction(locale: AdminLocale) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_LOCALE_COOKIE, locale, {
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
    sameSite: 'lax',
  });
}
