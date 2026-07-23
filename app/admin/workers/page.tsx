import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { db } from '@/db';
import { getAdminMessages } from '@/domain/admin-i18n/messages';
import { isInviteValid } from '@/domain/invites/token';
import { AdminPageHeading } from '@/features/admin/layout/AdminPageHeading';
import { createInvite } from '@/features/admin/invites/actions';
import { removeWorker } from '@/features/admin/workers/actions';
import { getAdminLocale } from '@/lib/admin-locale';
import { auth } from '@/lib/auth/auth';
import { requireAdminSession } from '@/lib/auth/require-admin';

export default async function WorkersPage() {
  const session = await requireAdminSession();

  const [locale, allUsers, allInvites] = await Promise.all([
    getAdminLocale(),
    db.query.users.findMany({ orderBy: (u, { asc }) => asc(u.name) }),
    db.query.invites.findMany({ orderBy: (i, { desc }) => desc(i.createdAt) }),
  ]);
  const messages = getAdminMessages(locale).workers;
  const activeUsers = allUsers.filter((user) => !user.disabledAt);
  const pendingInvites = allInvites.filter((invite) => isInviteValid(invite, new Date()));

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeading>{messages.title}</AdminPageHeading>

      <section className="flex flex-col gap-3">
        <h2 className="eyebrow text-slate">{messages.activeUsers}</h2>
        <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-card shadow-[var(--shadow-card)]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-porcelain/50 text-slate">
                <th className="px-4 py-3">{messages.name}</th>
                <th className="px-4 py-3">{messages.email}</th>
                <th className="px-4 py-3">{messages.role}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {activeUsers.map((user) => (
                <tr key={user.id} className="border-t border-ink/8 transition-colors hover:bg-porcelain/40">
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    {user.role === 'admin' ? messages.roleAdmin : messages.roleWorker}
                  </td>
                  <td className="px-4 py-3">
                    {user.id !== session?.user.id && (
                      <form action={removeWorker}>
                        <input type="hidden" name="userId" value={user.id} />
                        <button type="submit" className="font-medium text-sale hover:underline">
                          {messages.remove}
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="eyebrow text-slate">{messages.pendingInvites}</h2>
        <ul className="flex flex-col gap-0.5 rounded-2xl border border-ink/10 bg-card p-2 shadow-[var(--shadow-card)]">
          {pendingInvites.map((invite) => (
            <li
              key={invite.id}
              className="flex flex-col gap-1 rounded-xl px-4 py-2.5 text-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <span>
                {invite.email} · {invite.role === 'admin' ? messages.roleAdmin : messages.roleWorker}
              </span>
              <span className="text-xs text-slate">
                {messages.inviteLink}: /invite/accept?token={invite.token}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <form
        action={createInvite}
        className="flex max-w-lg flex-col items-end gap-4 rounded-2xl border border-ink/10 bg-card p-6 shadow-[var(--shadow-card)] sm:flex-row"
      >
        <div className="flex w-full flex-1 flex-col gap-1">
          <label htmlFor="email" className="text-sm text-slate">
            {messages.email}
          </label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="flex w-full flex-col gap-1 sm:w-auto">
          <label htmlFor="role" className="text-sm text-slate">
            {messages.role}
          </label>
          <Select name="role" defaultValue="worker">
            <SelectTrigger id="role" className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="worker">{messages.roleWorker}</SelectItem>
              <SelectItem value="admin">{messages.roleAdmin}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full sm:w-auto">
          {messages.invite}
        </Button>
      </form>
    </div>
  );
}
