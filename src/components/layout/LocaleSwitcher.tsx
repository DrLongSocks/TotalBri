'use client';

import { useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Globe } from 'lucide-react';
import type { Locale } from '@/domain/i18n/config';
import { cn } from '@/lib/cn';

export function LocaleSwitcher({ className }: { className?: string }) {
  const t = useTranslations('nav');
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const next: Locale = locale === 'es' ? 'en' : 'es';

  const switchLocale = () => {
    const segments = (pathname || '/').split('/').filter(Boolean);
    if (segments[0] === 'es' || segments[0] === 'en') {
      segments.shift();
    }
    const rest = segments.join('/');
    const target = next === 'es' ? `/${rest}` : `/en/${rest}`;
    const clean = target.replace(/\/\/+/, '/').replace(/\/$/, '') || '/';
    startTransition(() => router.push(clean));
  };

  return (
    <button
      type="button"
      onClick={switchLocale}
      disabled={pending}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-ink hover:bg-mist',
        className,
      )}
      aria-label={next === 'es' ? t('spanish') : t('english')}
    >
      <Globe className="h-3.5 w-3.5" />
      <span>{next.toUpperCase()}</span>
    </button>
  );
}
