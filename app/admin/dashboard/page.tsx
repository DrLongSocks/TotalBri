import { getAdminMessages } from '@/domain/admin-i18n/messages';
import { resolveDashboardFilters } from '@/domain/inventory/dashboard-filters';
import { getAllProducts, getProductById } from '@/domain/product/repository';
import { AdminPageHeading } from '@/features/admin/layout/AdminPageHeading';
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
import { DashboardFiltersBar } from '@/features/admin/reports/DashboardFiltersBar';
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

function toSingle(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
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
      <AdminPageHeading>{messages.dashboard.title}</AdminPageHeading>

      <DashboardFiltersBar
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
        <section className="rounded-2xl border border-ink/10 bg-card p-6 shadow-[var(--shadow-card)]">
          <h2 className="eyebrow mb-4 text-slate">{messages.dashboard.usageByMaterialTitle}</h2>
          <RankedBarChart data={usageByMaterial} emptyState={messages.dashboard.noDataInWindow} />
        </section>
        <section className="rounded-2xl border border-ink/10 bg-card p-6 shadow-[var(--shadow-card)]">
          <h2 className="eyebrow mb-4 text-slate">{messages.dashboard.usageByProductTitle}</h2>
          <RankedBarChart data={usageByProduct} emptyState={messages.dashboard.noDataInWindow} />
        </section>
      </div>

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
