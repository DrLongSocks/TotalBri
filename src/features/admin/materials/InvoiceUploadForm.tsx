'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useActionState, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { getAdminMessages } from '@/domain/admin-i18n/messages';
import {
  confirmInvoiceRestock,
  extractInvoiceLineItems,
  type DraftLineItem,
} from './invoice-import-actions';

type Messages = ReturnType<typeof getAdminMessages>['materials'];
type MaterialOption = { id: string; name: string };

function extractErrorMessage(error: string, messages: Messages): string {
  switch (error) {
    case 'not-configured':
      return messages.importErrorNotConfigured;
    case 'invalid-file':
      return messages.importErrorInvalidFile;
    case 'file-too-large':
      return messages.importErrorFileTooLarge;
    case 'extraction-failed':
      return messages.importErrorExtractionFailed;
    default:
      return messages.importErrorGeneric;
  }
}

export function InvoiceUploadForm({
  messages,
  materials,
}: {
  messages: Messages;
  materials: MaterialOption[];
}) {
  const [extractState, extractAction, isExtracting] = useActionState(extractInvoiceLineItems, undefined);
  const [confirmState, confirmAction, isConfirming] = useActionState(confirmInvoiceRestock, undefined);
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<(DraftLineItem & { included: boolean })[]>([]);

  useEffect(() => {
    if (extractState?.success) {
      setLines(extractState.lines.map((line) => ({ ...line, included: true })));
      setOpen(true);
    }
  }, [extractState]);

  useEffect(() => {
    if (confirmState?.success) setOpen(false);
  }, [confirmState]);

  function updateLine(index: number, patch: Partial<DraftLineItem & { included: boolean }>) {
    setLines((prev) => prev.map((line, i) => (i === index ? { ...line, ...patch } : line)));
  }

  return (
    <div className="flex flex-col gap-4">
      <form
        action={extractAction}
        className="flex flex-col items-start gap-3 rounded-2xl border border-ink/10 bg-card p-6 shadow-[var(--shadow-card)] sm:flex-row sm:items-end"
      >
        <div className="flex flex-1 flex-col gap-1">
          <label htmlFor="file" className="text-sm text-slate">
            {messages.importUploadLabel}
          </label>
          <input
            id="file"
            name="file"
            type="file"
            accept="application/pdf"
            required
            className="text-sm"
          />
        </div>
        <Button type="submit" disabled={isExtracting}>
          {isExtracting ? messages.importExtracting : messages.importExtractButton}
        </Button>
      </form>

      {extractState && !extractState.success && (
        <p className="text-sm text-sale">{extractErrorMessage(extractState.error, messages)}</p>
      )}

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/60 backdrop-blur-sm" />
          <Dialog.Content
            className="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[min(900px,94vw)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-paper p-6 shadow-[var(--shadow-card-hover)]"
            aria-describedby={undefined}
          >
            <Dialog.Title className="mb-4 font-display text-xl font-extrabold text-ink">
              {messages.importReviewTitle}
            </Dialog.Title>

            {extractState?.success && extractState.documentType === 'quote' && (
              <p className="mb-4 rounded-xl bg-sale/10 p-3 text-sm text-sale">{messages.importQuoteWarning}</p>
            )}

            <form action={confirmAction} className="flex flex-col gap-4">
              {extractState?.success && (
                <>
                  <input type="hidden" name="fileName" value={extractState.fileName} />
                  <input type="hidden" name="fileUrl" value={extractState.fileUrl} />
                  <input type="hidden" name="supplierName" value={extractState.supplierName ?? ''} />
                  <input type="hidden" name="rowCount" value={lines.length} />
                </>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-slate">
                      <th className="px-2 py-2">{messages.name}</th>
                      <th className="px-2 py-2">{messages.importMaterialColumn}</th>
                      <th className="px-2 py-2">{messages.importQuantityColumn}</th>
                      <th className="px-2 py-2">{messages.importCostColumn}</th>
                      <th className="px-2 py-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((line, i) => (
                      <tr key={i} className={`border-t border-ink/8 ${line.included ? '' : 'opacity-40'}`}>
                        <td className="px-2 py-2">{line.description}</td>
                        <td className="px-2 py-2">
                          <select
                            name={`materialId_${i}`}
                            value={line.matchedMaterialId ?? ''}
                            disabled={!line.included}
                            onChange={(e) => updateLine(i, { matchedMaterialId: e.target.value || null })}
                            className="h-10 rounded-full border border-mist bg-paper px-3 text-sm"
                          >
                            <option value="">{messages.importNoMaterial}</option>
                            {materials.map((material) => (
                              <option key={material.id} value={material.id}>
                                {material.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-2 py-2">
                          <input
                            name={`quantityMl_${i}`}
                            type="number"
                            step="0.01"
                            min="0"
                            value={line.quantityMl}
                            disabled={!line.included}
                            onChange={(e) => updateLine(i, { quantityMl: Number(e.target.value) })}
                            className="h-10 w-28 rounded-full border border-mist bg-paper px-3 text-sm"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            name={`totalCost_${i}`}
                            type="number"
                            step="0.01"
                            min="0"
                            value={line.totalCost}
                            disabled={!line.included}
                            onChange={(e) => updateLine(i, { totalCost: Number(e.target.value) })}
                            className="h-10 w-28 rounded-full border border-mist bg-paper px-3 text-sm"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <button
                            type="button"
                            onClick={() => updateLine(i, { included: !line.included })}
                            className="text-xs text-slate hover:text-sale"
                          >
                            {line.included ? messages.importRemoveRow : messages.importRestoreRow}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {confirmState?.error && <p className="text-sm text-sale">{messages.importErrorGeneric}</p>}

              <div className="flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                  {messages.importCancel}
                </Button>
                <Button type="submit" disabled={isConfirming}>
                  {messages.importConfirmButton}
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
