import { db } from '@/db';
import { getAdminMessages } from '@/domain/admin-i18n/messages';
import { getAllProducts, getProductById } from '@/domain/product/repository';
import { LogUsageFlow } from '@/features/admin/usage/LogUsageFlow';
import { getRecentProductIdsForMaterial } from '@/features/admin/usage/queries';
import { getAdminLocale } from '@/lib/admin-locale';
import { requireSession } from '@/lib/auth/require-admin';

export default async function LogUsagePage({
  params,
}: {
  params: Promise<{ nfcTagId: string }>;
}) {
  const session = await requireSession();

  const { nfcTagId } = await params;
  const [locale, material] = await Promise.all([
    getAdminLocale(),
    db.query.materials.findFirst({ where: (m, { eq }) => eq(m.nfcTagId, nfcTagId) }),
  ]);
  const messages = getAdminMessages(locale).log;

  if (!material) {
    return (
      <div className="mx-auto max-w-sm rounded-2xl border border-ink/10 bg-card p-6 shadow-[var(--shadow-card)]">
        <p className="text-sm text-sale">{messages.unknownTag}</p>
      </div>
    );
  }

  const recentProductIds = await getRecentProductIdsForMaterial(material.id);
  const recentProducts = recentProductIds
    .map((id) => getProductById(id))
    .filter((product) => product !== undefined);

  return (
    <div className="mx-auto max-w-sm rounded-2xl border border-ink/10 bg-card p-6 shadow-[var(--shadow-card)]">
      <h1 className="mb-1 font-display text-2xl">{material.name}</h1>
      <p className="mb-6 text-sm text-slate">
        {messages.currentStock}: {material.currentStock} {material.unit}
      </p>
      <LogUsageFlow
        nfcTagId={nfcTagId}
        materialName={material.name}
        workerName={session.user.name}
        products={getAllProducts()}
        recentProducts={recentProducts}
        messages={messages}
      />
    </div>
  );
}
