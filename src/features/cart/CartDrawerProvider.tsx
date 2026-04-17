'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { Product } from '@/domain/product/schema';
import { CartDrawer } from './CartDrawer';

type ClientCatalogContextValue = {
  products: Product[];
  productMap: Map<string, Product>;
};

type CartDrawerContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  openDrawer: () => void;
};

const CatalogContext = createContext<ClientCatalogContextValue | null>(null);
const CartDrawerContext = createContext<CartDrawerContextValue | null>(null);

type Props = {
  children: React.ReactNode;
  products: Product[];
};

export function CartDrawerProvider({ children, products }: Props) {
  const [open, setOpen] = useState(false);

  const openDrawer = useCallback(() => setOpen(true), []);
  const productMap = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);

  const catalog = useMemo(() => ({ products, productMap }), [products, productMap]);
  const drawer = useMemo(() => ({ open, setOpen, openDrawer }), [open, openDrawer]);

  return (
    <CatalogContext.Provider value={catalog}>
      <CartDrawerContext.Provider value={drawer}>
        {children}
        <CartDrawer open={open} onOpenChange={setOpen} productMap={productMap} />
      </CartDrawerContext.Provider>
    </CatalogContext.Provider>
  );
}

export function useCartDrawer() {
  const ctx = useContext(CartDrawerContext);
  if (!ctx) throw new Error('useCartDrawer must be used within CartDrawerProvider');
  return ctx;
}

export function useClientCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useClientCatalog must be used within CartDrawerProvider');
  return ctx;
}
