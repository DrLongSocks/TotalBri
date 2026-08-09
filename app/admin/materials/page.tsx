import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/db';
import { getAdminMessages } from '@/domain/admin-i18n/messages';
import { materials } from '@/db/schema';
import {
  type MaterialSortColumn,
  type MaterialsSort,
  nextSortDirection,
  resolveMaterialsSort,
} from '@/domain/materials/sort';
import { AdminPageHeading } from '@/features/admin/layout/AdminPageHeading';
import { createMaterial } from '@/features/admin/materials/actions';
import { getAdminLocale } from '@/lib/admin-locale';
import { requireAdminSession } from '@/lib/auth/require-admin';

const COLUMN_MAP = {
  name: materials.name,
  code: materials.code,
  provider: materials.provider,
  category: materials.category,
  currentStock: materials.currentStock,
  lowStockThreshold: materials.lowStockThreshold,
} satisfies Record<MaterialSortColumn, unknown>;

function SortableHeader({
  column,
  label,
  current,
}: {
  column: MaterialSortColumn;
  label: string;
  current: MaterialsSort;
}) {
  const isActive = current.sort === column;
  const nextDir = nextSortDirection(current, column);

  return (
    <th className="px-4 py-3">
      <Link
        href={`/admin/materials?sort=${column}&dir=${nextDir}`}
        className="flex items-center gap-1 hover:text-ink"
      >
        {label}
        {isActive && <span aria-hidden>{current.dir === 'asc' ? '↑' : '↓'}</span>}
      </Link>
    </th>
  );
}

export default async function MaterialsPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; dir?: string }>;
}) {
  await requireAdminSession();

  const [locale, rawParams] = await Promise.all([getAdminLocale(), searchParams]);
  const sort = resolveMaterialsSort(rawParams);
  const messages = getAdminMessages(locale).materials;

  const allMaterials = await db.query.materials.findMany({
    orderBy: (m, { asc, desc }) => (sort.dir === 'desc' ? desc(COLUMN_MAP[sort.sort]) : asc(COLUMN_MAP[sort.sort])),
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <AdminPageHeading>{messages.title}</AdminPageHeading>
        <div className="flex gap-4">
          <Link href="/admin/materials/import" className="text-sm text-azure hover:underline">
            {messages.importTitle}
          </Link>
          <Link href="/admin/materials/count" className="text-sm text-azure hover:underline">
            {messages.physicalCount}
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-card shadow-[var(--shadow-card)]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-porcelain/50 text-slate">
              <SortableHeader column="name" label={messages.name} current={sort} />
              <SortableHeader column="code" label={messages.code} current={sort} />
              <SortableHeader column="provider" label={messages.provider} current={sort} />
              <SortableHeader column="category" label={messages.category} current={sort} />
              <th className="px-4 py-3">{messages.unit}</th>
              <SortableHeader column="currentStock" label={messages.currentStock} current={sort} />
              <SortableHeader column="lowStockThreshold" label={messages.lowStockThreshold} current={sort} />
              <th className="px-4 py-3">{messages.nfcTagId}</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {allMaterials.map((material) => (
              <tr
                key={material.id}
                className="border-t border-ink/8 transition-colors hover:bg-porcelain/40"
              >
                <td className="px-4 py-3">{material.name}</td>
                <td className="px-4 py-3">{material.code ?? '—'}</td>
                <td className="px-4 py-3">{material.provider ?? '—'}</td>
                <td className="px-4 py-3">{material.category}</td>
                <td className="px-4 py-3">{material.unit}</td>
                <td className="px-4 py-3">{material.currentStock}</td>
                <td className="px-4 py-3">{material.lowStockThreshold}</td>
                <td className="px-4 py-3">{material.nfcTagId ?? '—'}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/materials/${material.id}`} className="font-medium text-azure hover:underline">
                    {messages.viewDetail}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form
        action={createMaterial}
        className="grid max-w-xl grid-cols-2 gap-4 rounded-2xl border border-ink/10 bg-card p-6 shadow-[var(--shadow-card)]"
      >
        <Input name="name" placeholder={messages.name} required />
        <Input name="code" placeholder={messages.code} />
        <Input name="provider" placeholder={messages.provider} />
        <Input name="category" placeholder={messages.category} defaultValue="fragrance" required />
        <Input name="unit" placeholder={messages.unit} required />
        <Input
          name="currentStock"
          type="number"
          step="0.01"
          placeholder={messages.currentStock}
          defaultValue="0"
          required
        />
        <Input
          name="lowStockThreshold"
          type="number"
          step="0.01"
          placeholder={messages.lowStockThreshold}
          required
        />
        <Input name="nfcTagId" placeholder={messages.nfcTagId} />
        <Button type="submit" className="col-span-2">
          {messages.create}
        </Button>
      </form>
    </div>
  );
}
