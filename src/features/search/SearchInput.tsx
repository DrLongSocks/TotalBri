'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { Locale } from '@/domain/i18n/config';

export function SearchInput({ defaultValue = '' }: { defaultValue?: string }) {
  const t = useTranslations('search');
  const [q, setQ] = useState(defaultValue);
  const router = useRouter();
  const locale = useLocale() as Locale;
  const basePath = locale === 'en' ? '/en' : '';

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`${basePath}/buscar?q=${encodeURIComponent(q.trim())}`);
      }}
      className="relative flex w-full max-w-xl items-center gap-2"
    >
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" aria-hidden />
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t('placeholder')}
        className="pl-10"
      />
    </form>
  );
}
