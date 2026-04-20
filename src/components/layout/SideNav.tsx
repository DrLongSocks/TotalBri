'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CATEGORY_TREE } from '@/domain/category/tree';
import type { Locale } from '@/domain/i18n/config';
import { cn } from '@/lib/cn';

type Props = {
  locale: Locale;
};

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 11 L12 4 L21 11 L21 20 L14 20 L14 14 L10 14 L10 20 L3 20 Z" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.27 6.96 8.73 5.05 8.73-5.05M12 22.08V12" />
    </svg>
  );
}

function NavItem({
  active,
  href,
  children,
}: {
  active: boolean;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-left font-display text-[15px] font-bold uppercase tracking-wide transition-colors',
        active
          ? 'bg-azure/10 text-azure'
          : 'text-ink hover:bg-ink/5',
      )}
    >
      {children}
    </Link>
  );
}

export function SideNav({ locale }: Props) {
  const pathname = usePathname();

  const isHome =
    pathname === '/' ||
    pathname === `/${locale}` ||
    pathname === `/${locale}/` ||
    (pathname.endsWith('/es') && !pathname.includes('/tienda') && !pathname.includes('/mayoreo'));

  const isMayoreo = pathname.includes('/mayoreo');

  const activeCat = CATEGORY_TREE.find((c) =>
    pathname.includes(`/tienda/${c.slug}`),
  )?.slug;

  return (
    <nav className="rounded-2xl border border-ink/10 bg-card p-3.5">
      <div className="eyebrow mb-2.5 px-3 pt-1 text-slate">Categorías</div>

      <ul className="flex flex-col gap-0.5">
        <li>
          <NavItem active={isHome} href="/">
            <HomeIcon />
            Inicio
          </NavItem>
        </li>
        <li>
          <NavItem active={pathname.includes('/tienda') && !CATEGORY_TREE.some((c) => pathname.includes(`/tienda/${c.slug}`))} href="/tienda">
            <GridIcon />
            Todos los productos
          </NavItem>
        </li>
        <li>
          <NavItem active={isMayoreo} href="/mayoreo">
            <BoxIcon />
            Mayoreo
          </NavItem>
        </li>
        <li className="my-1.5 border-t border-ink/6" />
        {CATEGORY_TREE.map((c) => (
          <li key={c.slug}>
            <NavItem active={activeCat === c.slug} href={`/tienda/${c.slug}`}>
              <span className="inline-block h-2 w-2 flex-shrink-0 rounded-full bg-current opacity-60" />
              {c.name[locale]}
            </NavItem>
          </li>
        ))}
      </ul>

      {/* Delivery info card */}
      <div className="relative mt-3.5 overflow-hidden rounded-xl bg-ink p-3 text-paper">
        <div className="pointer-events-none absolute -right-5 -top-5 h-16 w-16 rounded-full bg-azure opacity-40" />
        <div className="eyebrow mb-0.5 text-paper/70">Entrega</div>
        <div className="relative font-display text-[17px] font-extrabold uppercase leading-tight">
          Mismo día en Los Reyes
        </div>
        <div className="mt-1 text-[11px] leading-relaxed text-paper/75">
          Pedidos antes de 4 pm · también puedes pasar a recoger.
        </div>
      </div>
    </nav>
  );
}
