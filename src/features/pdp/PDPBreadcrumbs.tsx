import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { Locale } from '@/domain/i18n/config';
import { getTranslations } from 'next-intl/server';
import { CATEGORY_META } from '@/domain/category/metadata';
import type { Product } from '@/domain/product/schema';

type Props = { product: Product; locale: Locale };

export async function PDPBreadcrumbs({ product, locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'shop' });
  const base = '';
  const categoryMeta = CATEGORY_META[product.category];

  return (
    <nav aria-label="Ruta de navegación" className="flex items-center gap-1 text-xs text-slate">
      <Link href={base || '/'} className="hover:text-ink">
        {t('breadcrumbHome')}
      </Link>
      <ChevronRight className="h-3 w-3" />
      <Link href={`${base}/tienda`} className="hover:text-ink">
        {t('breadcrumbShop')}
      </Link>
      <ChevronRight className="h-3 w-3" />
      <Link href={`${base}/tienda/${product.category}`} className="hover:text-ink">
        {categoryMeta.name[locale]}
      </Link>
      <ChevronRight className="h-3 w-3" />
      <span className="truncate text-ink">{product.name[locale]}</span>
    </nav>
  );
}
