'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, ChevronDown, Home, ShoppingBag, ShoppingCart, Package } from 'lucide-react';
import { usePathname } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useCartDrawer } from '@/features/cart/CartDrawerProvider';
import { useCartStore } from '@/features/cart/store';
import { useHasMounted } from '@/features/cart/useHasMounted';
import { itemCount } from '@/domain/cart/totals';
import type { Locale } from '@/domain/i18n/config';
import { CATEGORY_TREE } from '@/domain/category/tree';
import { cn } from '@/lib/cn';

type Props = {
  locale: Locale;
};

export function MobileNav({ locale }: Props) {
  const [open, setOpen] = useState(false);
  const [openCat, setOpenCat] = useState<string | null>(null);
  const basePath = '';

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Menú"
          className="flex h-10 w-10 items-center justify-center rounded-full text-paper/80 hover:bg-paper/10"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-[320px]">
        <div className="px-6 py-5">
          <SheetTitle className="font-display text-xl font-extrabold uppercase">Menú</SheetTitle>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 pb-6">
          <ul className="flex flex-col">
            <li>
              <Link
                href={`${basePath}/`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-semibold hover:bg-porcelain"
              >
                <Home className="h-4 w-4 text-azure" />
                Inicio
              </Link>
            </li>
            <li>
              <Link
                href={`${basePath}/tienda`}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-4 py-3 text-base font-semibold hover:bg-porcelain"
              >
                Toda la tienda
              </Link>
            </li>
            <li>
              <Link
                href={`${basePath}/mayoreo`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-4 py-3 text-base font-semibold text-azure hover:bg-porcelain"
              >
                <ShoppingBag className="h-4 w-4" />
                Mayoreo
              </Link>
            </li>
            {CATEGORY_TREE.map((cat) => (
              <li key={cat.slug}>
                <button
                  type="button"
                  onClick={() => setOpenCat(openCat === cat.slug ? null : cat.slug)}
                  className="flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-sm hover:bg-porcelain"
                  aria-expanded={openCat === cat.slug}
                >
                  <span>{cat.name[locale]}</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 text-slate transition-transform',
                      openCat === cat.slug && 'rotate-180',
                    )}
                  />
                </button>
                {openCat === cat.slug ? (
                  <ul className="flex flex-col bg-porcelain">
                    <li>
                      <Link
                        href={`${basePath}/tienda/${cat.slug}`}
                        onClick={() => setOpen(false)}
                        className="block px-8 py-2.5 text-sm font-semibold text-azure"
                      >
                        Ver todos →
                      </Link>
                    </li>
                    {cat.subcategories.map((sub) => (
                      <li key={sub.slug}>
                        <Link
                          href={`${basePath}/tienda/${cat.slug}?sub=${sub.slug}`}
                          onClick={() => setOpen(false)}
                          className="block px-8 py-2 text-sm text-ink/75"
                        >
                          {sub.name[locale]}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const { openDrawer } = useCartDrawer();
  const lines = useCartStore((s) => s.lines);
  const mounted = useHasMounted();
  const count = itemCount({ lines });

  const isHome =
    pathname === '/' ||
    pathname.endsWith('/es') ||
    pathname.endsWith('/es/') ||
    (!pathname.includes('/tienda') &&
      !pathname.includes('/buscar') &&
      !pathname.includes('/producto'));

  const isCart = false;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 flex h-[60px] border-t border-ink/10 bg-card lg:hidden">
      <Link
        href="/"
        className={cn(
          'flex flex-1 flex-col items-center justify-center gap-1',
          isHome ? 'text-azure' : 'text-slate',
        )}
      >
        <Home className="h-5 w-5" />
        <span className="text-[10px] font-bold uppercase tracking-wide">Inicio</span>
      </Link>

      <Link
        href="/mayoreo"
        className={cn(
          'flex flex-1 flex-col items-center justify-center gap-1',
          pathname.includes('/mayoreo') ? 'text-azure' : 'text-slate',
        )}
      >
        <Package className="h-5 w-5" />
        <span className="text-[10px] font-bold uppercase tracking-wide">Mayoreo</span>
      </Link>

      <button
        type="button"
        onClick={openDrawer}
        className={cn(
          'relative flex flex-1 flex-col items-center justify-center gap-1',
          isCart ? 'text-azure' : 'text-slate',
        )}
      >
        <ShoppingCart className="h-5 w-5" />
        <span className="text-[10px] font-bold uppercase tracking-wide">Pedido</span>
        {mounted && count > 0 ? (
          <span className="absolute right-[30%] top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-azure px-1 text-[9px] font-extrabold text-paper">
            {count > 99 ? '99+' : count}
          </span>
        ) : null}
      </button>
    </nav>
  );
}
