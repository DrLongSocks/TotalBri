import { getAdminMessages } from '@/domain/admin-i18n/messages';
import { LoginForm } from '@/features/admin/auth/LoginForm';
import { getAdminLocale } from '@/lib/admin-locale';

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const [locale, params] = await Promise.all([getAdminLocale(), searchParams]);
  const messages = getAdminMessages(locale);

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 font-display text-2xl">{messages.login.title}</h1>
      <LoginForm messages={messages.login} callbackUrl={params.callbackUrl ?? '/admin/dashboard'} />
    </div>
  );
}
