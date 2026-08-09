'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { getAdminMessages } from '@/domain/admin-i18n/messages';
import { loginAction } from './actions';

type LoginMessages = ReturnType<typeof getAdminMessages>['login'];

export function LoginForm({
  messages,
  callbackUrl,
}: {
  messages: LoginMessages;
  callbackUrl: string;
}) {
  const [state, formAction, isPending] = useActionState(loginAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="redirectTo" value={callbackUrl} />
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm text-paper/70">
          {messages.email}
        </label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm text-paper/70">
          {messages.password}
        </label>
        <Input id="password" name="password" type="password" required autoComplete="current-password" />
      </div>
      <Link href="/admin/reset-password" className="self-end text-sm text-azure hover:underline">
        {messages.forgotPassword}
      </Link>
      {state?.error && <p className="text-sm text-sale">{messages.error}</p>}
      <Button type="submit" disabled={isPending}>
        {messages.submit}
      </Button>
    </form>
  );
}
