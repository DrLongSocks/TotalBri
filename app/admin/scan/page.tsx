import { getAdminMessages } from '@/domain/admin-i18n/messages';
import { getAdminLocale } from '@/lib/admin-locale';
import { requireSession } from '@/lib/auth/require-admin';

// Fallback landing page for a worker session with no specific tag context —
// their real entry point is always a tag's own URL (/admin/log/[tag]), which
// this doesn't replace. requireAdminSession() redirects here instead of the
// (now admin-only) dashboard for any non-admin hitting an admin-only page.
export default async function ScanPage() {
  await requireSession();

  const locale = await getAdminLocale();
  const messages = getAdminMessages(locale).scan;

  return (
    <div className="mx-auto max-w-sm rounded-2xl border border-ink/10 bg-card p-6 text-center shadow-[var(--shadow-card)]">
      <p className="text-sm text-slate">{messages.instructions}</p>
    </div>
  );
}
