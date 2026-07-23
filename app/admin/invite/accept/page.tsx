import { db } from '@/db';
import { getAdminMessages } from '@/domain/admin-i18n/messages';
import { isInviteValid } from '@/domain/invites/token';
import { AcceptInviteForm } from '@/features/admin/invites/AcceptInviteForm';
import { getAdminLocale } from '@/lib/admin-locale';

export default async function AcceptInvitePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const [locale, params] = await Promise.all([getAdminLocale(), searchParams]);
  const messages = getAdminMessages(locale);
  const token = params.token ?? '';

  const invite = token
    ? await db.query.invites.findFirst({ where: (i, { eq }) => eq(i.token, token) })
    : undefined;
  const valid = invite ? isInviteValid(invite, new Date()) : false;

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 font-display text-2xl">{messages.invite.title}</h1>
      {valid ? (
        <AcceptInviteForm messages={messages.invite} token={token} />
      ) : (
        <p className="text-sm text-sale">{messages.invite.invalid}</p>
      )}
    </div>
  );
}
