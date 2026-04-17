import type { Product } from '@/domain/product/schema';
import type { Locale } from '@/domain/i18n/config';
import { ScrollRail } from '@/components/primitives/ScrollRail';
import { ProductCard } from './ProductCard';

type Props = {
  products: Product[];
  locale: Locale;
  ariaLabel?: string;
};

export function ProductCarousel({ products, locale, ariaLabel }: Props) {
  return (
    <ScrollRail ariaLabel={ariaLabel}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} locale={locale} railVariant />
      ))}
    </ScrollRail>
  );
}
