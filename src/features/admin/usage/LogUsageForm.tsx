'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { getAdminMessages } from '@/domain/admin-i18n/messages';
import { logUsage } from './actions';

type LogMessages = ReturnType<typeof getAdminMessages>['log'];

export function LogUsageForm({
  nfcTagId,
  products,
  messages,
}: {
  nfcTagId: string;
  products: { id: string; name: string }[];
  messages: LogMessages;
}) {
  const [state, formAction, isPending] = useActionState(logUsage, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="nfcTagId" value={nfcTagId} />
      <div className="flex flex-col gap-1">
        <label htmlFor="productId" className="text-sm text-slate">
          {messages.product}
        </label>
        <select
          id="productId"
          name="productId"
          required
          className="h-11 rounded-full border border-mist bg-paper px-4 text-sm"
        >
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="amountMl" className="text-sm text-slate">
          {messages.amount}
        </label>
        <Input id="amountMl" name="amountMl" type="number" step="0.01" min="0.01" required autoFocus />
      </div>
      {state?.error && <p className="text-sm text-sale">{messages.error}</p>}
      {state?.success && <p className="text-sm text-azure-deep">{messages.success}</p>}
      <Button type="submit" disabled={isPending}>
        {messages.submit}
      </Button>
    </form>
  );
}
