'use client';

import { useActionState, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { getAdminMessages } from '@/domain/admin-i18n/messages';
import type { Product } from '@/domain/product/schema';
import { logUsage } from './actions';
import { ProductCombobox } from './ProductCombobox';

type LogMessages = ReturnType<typeof getAdminMessages>['log'];

export function LogUsageFlow({
  nfcTagId,
  materialName,
  materialUnit,
  products,
  recentProducts,
  messages,
}: {
  nfcTagId: string;
  materialName: string;
  materialUnit: string;
  products: readonly Product[];
  recentProducts: readonly Product[];
  messages: LogMessages;
}) {
  const [step, setStep] = useState<'form' | 'confirm'>('form');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productQuantity, setProductQuantity] = useState('');
  const [amountMl, setAmountMl] = useState('');
  const [state, formAction, isPending] = useActionState(logUsage, undefined);

  if (state?.success) {
    return <p className="text-sm text-azure-deep">{messages.success}</p>;
  }

  const canContinue = Boolean(selectedProduct) && Number(productQuantity) > 0 && Number(amountMl) > 0;

  if (step === 'confirm' && selectedProduct) {
    return (
      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="nfcTagId" value={nfcTagId} />
        <input type="hidden" name="productId" value={selectedProduct.id} />
        <input type="hidden" name="productQuantity" value={productQuantity} />
        <input type="hidden" name="amountMl" value={amountMl} />
        <p className="rounded-xl border border-ink/10 bg-porcelain/40 p-4 text-base text-ink">
          {materialName}: {amountMl}
          {materialUnit} → {selectedProduct.name.es}: {productQuantity} {selectedProduct.unit} —{' '}
          {messages.confirmPrompt}
        </p>
        {state?.error && <p className="text-sm text-sale">{messages.error}</p>}
        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={() => setStep('form')} disabled={isPending}>
            {messages.back}
          </Button>
          <Button type="submit" disabled={isPending} className="flex-1">
            {messages.confirm}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate">{messages.product}</label>
        <ProductCombobox
          products={products}
          recentProducts={recentProducts}
          placeholder={messages.product}
          recentLabel={messages.recentProducts}
          value={selectedProduct}
          onSelect={setSelectedProduct}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate">
          {messages.productQuantity}
          {selectedProduct ? ` (${selectedProduct.unit})` : ''}
        </label>
        <Input
          type="number"
          step="0.01"
          inputMode="decimal"
          value={productQuantity}
          onChange={(event) => setProductQuantity(event.target.value)}
          disabled={!selectedProduct}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate">
          {messages.amount} ({materialUnit})
        </label>
        <Input
          type="number"
          step="0.01"
          inputMode="decimal"
          value={amountMl}
          onChange={(event) => setAmountMl(event.target.value)}
        />
      </div>
      <Button type="button" disabled={!canContinue} onClick={() => setStep('confirm')}>
        {messages.continue}
      </Button>
    </div>
  );
}
