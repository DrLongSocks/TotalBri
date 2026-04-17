'use client';

import { useState } from 'react';
import type { Product } from '@/domain/product/schema';
import type { Locale } from '@/domain/i18n/config';
import { ProductImage } from '@/features/catalog/ProductImage';
import { cn } from '@/lib/cn';

type Props = {
  product: Product;
  locale: Locale;
};

export function ProductGallery({ product, locale }: Props) {
  const images = product.images;
  const [active, setActive] = useState(0);
  const hasMany = images.length > 2;
  const primary = images[active] ?? images[0] ?? '';
  const fallback = images[images.length - 1] ?? '';

  return (
    <div className="lg:sticky lg:top-28">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-porcelain">
        <ProductImage
          src={primary}
          fallback={fallback}
          alt={product.name[locale]}
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority
          className="p-8"
        />
      </div>
      {hasMany ? (
        <div className="mt-4 flex gap-2">
          {images.slice(0, 4).map((img, i) => (
            <button
              key={`${img}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Image ${i + 1}`}
              className={cn(
                'relative h-20 w-20 overflow-hidden rounded-lg border bg-porcelain',
                i === active ? 'border-ink' : 'border-mist',
              )}
            >
              <ProductImage
                src={img}
                fallback={fallback}
                alt=""
                sizes="80px"
                className="p-2"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
