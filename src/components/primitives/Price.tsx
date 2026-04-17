import { formatPrice } from '@/domain/i18n/format';
import type { Locale } from '@/domain/i18n/config';
import { cn } from '@/lib/cn';

type Props = {
  amount: number;
  compareAt?: number;
  locale: Locale;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

const sizeClass: Record<NonNullable<Props['size']>, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-2xl',
};

export function Price({ amount, compareAt, locale, className, size = 'md' }: Props) {
  const isSale = compareAt !== undefined && compareAt > amount;
  return (
    <span className={cn('inline-flex items-baseline gap-2', sizeClass[size], className)}>
      <span className={cn('font-medium', isSale && 'text-sale')}>{formatPrice(amount, locale)}</span>
      {isSale ? (
        <span className="text-slate line-through text-[0.85em]">
          {formatPrice(compareAt, locale)}
        </span>
      ) : null}
    </span>
  );
}
