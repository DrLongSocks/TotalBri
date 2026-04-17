'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/cn';

type Props = {
  src: string;
  fallback: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
};

export function ProductImage({
  src,
  fallback,
  alt,
  className,
  sizes,
  priority,
  fill = true,
  width,
  height,
}: Props) {
  const [current, setCurrent] = useState(src);
  const handleError = () => {
    if (current !== fallback) setCurrent(fallback);
  };

  if (fill) {
    return (
      <Image
        src={current}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        onError={handleError}
        className={cn('object-contain', className)}
        unoptimized={current === fallback}
      />
    );
  }
  return (
    <Image
      src={current}
      alt={alt}
      width={width ?? 800}
      height={height ?? 800}
      sizes={sizes}
      priority={priority}
      onError={handleError}
      className={cn('object-contain', className)}
      unoptimized={current === fallback}
    />
  );
}
