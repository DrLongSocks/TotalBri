'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FlaskConical, LayoutDashboard, Users } from 'lucide-react';
import type { AdminLocale } from '@/domain/admin-i18n/locale';
import { getAdminMessages } from '@/domain/admin-i18n/messages';
import { cn } from '@/lib/cn';

function NavItem({
  active,
  href,
  onClick,
  children,
}: {
  active: boolean;
  href: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 font-display text-[15px] font-bold uppercase tracking-wide transition-colors',
        active ? 'bg-azure/10 text-azure' : 'text-ink hover:bg-ink/5',
      )}
    >
      {children}
    </Link>
  );
}

export function AdminSideNav({
  locale,
  isAdmin,
  onNavigate,
}: {
  locale: AdminLocale;
  isAdmin: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const messages = getAdminMessages(locale).nav;

  const items = [
    { href: '/admin/dashboard', label: messages.dashboard, icon: LayoutDashboard, adminOnly: true },
    { href: '/admin/materials', label: messages.materials, icon: FlaskConical, adminOnly: true },
    { href: '/admin/workers', label: messages.workers, icon: Users, adminOnly: true },
  ].filter((item) => isAdmin || !item.adminOnly);

  return (
    <nav className="flex flex-col gap-0.5 rounded-2xl border border-ink/10 bg-card p-3.5 shadow-[var(--shadow-card)]">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavItem key={item.href} active={pathname === item.href} href={item.href} onClick={onNavigate}>
            <Icon className="h-4 w-4" />
            {item.label}
          </NavItem>
        );
      })}
    </nav>
  );
}
