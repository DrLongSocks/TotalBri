import Link from 'next/link';
import type { Product } from '@/domain/product/schema';
import type { Locale } from '@/domain/i18n/config';
import { Price } from '@/components/primitives/Price';
import { ProductImage } from './ProductImage';
import { AddToCartRow } from './AddToCartRow';
import { cn } from '@/lib/cn';

type Props = {
  product: Product;
  locale: Locale;
  className?: string;
  railVariant?: boolean;
  priority?: boolean;
};

export function ProductCard({ product, locale, className, railVariant, priority }: Props) {
  const basePath = '';
  const [primary, fallback] = product.images;

  return (
    <div
      className={cn(
        'group flex flex-col rounded-2xl border border-ink/10 bg-card transition-[transform,box-shadow] duration-150 hover:-translate-y-[3px] hover:shadow-card-hover',
        railVariant && 'w-[78vw] sm:w-[42vw] lg:w-[280px]',
        className,
      )}
    >
      <Link
        href={`${basePath}/producto/${product.slug}`}
        className="block p-2.5 pb-0"
        tabIndex={0}
      >
        {/* Product image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-porcelain">
          <ProductImage
            src={primary ?? ''}
            fallback={fallback ?? ''}
            alt={product.name[locale]}
            sizes="(min-width: 1024px) 280px, (min-width: 640px) 42vw, 78vw"
            priority={priority}
            className="p-3 transition duration-500 group-hover:scale-[1.03]"
          />
          {/* Tags */}
          {product.featured && (
            <span className="absolute left-2.5 top-2.5 rounded-md bg-azure/20 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-azure">
              Más vendido
            </span>
          )}
          {!product.inStock && (
            <span className="absolute right-2.5 top-2.5 rounded-md bg-sale/90 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-paper">
              Agotado
            </span>
          )}
        </div>

        {/* Info */}
        <div className="mt-2.5 flex flex-col gap-1 px-0.5">
          <h3 className="font-display text-[15px] font-extrabold uppercase leading-tight tracking-wide text-ink line-clamp-2">
            {product.name[locale]}
          </h3>

          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-[10px] font-semibold text-slate">desde</span>
            <Price amount={product.price} compareAt={product.compareAtPrice} locale={locale} size="sm" />
          </div>
        </div>
      </Link>

      <div className="px-1 pb-1 pt-1">
        <AddToCartRow
          productId={product.id}
          unit={product.unit}
          inStock={product.inStock}
        />
      </div>
    </div>
  );
}
