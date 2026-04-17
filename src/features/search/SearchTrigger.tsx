'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { SearchDialog } from './SearchDialog';

export function SearchTrigger() {
  const t = useTranslations('search');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t('open')}
        className="flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-mist"
      >
        <Search className="h-5 w-5" />
      </button>
      <SearchDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
