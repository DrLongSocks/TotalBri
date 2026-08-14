'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { slugifyForNfcTag } from '@/domain/materials/nfc-slug';
import { bulkSetNfcTags } from './actions';

type Material = { id: string; name: string; nfcTagId: string | null };

type Messages = {
  nameLabel: string;
  tagIdLabel: string;
  urlLabel: string;
  copy: string;
  copied: string;
  save: string;
  duplicateError: string;
};

export function NfcSetupTable({
  materials,
  baseUrl,
  messages,
}: {
  materials: readonly Material[];
  baseUrl: string;
  messages: Messages;
}) {
  const [tagIds, setTagIds] = useState<Record<string, string>>(() =>
    Object.fromEntries(materials.map((m) => [m.id, m.nfcTagId ?? slugifyForNfcTag(m.name)])),
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const nonEmptyValues = Object.values(tagIds).filter((value) => value.trim() !== '');
  const duplicates = new Set(
    nonEmptyValues.filter((value, index) => nonEmptyValues.indexOf(value) !== index),
  );
  const hasDuplicates = duplicates.size > 0;

  async function handleCopy(materialId: string, url: string) {
    await navigator.clipboard.writeText(url);
    setCopiedId(materialId);
    setTimeout(() => setCopiedId((current) => (current === materialId ? null : current)), 1500);
  }

  return (
    <form action={bulkSetNfcTags} className="flex flex-col gap-4">
      <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-card shadow-[var(--shadow-card)]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-porcelain/50 text-slate">
              <th className="px-4 py-3">{messages.nameLabel}</th>
              <th className="px-4 py-3">{messages.tagIdLabel}</th>
              <th className="px-4 py-3">{messages.urlLabel}</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {materials.map((material) => {
              const tagId = tagIds[material.id] ?? '';
              const url = `${baseUrl}/admin/log/${encodeURIComponent(tagId)}`;
              const isDuplicate = tagId.trim() !== '' && duplicates.has(tagId);

              return (
                <tr key={material.id} className="border-t border-ink/8">
                  <td className="px-4 py-3">{material.name}</td>
                  <td className="px-4 py-3">
                    <input type="hidden" name={`nfcTagId_${material.id}`} value={tagId} />
                    <Input
                      value={tagId}
                      onChange={(event) =>
                        setTagIds((current) => ({ ...current, [material.id]: event.target.value }))
                      }
                      className={isDuplicate ? 'border-sale' : undefined}
                    />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate">{url}</td>
                  <td className="px-4 py-3">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => handleCopy(material.id, url)}
                    >
                      {copiedId === material.id ? messages.copied : messages.copy}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {hasDuplicates && <p className="text-sm text-sale">{messages.duplicateError}</p>}

      <Button type="submit" disabled={hasDuplicates} className="self-start">
        {messages.save}
      </Button>
    </form>
  );
}
