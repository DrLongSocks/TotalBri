'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import type { getAdminMessages } from '@/domain/admin-i18n/messages';
import type { StockRow } from './queries';

export function StockTable({
  rows,
  messages,
}: {
  rows: StockRow[];
  messages: ReturnType<typeof getAdminMessages>;
}) {
  const [query, setQuery] = useState('');
  const filtered = rows.filter((row) => row.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex flex-col gap-3">
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={messages.dashboard.search}
        className="max-w-sm"
      />
      <div className="overflow-x-auto rounded-xl border border-ink/10">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-porcelain/50 text-slate">
              <th className="px-3 py-2.5">{messages.materials.name}</th>
              <th className="px-3 py-2.5">{messages.materials.category}</th>
              <th className="px-3 py-2.5">{messages.materials.currentStock}</th>
              <th className="px-3 py-2.5">{messages.materials.lowStockThreshold}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => {
              const belowThreshold = row.currentStock <= row.lowStockThreshold;
              return (
                <tr key={row.id} className="border-t border-ink/8 transition-colors hover:bg-porcelain/40">
                  <td className="px-3 py-2.5">{row.name}</td>
                  <td className="px-3 py-2.5">{row.category}</td>
                  <td className={`px-3 py-2.5 ${belowThreshold ? 'font-semibold text-sale' : ''}`}>
                    {row.currentStock} {row.unit}
                  </td>
                  <td className="px-3 py-2.5">
                    {row.lowStockThreshold} {row.unit}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
