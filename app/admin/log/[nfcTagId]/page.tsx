import { db } from '@/db';
import { getAdminMessages } from '@/domain/admin-i18n/messages';
import { LogUsageForm } from '@/features/admin/usage/LogUsageForm';
import { getAdminLocale } from '@/lib/admin-locale';

export default async function LogUsagePage({
  params,
}: {
  params: Promise<{ nfcTagId: string }>;
}) {
  const { nfcTagId } = await params;
  const [locale, material, allProducts] = await Promise.all([
    getAdminLocale(),
    db.query.materials.findFirst({ where: (m, { eq }) => eq(m.nfcTagId, nfcTagId) }),
    db.query.products.findMany({ orderBy: (p, { asc }) => asc(p.name) }),
  ]);
  const messages = getAdminMessages(locale).log;

  if (!material) {
    return (
      <div className="mx-auto max-w-sm">
        <p className="text-sm text-sale">{messages.unknownTag}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-2 font-display text-2xl">{material.name}</h1>
      <p className="mb-6 text-sm text-slate">
        {messages.currentStock}: {material.currentStock} {material.unit}
      </p>
      <LogUsageForm nfcTagId={nfcTagId} products={allProducts} messages={messages} />
    </div>
  );
}
