import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ScrollRail } from '@/components/primitives/ScrollRail';
import { CATEGORY_TREE } from '@/domain/category/tree';
import type { Locale } from '@/domain/i18n/config';

type Props = {
  locale: Locale;
};

const emojis: Record<string, string> = {
  'limpieza-hogar': '🧴',
  lavanderia: '🧺',
  higiene: '🧼',
  jarceria: '🧹',
  automotriz: '🚗',
  aromatizantes: '🌿',
  varios: '🛠️',
};

export async function CategoryRail({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'home' });
  const basePath = locale === 'en' ? '/en' : '';

  return (
    <div className="flex flex-col">
      <div className="container-shell mb-8 flex items-end justify-between">
        <h2 className="display-l">{t('exploreCategories')}</h2>
      </div>
      <ScrollRail arrows={false}>
        {CATEGORY_TREE.map((cat) => (
          <Link
            key={cat.slug}
            href={`${basePath}/tienda/${cat.slug}`}
            className="flex w-[160px] flex-col items-center gap-3 text-center"
          >
            <div className="flex h-[160px] w-[160px] items-center justify-center rounded-full bg-porcelain text-5xl transition group-hover:bg-mist">
              <span aria-hidden>{emojis[cat.slug] ?? '✨'}</span>
            </div>
            <span className="text-sm font-medium">{cat.name[locale]}</span>
          </Link>
        ))}
      </ScrollRail>
    </div>
  );
}
