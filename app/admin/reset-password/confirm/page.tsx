import Image from 'next/image';
import { db } from '@/db';
import { getAdminMessages } from '@/domain/admin-i18n/messages';
import { isResetTokenValid } from '@/domain/password-reset/token';
import { DottedSurface } from '@/components/ui/DottedSurface';
import { ResetPasswordForm } from '@/features/admin/password-reset/ResetPasswordForm';
import { getAdminLocale } from '@/lib/admin-locale';

export default async function ConfirmResetPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const [locale, params] = await Promise.all([getAdminLocale(), searchParams]);
  const messages = getAdminMessages(locale);
  const token = params.token ?? '';

  const resetToken = token
    ? await db.query.passwordResetTokens.findFirst({ where: (t, { eq }) => eq(t.token, token) })
    : undefined;
  const valid = resetToken ? isResetTokenValid(resetToken, new Date()) : false;

  return (
    <section className="relative overflow-hidden rounded-2xl bg-ink">
      <DottedSurface />
      <div className="noise pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-azure/20 blur-[120px]" />

      <div className="relative z-10 flex flex-col items-center gap-8 px-8 py-12 text-center md:flex-row md:items-center md:justify-center md:gap-20 md:px-12 md:py-16 md:text-left">
        <div className="flex w-full max-w-sm flex-col items-center md:items-start">
          <p className="eyebrow mb-3 text-azure">{messages.login.eyebrow}</p>
          <h1 className="display-xl leading-none text-paper">{messages.resetPassword.title}</h1>
          <div className="mt-6 w-full">
            {valid ? (
              <ResetPasswordForm messages={messages.resetPassword} token={token} />
            ) : (
              <p className="text-sm text-paper/80">{messages.resetPassword.invalid}</p>
            )}
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center justify-center">
          <div className="relative flex items-center justify-center">
            <div className="pointer-events-none absolute h-96 w-96 rounded-full bg-azure/30 blur-[80px]" />
            <Image
              src="/logo.svg"
              alt="Total Bri"
              width={340}
              height={340}
              className="relative z-10 h-56 w-56 object-contain drop-shadow-2xl md:h-80 md:w-80"
              unoptimized
            />
          </div>
        </div>
      </div>
    </section>
  );
}
