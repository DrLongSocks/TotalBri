import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/db';
import { getAdminMessages } from '@/domain/admin-i18n/messages';
import { AdminPageHeading } from '@/features/admin/layout/AdminPageHeading';
import { createRestock, relinkNfcTag, updateMaterial } from '@/features/admin/materials/actions';
import { getAdminLocale } from '@/lib/admin-locale';
import { requireAdminSession } from '@/lib/auth/require-admin';

export default async function MaterialDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession();

  const { id } = await params;
  const [locale, material] = await Promise.all([
    getAdminLocale(),
    db.query.materials.findFirst({ where: (m, { eq }) => eq(m.id, id) }),
  ]);
  if (!material) {
    notFound();
  }
  const messages = getAdminMessages(locale).materials;

  return (
    <div className="flex max-w-xl flex-col gap-8">
      <AdminPageHeading>{material.name}</AdminPageHeading>

      <form
        action={updateMaterial.bind(null, material.id)}
        className="grid grid-cols-2 gap-4 rounded-2xl border border-ink/10 bg-card p-6 shadow-[var(--shadow-card)]"
      >
        <Input name="name" defaultValue={material.name} placeholder={messages.name} required />
        <Input
          name="category"
          defaultValue={material.category}
          placeholder={messages.category}
          required
        />
        <Input name="unit" defaultValue={material.unit} placeholder={messages.unit} required />
        <Input name="code" defaultValue={material.code ?? ''} placeholder={messages.code} />
        <Input name="provider" defaultValue={material.provider ?? ''} placeholder={messages.provider} />
        <Input
          name="lowStockThreshold"
          type="number"
          step="0.01"
          defaultValue={material.lowStockThreshold}
          placeholder={messages.lowStockThreshold}
          required
        />
        <Button type="submit" className="col-span-2">
          {messages.update}
        </Button>
      </form>

      <form
        action={relinkNfcTag.bind(null, material.id)}
        className="flex items-end gap-4 rounded-2xl border border-ink/10 bg-card p-6 shadow-[var(--shadow-card)]"
      >
        <div className="flex flex-1 flex-col gap-1">
          <label htmlFor="nfcTagId" className="text-sm text-slate">
            {messages.nfcTagId}
          </label>
          <Input id="nfcTagId" name="nfcTagId" defaultValue={material.nfcTagId ?? ''} required />
        </div>
        <Button type="submit" variant="secondary">
          {messages.relinkTag}
        </Button>
      </form>

      <div className="rounded-2xl border border-ink/10 bg-card p-6 shadow-[var(--shadow-card)]">
        <h2 className="eyebrow mb-3 text-slate">{messages.weightedAvgCost}</h2>
        <p className="mb-4 font-display text-xl font-extrabold text-ink">
          {Number(material.weightedAvgCost) > 0
            ? `$${Number(material.weightedAvgCost).toFixed(2)} / ${material.unit}`
            : messages.costNotRecorded}
        </p>
        <form action={createRestock.bind(null, material.id)} className="grid grid-cols-2 gap-4">
          <Input
            name="quantity"
            type="number"
            step="0.01"
            inputMode="decimal"
            placeholder={`${messages.restockQuantity} (${material.unit})`}
            required
          />
          <Input
            name="totalCost"
            type="number"
            step="0.01"
            inputMode="decimal"
            placeholder={messages.restockTotalCost}
            required
          />
          <Button type="submit" variant="secondary" className="col-span-2">
            {messages.restock}
          </Button>
        </form>
      </div>
    </div>
  );
}
