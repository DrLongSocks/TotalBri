import { describe, expect, it } from 'vitest';
import { resolveAdminLocale } from './locale';

describe('resolveAdminLocale', () => {
  it('uses the cookie when present, even if it disagrees with the browser language', () => {
    expect(resolveAdminLocale({ cookieValue: 'en', acceptLanguageHeader: 'es-MX,es;q=0.9' })).toBe('en');
    expect(resolveAdminLocale({ cookieValue: 'es', acceptLanguageHeader: 'en-US,en;q=0.9' })).toBe('es');
  });

  it('falls back to the Accept-Language header when there is no cookie', () => {
    expect(resolveAdminLocale({ cookieValue: null, acceptLanguageHeader: 'en-US,en;q=0.9' })).toBe('en');
    expect(resolveAdminLocale({ cookieValue: undefined, acceptLanguageHeader: 'en;q=0.8' })).toBe('en');
  });

  it('falls back to Spanish when the header is not English', () => {
    expect(resolveAdminLocale({ cookieValue: null, acceptLanguageHeader: 'es-MX,es;q=0.9' })).toBe('es');
    expect(resolveAdminLocale({ cookieValue: null, acceptLanguageHeader: 'fr-FR,fr;q=0.9' })).toBe('es');
  });

  it('falls back to Spanish when there is neither a cookie nor a header', () => {
    expect(resolveAdminLocale({ cookieValue: null, acceptLanguageHeader: null })).toBe('es');
    expect(resolveAdminLocale({})).toBe('es');
  });

  it('ignores an invalid cookie value and falls through to the header', () => {
    expect(resolveAdminLocale({ cookieValue: 'fr', acceptLanguageHeader: 'en-US,en;q=0.9' })).toBe('en');
  });
});
