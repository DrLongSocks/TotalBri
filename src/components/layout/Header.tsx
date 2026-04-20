import Link from 'next/link';
import { env } from '@/lib/env';
import { Logo } from './Logo';
import { MobileNav } from './MobileNav';
import { CartTrigger } from '@/features/cart/CartTrigger';
import { SearchTrigger } from '@/features/search/SearchTrigger';
import type { Locale } from '@/domain/i18n/config';

type Props = {
  locale: Locale;
};

function WAIcon() {
  return (
    <svg viewBox="0 0 32 32" width={16} height={16} fill="currentColor" aria-hidden>
      <path d="M16 3C9 3 3 9 3 16c0 2.5.7 4.8 1.9 6.8L3 29l6.4-1.8c1.9 1 4.2 1.6 6.6 1.6 7 0 13-6 13-13S23 3 16 3z" />
    </svg>
  );
}

export async function Header({ locale }: Props) {
  const waNumber = env.NEXT_PUBLIC_WHATSAPP_PRIMARY ?? '3546880969';
  const waUrl = `https://wa.me/${waNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Hola, necesito ayuda.')}`;

  return (
    <header className="sticky top-0 z-30 w-full">
      {/* Nav bar */}
      <div className="bg-ink text-paper">
        <div className="container-shell flex h-[80px] items-center gap-4">
          {/* Mobile hamburger (kept for category browsing on small screens) */}
          <div className="md:hidden">
            <MobileNav locale={locale} />
          </div>

          {/* Logo */}
          <Logo locale={locale} tone="paper" />

          <div className="flex-1" />

          {/* Search (desktop) */}
          <div className="hidden md:block">
            <SearchTrigger />
          </div>

          {/* Mayoreo link */}
          <Link
            href="/mayoreo"
            className="hidden items-center gap-1.5 rounded-lg border border-azure/40 px-3 py-1.5 text-[13px] font-bold uppercase tracking-wide text-azure transition hover:bg-azure hover:text-paper md:flex"
          >
            Mayoreo
          </Link>

          {/* WhatsApp help (desktop) */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 text-[13px] font-semibold text-paper/85 hover:text-paper md:flex"
          >
            <WAIcon /> Ayuda
          </a>

          {/* Divider */}
          <div className="hidden h-[22px] w-px bg-paper/15 md:block" />

          {/* Cart — button variant on desktop, icon on mobile */}
          <div className="hidden md:block">
            <CartTrigger variant="header-button" />
          </div>
          <div className="md:hidden">
            <CartTrigger variant="icon" />
          </div>
        </div>
      </div>

      {/* Decorative wave */}
      <div className="overflow-hidden">
        <svg
          viewBox="0 0 1440 28"
          preserveAspectRatio="none"
          className="block h-7 w-full"
          aria-hidden
        >
          <path
            d="M0,0 L1440,0 L1440,16 Q960,34 720,14 Q480,-4 0,18 Z"
            fill="#122C4C"
          />
          <path
            d="M0,18 Q480,-4 720,14 Q960,34 1440,16 L1440,28 L0,28 Z"
            fill="#0FB3AC"
          />
        </svg>
      </div>
    </header>
  );
}
