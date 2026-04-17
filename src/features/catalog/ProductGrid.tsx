import type { Product } from '@/domain/product/schema';
import type { Locale } from '@/domain/i18n/config';
import { ProductCard } from './ProductCard';

type Props = {
  products: Product[];
  locale: Locale;
};

export function ProductGrid({ products, locale }: Props) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
      {products.map((p, idx) => (
        <li key={p.id}>
          <ProductCard product={p} locale={locale} priority={idx < 4} />
        </li>
      ))}
    </ul>
  );
}
