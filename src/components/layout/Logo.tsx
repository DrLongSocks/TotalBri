import Link from 'next/link';
import type { Locale } from '@/domain/i18n/config';
import { cn } from '@/lib/cn';

type Props = {
  locale: Locale;
  tone?: 'ink' | 'paper';
  className?: string;
};

export function Logo({ locale, tone = 'ink', className }: Props) {
  const href = locale === 'en' ? '/en' : '/';
  return (
    <Link
      href={href}
      aria-label="Total Bri"
      className={cn('flex items-center gap-2 font-display text-xl font-semibold', className)}
    >
      <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full">
        <svg viewBox="0 0 40 40" className="h-full w-full" aria-hidden>
          <defs>
            <linearGradient id="logogrd" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#14B8A6" />
              <stop offset="100%" stopColor="#0B6BCB" />
            </linearGradient>
          </defs>
          <circle cx="20" cy="20" r="19" fill="url(#logogrd)" />
          <path
            d="M20 10 C24 16, 28 20, 20 30 C12 20, 16 16, 20 10 Z"
            fill="white"
            opacity="0.95"
          />
        </svg>
      </span>
      <span className={cn(tone === 'paper' ? 'text-paper' : 'text-ink', 'leading-none')}>
        Total <span className="italic">Bri</span>
      </span>
    </Link>
  );
}
