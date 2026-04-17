import Link from 'next/link';
import type { Product } from '@/domain/product/schema';
import type { Locale } from '@/domain/i18n/config';
import { Price } from '@/components/primitives/Price';
import { Tag } from '@/components/primitives/Tag';
import { getSubcategoryName } from '@/domain/category/tree';
import { ProductImage } from './ProductImage';
import { cn } from '@/lib/cn';

type Props = {
  product: Product;
  locale: Locale;
  className?: string;
  railVariant?: boolean;
  priority?: boolean;
};

export function ProductCard({ product, locale, className, railVariant, priority }: Props) {
  const basePath = locale === 'en' ? '/en' : '';
  const subName = getSubcategoryName(product.subcategory)[locale];
  const [primary, fallback] = product.images;

  return (
    <Link
      href={`${basePath}/producto/${product.slug}`}
      className={cn(
        'group flex flex-col bg-paper transition',
        railVariant && 'w-[78vw] sm:w-[42vw] lg:w-[280px]',
        className,
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-porcelain">
        <ProductImage
          src={primary ?? ''}
          fallback={fallback ?? ''}
          alt={product.name[locale]}
          sizes="(min-width: 1024px) 280px, (min-width: 640px) 42vw, 78vw"
          priority={priority}
          className="p-4 transition duration-500 group-hover:scale-[1.03]"
        />
        {product.featured ? (
          <Tag className="absolute left-3 top-3" tone="ink">
            Favorito
          </Tag>
        ) : null}
        {!product.inStock ? (
          <Tag className="absolute right-3 top-3" tone="sale">
            Agotado
          </Tag>
        ) : null}
      </div>
      <div className="mt-3 flex flex-col gap-1 px-1">
        <span className="metadata-line">{subName}</span>
        <h3 className="line-clamp-2 text-[0.9375rem] font-medium leading-snug">
          {product.name[locale]}
        </h3>
        <div className="mt-1">
          <Price amount={product.price} compareAt={product.compareAtPrice} locale={locale} size="sm" />
        </div>
      </div>
    </Link>
  );
}
