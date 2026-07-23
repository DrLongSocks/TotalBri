import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/db';
import { getAdminMessages } from '@/domain/admin-i18n/messages';
import { AdminPageHeading } from '@/features/admin/layout/AdminPageHeading';
import { createMaterial } from '@/features/admin/materials/actions';
import { getAdminLocale } from '@/lib/admin-locale';
import { requireAdminSession } from '@/lib/auth/require-admin';

export default async function MaterialsPage() {
  await requireAdminSession();

  const [locale, allMaterials] = await Promise.all([
    getAdminLocale(),
    db.query.materials.findMany({ orderBy: (m, { asc }) => asc(m.name) }),
  ]);
  const messages = getAdminMessages(locale).materials;

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeading>{messages.title}</AdminPageHeading>

      <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-card shadow-[var(--shadow-card)]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-porcelain/50 text-slate">
              <th className="px-4 py-3">{messages.name}</th>
              <th className="px-4 py-3">{messages.provider}</th>
              <th className="px-4 py-3">{messages.category}</th>
              <th className="px-4 py-3">{messages.unit}</th>
              <th className="px-4 py-3">{messages.currentStock}</th>
              <th className="px-4 py-3">{messages.lowStockThreshold}</th>
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
                <td className="px-4 py-3">{material.provider ?? '—'}</td>
                <td className="px-4 py-3">{material.category}</td>
                <td className="px-4 py-3">{material.unit}</td>
                <td className="px-4 py-3">{material.currentStock}</td>
                <td className="px-4 py-3">{material.lowStockThreshold}</td>
                <td className="px-4 py-3">{material.nfcTagId ?? '—'}</td>
                <td className="px-4 py-3">
                  <Link href={`/materials/${material.id}`} className="font-medium text-azure hover:underline">
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
