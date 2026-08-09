'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { getAdminMessages } from '@/domain/admin-i18n/messages';
import { requestPasswordReset } from './actions';

type ResetMessages = ReturnType<typeof getAdminMessages>['resetPassword'];

export function RequestResetForm({ messages }: { messages: ResetMessages }) {
  const [state, formAction, isPending] = useActionState(requestPasswordReset, undefined);

  if (state?.success) {
    return <p className="text-sm text-paper/80">{messages.success}</p>;
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm text-paper/70">
          {messages.email}
        </label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      {state?.error && <p className="text-sm text-sale">{messages.invalidEmail}</p>}
      <Button type="submit" disabled={isPending}>
        {messages.submit}
      </Button>
    </form>
  );
}
