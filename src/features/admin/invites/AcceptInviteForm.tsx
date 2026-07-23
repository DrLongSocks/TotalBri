'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { getAdminMessages } from '@/domain/admin-i18n/messages';
import { acceptInvite } from './actions';

type InviteMessages = ReturnType<typeof getAdminMessages>['invite'];

export function AcceptInviteForm({ messages, token }: { messages: InviteMessages; token: string }) {
  const [state, formAction, isPending] = useActionState(acceptInvite, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="token" value={token} />
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm text-slate">
          {messages.name}
        </label>
        <Input id="name" name="name" required autoComplete="name" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm text-slate">
          {messages.password}
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
        {messages.submit}
      </Button>
    </form>
  );
}
