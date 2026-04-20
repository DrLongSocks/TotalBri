import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/domain/i18n/config';
import { cn } from '@/lib/cn';

type Props = {
  locale: Locale;
  tone?: 'ink' | 'paper';
  className?: string;
};

export function Logo({ locale: _locale, tone = 'ink', className }: Props) {
  const href = '/';
  return (
    <Link
      href={href}
      aria-label="Total Bri"
      className={cn('flex items-center gap-2.5', className)}
    >
      <Image
        src="/logo.png"
        alt="Total Bri"
        width={56}
        height={56}
        className="h-14 w-14 object-contain"
        priority
      />
      <div className="text-left leading-none">
        <div
          className={cn(
            'font-display text-[28px] font-extrabold uppercase tracking-wide leading-none',
            tone === 'paper' ? 'text-paper' : 'text-ink',
          )}
        >
          Total Bri
        </div>
        <div
          className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] leading-[1.5]"
          style={{
            background:
              tone === 'paper'
                ? 'linear-gradient(90deg, #a0b4c8 0%, #ffffff 40%, #cce8f0 60%, #a0b4c8 100%)'
                : 'linear-gradient(90deg, #4a6a8a 0%, #0fb3ac 40%, #7ec8d0 60%, #4a6a8a 100%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'metallic-sweep 3.5s linear infinite',
            width: '100%',
            textAlign: 'justify',
            textAlignLast: 'justify',
          }}
        >
          Brillo en tu empresa.<br />Brillo en tu hogar.
        </div>
      </div>
    </Link>
  );
}
