'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/primitives/FadeIn';

export function NewsletterBlock() {
  const t = useTranslations('home');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  return (
    <section className="py-16 md:py-24">
      <div className="container-shell">
        <FadeIn className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <h2 className="display-m">{t('newsletterHeadline')}</h2>
          <p className="mt-3 max-w-md text-sm text-slate">{t('newsletterBody')}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!email) return;
              // Newsletter backend is not wired in pass one — see README.
              setStatus('success');
              setEmail('');
            }}
            className="mt-6 flex w-full max-w-md flex-col gap-2 sm:flex-row"
          >
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('newsletterPlaceholder')}
              className="flex-1"
              aria-label="Email"
            />
            <Button type="submit" variant="primary" size="md">
              {t('newsletterCta')}
            </Button>
          </form>
          {status === 'success' ? (
            <p aria-live="polite" className="mt-3 text-sm text-azure">
              {t('newsletterSuccess')}
            </p>
          ) : null}
        </FadeIn>
      </div>
    </section>
  );
}
