'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useActionState, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { getAdminMessages } from '@/domain/admin-i18n/messages';
import { convertToMl, type WorkerEnteredUnit } from '@/domain/inventory/unit-conversion';
import type { Product } from '@/domain/product/schema';
import { logUsage } from './actions';
import { ProductCombobox } from './ProductCombobox';

type LogMessages = ReturnType<typeof getAdminMessages>['log'];

export function LogUsageFlow({
  nfcTagId,
  materialName,
  workerName,
  products,
  recentProducts,
  messages,
}: {
  nfcTagId: string;
  materialName: string;
  workerName?: string | null;
  products: readonly Product[];
  recentProducts: readonly Product[];
  messages: LogMessages;
}) {
  // Bumping this key remounts the whole component fresh — the simplest way
  // to reset every field (including useActionState's result) after the
  // worker dismisses the success modal, ready for the next tap.
  const [formKey, setFormKey] = useState(0);

  return (
    <LogUsageForm
      key={formKey}
      nfcTagId={nfcTagId}
      materialName={materialName}
      workerName={workerName}
      products={products}
      recentProducts={recentProducts}
      messages={messages}
      onDone={() => setFormKey((k) => k + 1)}
    />
  );
}

const UNIT_OPTIONS: WorkerEnteredUnit[] = ['ml', 'l', 'kg'];

function LogUsageForm({
  nfcTagId,
  materialName,
  workerName,
  products,
  recentProducts,
  messages,
  onDone,
}: {
  nfcTagId: string;
  materialName: string;
  workerName?: string | null;
  products: readonly Product[];
  recentProducts: readonly Product[];
  messages: LogMessages;
  onDone: () => void;
}) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productQuantity, setProductQuantity] = useState('');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState<WorkerEnteredUnit>('ml');
  const [state, formAction, isPending] = useActionState(logUsage, undefined);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (state?.success) setModalOpen(true);
  }, [state]);

  const amountMl = amount ? convertToMl(Number(amount), unit) : 0;
  const canSubmit = Boolean(selectedProduct) && Number(productQuantity) > 0 && amountMl > 0;
  const unitLabel = { ml: messages.unitMl, l: messages.unitL, kg: messages.unitKg }[unit];

  const now = new Date();
  const dateTimeLabel = `${now.toLocaleDateString()} · ${now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-0.5 text-sm text-slate">
        {workerName && (
          <p>
            {messages.worker}: <span className="font-medium text-ink">{workerName}</span>
          </p>
        )}
        <p>
          {messages.dateTime}: <span className="font-medium text-ink">{dateTimeLabel}</span>
        </p>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="nfcTagId" value={nfcTagId} />
        <input type="hidden" name="productId" value={selectedProduct?.id ?? ''} />
        <input type="hidden" name="productQuantity" value={productQuantity} />
        <input type="hidden" name="amountMl" value={amountMl || ''} />

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
          <label className="text-sm text-slate">{messages.amount}</label>
          <div className="flex gap-2">
            <Input
              type="number"
              step="0.01"
              inputMode="decimal"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="flex-1"
            />
            <select
              value={unit}
              onChange={(event) => setUnit(event.target.value as WorkerEnteredUnit)}
              className="h-11 rounded-full border border-mist bg-paper px-3 text-sm"
            >
              {UNIT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {{ ml: messages.unitMl, l: messages.unitL, kg: messages.unitKg }[option]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {state?.error && <p className="text-sm text-sale">{messages.error}</p>}

        <Button type="submit" disabled={!canSubmit || isPending}>
          {messages.continue}
        </Button>
      </form>

      <Dialog.Root open={modalOpen} onOpenChange={(open) => !open && onDone()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/60 backdrop-blur-sm" />
          <Dialog.Content
            className="fixed left-1/2 top-1/2 z-50 w-[min(420px,94vw)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-paper p-6 shadow-[var(--shadow-card-hover)]"
            aria-describedby={undefined}
          >
            <Dialog.Title className="mb-3 font-display text-xl font-extrabold text-ink">
              {messages.success}
            </Dialog.Title>
            <p className="text-sm text-ink">
              {materialName}: {amount}
              {unitLabel} → {selectedProduct?.name.es}: {productQuantity} {selectedProduct?.unit}
            </p>
            <Button type="button" className="mt-6 w-full" onClick={onDone}>
              {messages.done}
            </Button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
