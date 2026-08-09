'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { getAdminMessages } from '@/domain/admin-i18n/messages';
import { resetPassword } from './actions';

type ResetMessages = ReturnType<typeof getAdminMessages>['resetPassword'];

export function ResetPasswordForm({ messages, token }: { messages: ResetMessages; token: string }) {
  const [state, formAction, isPending] = useActionState(resetPassword, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="token" value={token} />
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm text-paper/70">
          {messages.newPassword}
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>
      {state?.error && <p className="text-sm text-sale">{messages.invalid}</p>}
      <Button type="submit" disabled={isPending}>
        {messages.confirmSubmit}
      </Button>
    </form>
  );
}
