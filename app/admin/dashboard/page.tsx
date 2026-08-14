import Image from 'next/image';
import { getAdminMessages } from '@/domain/admin-i18n/messages';
import { resolveDashboardFilters } from '@/domain/inventory/dashboard-filters';
import { getAllProducts, getProductById } from '@/domain/product/repository';
import { DottedSurface } from '@/components/ui/DottedSurface';
import {
  BurnRateCard,
  InventoryValueCard,
  ProductsMadeCard,
  RestockFrequencyCard,
  StatCard,
  StockoutCard,
  TopConsumedCard,
  WorkerVolumeCard,
} from '@/features/admin/reports/DashboardCards';
import { DashboardFilterForm, DashboardRangeToggle } from '@/features/admin/reports/DashboardFiltersBar';
import { RankedBarChart } from '@/features/admin/reports/RankedBarChart';
import { RatioCard } from '@/features/admin/reports/RatioCard';
import {
  getAdjustmentCount,
  getBurnRate,
  getDaysUntilStockout,
  getDistinctFragrancesToday,
  getFragrancePerUnitPoints,
  getInventoryValue,
  getMaterialOptions,
  getProductsMade,
  getRestockFrequency,
  getStockOverview,
  getTopConsumedMaterials,
  getTopConsumedProducts,
  getTotalVolumeUsed,
  getUsageByMaterial,
  getUsageByProduct,
  getUsageTrend,
  getWorkerVolume,
} from '@/features/admin/reports/queries';
import { StockTable } from '@/features/admin/reports/StockTable';
import { UsageTrendChart } from '@/features/admin/reports/UsageTrendChart';
import { getAdminLocale } from '@/lib/admin-locale';
import { requireAdminSession } from '@/lib/auth/require-admin';

function toSingle(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await requireAdminSession();

  const [locale, rawParams] = await Promise.all([getAdminLocale(), searchParams]);
  const messages = getAdminMessages(locale);
  const filters = resolveDashboardFilters(
    {
      range: toSingle(rawParams.range),
      material: toSingle(rawParams.material),
      product: toSingle(rawParams.product),
      from: toSingle(rawParams.from),
      to: toSingle(rawParams.to),
    },
    new Date(),
  );

  const [
    stock,
    trend,
    materials,
    stockoutRows,
    totalVolume,
    distinctToday,
    productsMade,
    usageByMaterial,
    usageByProduct,
    workerVolume,
    restockFrequency,
    adjustmentCount,
    topMaterials,
    topProducts,
    inventoryValue,
    burnRate,
  ] = await Promise.all([
    getStockOverview(),
    getUsageTrend(30),
    getMaterialOptions(),
    getDaysUntilStockout(filters.materialId),
    getTotalVolumeUsed(filters),
    getDistinctFragrancesToday(),
    getProductsMade(filters),
    getUsageByMaterial(filters),
    getUsageByProduct(filters),
    getWorkerVolume(filters),
    getRestockFrequency(),
    getAdjustmentCount(),
    getTopConsumedMaterials(filters),
    getTopConsumedProducts(filters),
    getInventoryValue(),
    getBurnRate(filters),
  ]);

  const products = getAllProducts();
  const selectedProduct = filters.productId ? (getProductById(filters.productId) ?? null) : null;

  // Card 7: ratio trend for the top few products made in this window.
  const ratioProducts = await Promise.all(
    productsMade.slice(0, 5).map(async (product) => ({
      productId: product.productId,
      productName: product.productName,
      points: await getFragrancePerUnitPoints(product.productId),
    })),
  );

  return (
    <div className="flex flex-col gap-8">
      <section className="relative overflow-hidden rounded-2xl bg-ink">
        <DottedSurface />
        <div className="noise pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-azure/20 blur-[120px]" />

        <div className="relative z-10 flex flex-col gap-8 px-8 py-12 md:px-12 md:py-16">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col gap-8 md:ml-4">
              <div>
                <p className="eyebrow mb-3 text-azure">{messages.dashboard.heroEyebrow}</p>
                <h1 className="display-l leading-none text-paper">
                  {messages.dashboard.title}
                  {messages.dashboard.titleLine2 && (
                    <>
                      <br />
                      {messages.dashboard.titleLine2}
                    </>
                  )}
                </h1>
              </div>
              <DashboardRangeToggle filters={filters} messages={messages.dashboard} />
            </div>

            <div className="flex flex-shrink-0 items-center justify-center md:-mt-10 md:mr-32 lg:-mt-12 lg:mr-40">
              <div className="relative flex items-center justify-center">
                <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-azure/30 blur-[80px]" />
                <Image
                  src="/logo.svg"
                  alt="Total Bri"
                  width={340}
                  height={340}
                  className="relative z-10 h-40 w-40 object-contain drop-shadow-2xl md:h-64 md:w-64"
                  unoptimized
                />
              </div>
            </div>
          </div>

          <DashboardFilterForm
            filters={filters}
            materials={materials}
            products={products}
            selectedProduct={selectedProduct}
            messages={messages.dashboard}
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard title={messages.dashboard.totalVolumeTitle} value={totalVolume} />
            <StatCard title={messages.dashboard.distinctFragrancesTitle} value={distinctToday} />
            <StatCard title={messages.dashboard.adjustmentsTitle} value={adjustmentCount} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-paper/15 bg-paper/10 p-6 backdrop-blur-sm">
              <h2 className="eyebrow mb-4 text-paper/70">{messages.dashboard.usageByMaterialTitle}</h2>
              <RankedBarChart data={usageByMaterial} emptyState={messages.dashboard.noDataInWindow} />
            </div>
            <div className="rounded-2xl border border-paper/15 bg-paper/10 p-6 backdrop-blur-sm">
              <h2 className="eyebrow mb-4 text-paper/70">{messages.dashboard.usageByProductTitle}</h2>
              <RankedBarChart data={usageByProduct} emptyState={messages.dashboard.noDataInWindow} />
            </div>
          </div>
        </div>
      </section>

      <ProductsMadeCard rows={productsMade} messages={messages.dashboard} />

      <RatioCard products={ratioProducts} messages={messages.dashboard} />

      <div className="grid gap-6 lg:grid-cols-2">
        <WorkerVolumeCard rows={workerVolume} messages={messages.dashboard} />
        <RestockFrequencyCard rows={restockFrequency} messages={messages.dashboard} />
      </div>

      <TopConsumedCard materials={topMaterials} products={topProducts} messages={messages.dashboard} />

      <div className="grid gap-6 lg:grid-cols-2">
        <InventoryValueCard
          rows={inventoryValue.rows}
          total={inventoryValue.total}
          messages={{ ...messages.dashboard, costNotRecorded: messages.materials.costNotRecorded }}
        />
        <BurnRateCard
          total={burnRate.total}
          excludedMaterialCount={burnRate.excludedMaterialCount}
          messages={messages.dashboard}
        />
      </div>

      <section className="rounded-2xl border border-ink/10 bg-card p-6 shadow-[var(--shadow-card)]">
        <h2 className="eyebrow mb-4 text-slate">{messages.dashboard.usageTrend}</h2>
        <UsageTrendChart data={trend} messages={messages.dashboard} />
      </section>

      <section className="rounded-2xl border border-ink/10 bg-card p-6 shadow-[var(--shadow-card)]">
        <StockTable rows={stock} messages={messages} />
      </section>

      <StockoutCard rows={stockoutRows} messages={messages.dashboard} />
    </div>
  );
}
