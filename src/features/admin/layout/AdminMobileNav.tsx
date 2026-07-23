'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import type { AdminLocale } from '@/domain/admin-i18n/locale';
import { AdminSideNav } from './AdminSideNav';

export function AdminMobileNav({ locale, isAdmin }: { locale: AdminLocale; isAdmin: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Menú"
          className="flex h-10 w-10 items-center justify-center rounded-full text-paper/80 hover:bg-paper/10 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-[320px]">
        <div className="px-6 py-5">
          <SheetTitle className="font-display text-xl font-extrabold uppercase">Menú</SheetTitle>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-6">
          <AdminSideNav locale={locale} isAdmin={isAdmin} onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
