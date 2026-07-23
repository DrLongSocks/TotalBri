import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getAdminMessages } from '@/domain/admin-i18n/messages';
import { AdminMobileNav } from '@/features/admin/layout/AdminMobileNav';
import { AdminSideNav } from '@/features/admin/layout/AdminSideNav';
import { getAdminLocale, setAdminLocaleAction } from '@/lib/admin-locale';
import { auth, signOut } from '@/lib/auth/auth';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const [session, locale] = await Promise.all([auth(), getAdminLocale()]);
  const messages = getAdminMessages(locale);
  const isAuthed = Boolean(session?.user);
  const isAdmin = session?.user.role === 'admin';

  async function handleSignOut() {
    'use server';
    await signOut({ redirectTo: '/login' });
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <header className="sticky top-0 z-30 w-full">
        <div className="bg-ink text-paper">
          <div className="container-shell flex h-16 items-center gap-3 md:h-20 md:gap-4">
            {isAuthed && <AdminMobileNav locale={locale} isAdmin={isAdmin} />}
            <span className="font-display text-base font-extrabold uppercase tracking-wide md:text-lg">
              Total Bri Admin
            </span>

            <div className="flex-1" />

            {isAuthed && (
              <form action={handleSignOut}>
                <button
                  type="submit"
                  className="text-[13px] font-semibold text-paper/80 transition hover:text-paper"
                >
                  {messages.nav.logout}
                </button>
              </form>
            )}

            <div className="hidden h-[22px] w-px bg-paper/15 sm:block" />

            <div className="flex items-center gap-1 text-xs">
              <form action={setAdminLocaleAction.bind(null, 'es')}>
                <button
                  type="submit"
                  className={
                    locale === 'es' ? 'font-semibold text-paper' : 'text-paper/60 hover:text-paper'
                  }
                >
                  ES
                </button>
              </form>
              <span className="text-paper/40">/</span>
              <form action={setAdminLocaleAction.bind(null, 'en')}>
                <button
                  type="submit"
                  className={
                    locale === 'en' ? 'font-semibold text-paper' : 'text-paper/60 hover:text-paper'
                  }
                >
                  EN
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Decorative wave — matches the storefront's Header exactly */}
        <div className="overflow-hidden">
          <svg viewBox="0 0 1440 28" preserveAspectRatio="none" className="block h-7 w-full" aria-hidden>
            <path d="M0,0 L1440,0 L1440,16 Q960,34 720,14 Q480,-4 0,18 Z" fill="#122C4C" />
            <path d="M0,18 Q480,-4 720,14 Q960,34 1440,16 L1440,28 L0,28 Z" fill="#0FB3AC" />
          </svg>
        </div>
      </header>

      {isAuthed ? (
        <main className="container-shell flex flex-1 flex-col gap-7 pb-20 pt-6 md:pb-24 md:pt-8 lg:grid lg:grid-cols-[240px_1fr]">
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <AdminSideNav locale={locale} isAdmin={isAdmin} />
            </div>
          </div>
          <div>{children}</div>
        </main>
      ) : (
        <main className="container-shell flex-1 py-16">{children}</main>
      )}

      <footer className="bg-ink-soft text-paper/70">
        <div className="container-shell flex flex-col items-center gap-2 py-8 text-center text-xs sm:flex-row sm:justify-between sm:text-left">
          <span>© {new Date().getFullYear()} Total Bri · Panel administrativo</span>
          <span className="text-paper/50">admin.totalbri.mx</span>
        </div>
      </footer>
    </div>
  );
}
