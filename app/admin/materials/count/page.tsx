import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getMaterialsSortedByName } from '@/db/queries/materials';
import { getAdminMessages } from '@/domain/admin-i18n/messages';
import { AdminPageHeading } from '@/features/admin/layout/AdminPageHeading';
import { recordInventoryCount } from '@/features/admin/materials/actions';
import { getAdminLocale } from '@/lib/admin-locale';
import { requireAdminSession } from '@/lib/auth/require-admin';

export default async function InventoryCountPage() {
  await requireAdminSession();

  const [locale, allMaterials] = await Promise.all([getAdminLocale(), getMaterialsSortedByName()]);
  const messages = getAdminMessages(locale).materials;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <AdminPageHeading>{messages.physicalCount}</AdminPageHeading>
        <Link href="/admin/materials" className="text-sm text-azure hover:underline">
          {messages.backToMaterials}
        </Link>
      </div>

      <form action={recordInventoryCount} className="flex flex-col gap-6">
        <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-card shadow-[var(--shadow-card)]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-porcelain/50 text-slate">
                <th className="px-4 py-3">{messages.name}</th>
                <th className="px-4 py-3">{messages.unit}</th>
                <th className="px-4 py-3">{messages.currentStock}</th>
                <th className="px-4 py-3">{messages.countedStock}</th>
              </tr>
            </thead>
            <tbody>
              {allMaterials.map((material) => (
                <tr key={material.id} className="border-t border-ink/8">
                  <td className="px-4 py-3">{material.name}</td>
                  <td className="px-4 py-3">{material.unit}</td>
                  <td className="px-4 py-3">{material.currentStock}</td>
                  <td className="px-4 py-3">
                    <Input
                      name={`count_${material.id}`}
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="—"
                      className="w-32"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Button type="submit" className="self-start">
          {messages.saveCount}
        </Button>
      </form>
    </div>
  );
}
