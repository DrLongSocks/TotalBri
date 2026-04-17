'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CATEGORY_TREE } from '@/domain/category/tree';
import { buildBulkInquiryMessage } from '@/domain/whatsapp/templates';
import { buildWhatsAppUrl } from '@/domain/whatsapp/link';
import { env } from '@/lib/env';
import type { Locale } from '@/domain/i18n/config';

const schema = z.object({
  name: z.string().min(2),
  businessName: z.string().min(2),
  volume: z.string().min(1),
  categories: z.array(z.string()),
  notes: z.string().optional(),
});

export function BulkInquiryForm() {
  const t = useTranslations('mayoreo');
  const locale = useLocale() as Locale;

  const [form, setForm] = useState({
    name: '',
    businessName: '',
    volume: '',
    categories: [] as string[],
    notes: '',
  });
  const [error, setError] = useState<string | null>(null);

  const toggleCategory = (slug: string) => {
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(slug)
        ? f.categories.filter((c) => c !== slug)
        : [...f.categories, slug],
    }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError(locale === 'es' ? 'Por favor completa los campos obligatorios.' : 'Please complete the required fields.');
      return;
    }
    setError(null);
    const catNames = parsed.data.categories
      .map((slug) => CATEGORY_TREE.find((c) => c.slug === slug)?.name[locale] ?? slug);
    const msg = buildBulkInquiryMessage(
      { ...parsed.data, categories: catNames },
      locale,
    );
    window.open(buildWhatsAppUrl(env.NEXT_PUBLIC_WHATSAPP_PRIMARY, msg), '_blank', 'noopener');
  };

  return (
    <section className="bg-porcelain py-16 md:py-24">
      <div className="container-shell">
        <h2 className="display-m mb-10">{t('formTitle')}</h2>
        <form
          onSubmit={submit}
          noValidate
          className="mx-auto flex max-w-2xl flex-col gap-5 rounded-2xl bg-paper p-6 shadow-[var(--shadow-card)] md:p-10"
        >
          <label className="flex flex-col gap-2">
            <span className="eyebrow text-slate">{t('formName')}</span>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              autoComplete="name"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="eyebrow text-slate">{t('formBusiness')}</span>
            <Input
              value={form.businessName}
              onChange={(e) => setForm({ ...form, businessName: e.target.value })}
              required
              autoComplete="organization"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="eyebrow text-slate">{t('formVolume')}</span>
            <Input
              value={form.volume}
              onChange={(e) => setForm({ ...form, volume: e.target.value })}
              placeholder={t('formVolumePlaceholder')}
              required
            />
          </label>

          <fieldset className="flex flex-col gap-2">
            <legend className="eyebrow text-slate">{t('formCategories')}</legend>
            <ul className="flex flex-wrap gap-2 pt-1">
              {CATEGORY_TREE.map((c) => (
                <li key={c.slug}>
                  <button
                    type="button"
                    onClick={() => toggleCategory(c.slug)}
                    className={`rounded-full border px-3 py-1.5 text-sm transition ${
                      form.categories.includes(c.slug)
                        ? 'border-ink bg-ink text-paper'
                        : 'border-mist bg-paper text-ink hover:bg-mist'
                    }`}
                  >
                    {c.name[locale]}
                  </button>
                </li>
              ))}
            </ul>
          </fieldset>

          <label className="flex flex-col gap-2">
            <span className="eyebrow text-slate">{t('formNotes')}</span>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={4}
              className="min-h-[120px] w-full rounded-2xl border border-mist bg-paper px-4 py-3 text-sm placeholder:text-slate focus:border-azure focus:outline-none focus-visible:outline-2 focus-visible:outline-azure"
            />
          </label>

          {error ? (
            <p aria-live="polite" className="text-sm text-sale">
              {error}
            </p>
          ) : null}

          <Button type="submit" variant="whatsapp" size="lg">
            {t('formSubmit')}
          </Button>
        </form>
      </div>
    </section>
  );
}
