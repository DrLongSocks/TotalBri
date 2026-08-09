import 'server-only';
import { sql } from 'drizzle-orm';
import { db } from '@/db';
import { getMaterialsSortedByName } from '@/db/queries/materials';
import type { DashboardFilters } from '@/domain/inventory/dashboard-filters';
import { daysUntilStockout, type DaysUntilStockout } from '@/domain/inventory/stockout';
import { getProductById } from '@/domain/product/repository';

export type StockRow = {
  id: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  lowStockThreshold: number;
};

// Sorted by proximity to threshold (most at-risk first) — a material already
// at or below threshold sorts to the very top since that distance is <= 0.
export async function getStockOverview(): Promise<StockRow[]> {
  const rows = await db.query.materials.findMany();
  return rows
    .map((material) => ({
      id: material.id,
      name: material.name,
      category: material.category,
      unit: material.unit,
      currentStock: Number(material.currentStock),
      lowStockThreshold: Number(material.lowStockThreshold),
    }))
    .sort((a, b) => a.currentStock - a.lowStockThreshold - (b.currentStock - b.lowStockThreshold));
}

export async function getMaterialOptions(): Promise<{ id: string; name: string }[]> {
  const rows = await getMaterialsSortedByName();
  return rows.map((m) => ({ id: m.id, name: m.name }));
}

export type UsageTrendPoint = { day: string; usageMl: number };

// Zero-filled day range (via generate_series) so the chart's x-axis has no
// gaps on days with no logged usage — a missing point would otherwise read
// as a data error rather than "nothing scanned that day".
export async function getUsageTrend(days = 30): Promise<UsageTrendPoint[]> {
  const result = await db.execute<{ day: string; usage_ml: string }>(sql`
    SELECT gs.day::date AS day, COALESCE(SUM(-it.quantity), 0) AS usage_ml
    FROM generate_series(
      CURRENT_DATE - (INTERVAL '1 day' * ${days - 1}),
      CURRENT_DATE,
      INTERVAL '1 day'
    ) AS gs(day)
    LEFT JOIN inventory_transactions it
      ON it.type = 'usage' AND date_trunc('day', it.logged_at) = gs.day
    GROUP BY gs.day
    ORDER BY gs.day;
  `);
  return result.rows.map((row) => ({ day: row.day, usageMl: Number(row.usage_ml) }));
}

function materialFilterFragment(materialId?: string) {
  return materialId ? sql`AND material_id = ${materialId}` : sql``;
}

// Card 2 — days until stockout per material. Deliberately a fixed trailing
// 14-day window, independent of the dashboard's own date-range filter: this
// is about "how much runway is left right now," not a historical report.
export type StockoutRow = {
  materialId: string;
  materialName: string;
  unit: string;
  currentStock: number;
  result: DaysUntilStockout;
};

export async function getDaysUntilStockout(materialId?: string): Promise<StockoutRow[]> {
  const result = await db.execute<{
    id: string;
    name: string;
    unit: string;
    current_stock: string;
    avg_daily_usage: string;
    usage_days: string;
  }>(sql`
    SELECT
      m.id, m.name, m.unit, m.current_stock,
      COALESCE(SUM(-it.quantity) FILTER (
        WHERE it.type = 'usage' AND it.logged_at >= now() - interval '14 days'
      ), 0) / 14.0 AS avg_daily_usage,
      COUNT(DISTINCT date_trunc('day', it.logged_at)) FILTER (
        WHERE it.type = 'usage' AND it.logged_at >= now() - interval '14 days'
      ) AS usage_days
    FROM materials m
    LEFT JOIN inventory_transactions it ON it.material_id = m.id
    WHERE ${materialId ? sql`m.id = ${materialId}` : sql`true`}
    GROUP BY m.id, m.name, m.unit, m.current_stock
    ORDER BY m.name
  `);

  return result.rows.map((row) => ({
    materialId: row.id,
    materialName: row.name,
    unit: row.unit,
    currentStock: Number(row.current_stock),
    result: daysUntilStockout({
      currentStock: Number(row.current_stock),
      avgDailyUsage: Number(row.avg_daily_usage),
      usageDaysInWindow: Number(row.usage_days),
    }),
  }));
}

// Card 3 — total fragrance volume used in the selected window.
export async function getTotalVolumeUsed(filters: DashboardFilters): Promise<number> {
  const result = await db.execute<{ total: string }>(sql`
    SELECT COALESCE(SUM(-quantity), 0) AS total
    FROM inventory_transactions
    WHERE type = 'usage' AND logged_at >= ${filters.from} AND logged_at <= ${filters.to}
    ${materialFilterFragment(filters.materialId)}
  `);
  return Number(result.rows[0]?.total ?? 0);
}

// Card 4 — distinct fragrances touched today.
export async function getDistinctFragrancesToday(): Promise<number> {
  const result = await db.execute<{ count: string }>(sql`
    SELECT COUNT(DISTINCT material_id) AS count
    FROM inventory_transactions
    WHERE type = 'usage'
      AND logged_at >= date_trunc('day', now())
      AND logged_at < date_trunc('day', now()) + interval '1 day'
  `);
  return Number(result.rows[0]?.count ?? 0);
}

// Card 5 — products made by quantity in the selected window. Aggregated in
// Postgres by the catalog's text id, then resolved to names in application
// code — there's no way to join a Postgres table against the CSV-backed
// storefront catalog in one query.
export type ProductMadeRow = {
  productId: string;
  productName: string;
  unit: 'litro' | 'pieza' | 'kilo';
  totalQuantity: number;
};

export async function getProductsMade(filters: DashboardFilters): Promise<ProductMadeRow[]> {
  const result = await db.execute<{ product_id: string; total: string }>(sql`
    SELECT product_id, COALESCE(SUM(product_quantity), 0) AS total
    FROM inventory_transactions
    WHERE type = 'usage' AND product_id IS NOT NULL
      AND logged_at >= ${filters.from} AND logged_at <= ${filters.to}
      ${materialFilterFragment(filters.materialId)}
    GROUP BY product_id
    ORDER BY total DESC
  `);

  return result.rows
    .map((row) => {
      const product = getProductById(row.product_id);
      if (!product) return null;
      return {
        productId: row.product_id,
        productName: product.name.es,
        unit: product.unit,
        totalQuantity: Number(row.total),
      };
    })
    .filter((row): row is ProductMadeRow => row !== null);
}

// Card 6 — usage ranked by material and by product in the selected window
// (a ranked bar chart reads better than a multi-line time series once there
// are more than a handful of materials — see the dataviz "too many series"
// anti-pattern).
export type RankedVolumeRow = { label: string; totalMl: number };

export async function getUsageByMaterial(filters: DashboardFilters, limit = 8): Promise<RankedVolumeRow[]> {
  const result = await db.execute<{ name: string; total: string }>(sql`
    SELECT m.name, COALESCE(SUM(-it.quantity), 0) AS total
    FROM inventory_transactions it
    JOIN materials m ON m.id = it.material_id
    WHERE it.type = 'usage' AND it.logged_at >= ${filters.from} AND it.logged_at <= ${filters.to}
    ${materialFilterFragment(filters.materialId)}
    GROUP BY m.name
    ORDER BY total DESC
    LIMIT ${limit}
  `);
  return result.rows.map((row) => ({ label: row.name, totalMl: Number(row.total) }));
}

export async function getUsageByProduct(filters: DashboardFilters, limit = 8): Promise<RankedVolumeRow[]> {
  const products = await getProductsMade(filters);
  return products.slice(0, limit).map((row) => ({ label: row.productName, totalMl: row.totalQuantity }));
}

// Card 7 — fragrance used per unit of product produced, per usage entry.
export type RatioPoint = { loggedAt: string; ratio: number };

export async function getFragrancePerUnitPoints(productId: string, limit = 30): Promise<RatioPoint[]> {
  const result = await db.execute<{ logged_at: string; quantity: string; product_quantity: string }>(sql`
    SELECT logged_at, quantity, product_quantity
    FROM inventory_transactions
    WHERE type = 'usage' AND product_id = ${productId} AND product_quantity IS NOT NULL
    ORDER BY logged_at DESC
    LIMIT ${limit}
  `);
  return result.rows
    .map((row) => ({
      loggedAt: row.logged_at,
      ratio: -Number(row.quantity) / Number(row.product_quantity),
    }))
    .reverse();
}

// Card 8 — per-worker log volume in the selected window.
export type WorkerVolumeRow = { userId: string; userName: string; logCount: number; totalMl: number };

export async function getWorkerVolume(filters: DashboardFilters): Promise<WorkerVolumeRow[]> {
  const result = await db.execute<{ id: string; name: string; log_count: string; total_ml: string }>(sql`
    SELECT u.id, u.name, COUNT(it.id) AS log_count,
      COALESCE(SUM(-it.quantity) FILTER (WHERE it.type = 'usage'), 0) AS total_ml
    FROM inventory_transactions it
    JOIN users u ON u.id = it.logged_by_user_id
    WHERE it.logged_at >= ${filters.from} AND it.logged_at <= ${filters.to}
    GROUP BY u.id, u.name
    ORDER BY log_count DESC
  `);
  return result.rows.map((row) => ({
    userId: row.id,
    userName: row.name,
    logCount: Number(row.log_count),
    totalMl: Number(row.total_ml),
  }));
}

// Card 9 — restock frequency per material.
export type RestockRow = { materialId: string; materialName: string; count: number; dates: string[] };

export async function getRestockFrequency(): Promise<RestockRow[]> {
  // json_agg rather than array_agg: the node-postgres driver reliably parses
  // a JSON aggregate into a real JS array, whereas a raw Postgres array
  // value from an aggregate came back as an unparsed string in practice.
  const result = await db.execute<{ id: string; name: string; count: string; dates: string[] }>(sql`
    SELECT m.id, m.name, COUNT(it.id) AS count,
      COALESCE(
        json_agg(it.logged_at ORDER BY it.logged_at DESC) FILTER (WHERE it.id IS NOT NULL),
        '[]'::json
      ) AS dates
    FROM materials m
    LEFT JOIN inventory_transactions it ON it.material_id = m.id AND it.type = 'restock'
    GROUP BY m.id, m.name
    HAVING COUNT(it.id) > 0
    ORDER BY m.name
  `);
  return result.rows.map((row) => ({
    materialId: row.id,
    materialName: row.name,
    count: Number(row.count),
    dates: row.dates,
  }));
}

// Card 10 — adjustment/correction count. Always 0 today: the spec never
// describes an adjustment-creation flow (only usage and restock), so this
// stays honest rather than fabricating one.
export async function getAdjustmentCount(): Promise<number> {
  const result = await db.execute<{ count: string }>(sql`
    SELECT COUNT(*) AS count FROM inventory_transactions WHERE type = 'adjustment'
  `);
  return Number(result.rows[0]?.count ?? 0);
}

// Card 11 — top consumed materials and products, ranked, in the selected window.
export async function getTopConsumedMaterials(filters: DashboardFilters, limit = 5): Promise<RankedVolumeRow[]> {
  return getUsageByMaterial(filters, limit);
}

export async function getTopConsumedProducts(filters: DashboardFilters, limit = 5): Promise<RankedVolumeRow[]> {
  return getUsageByProduct(filters, limit);
}

// Card 12 — current dollar value of inventory. `hasCost` gates the "Costo no
// registrado aún" empty state per material until at least one restock.
export type InventoryValueRow = {
  materialId: string;
  materialName: string;
  currentStock: number;
  weightedAvgCost: number;
  value: number;
  hasCost: boolean;
};

export async function getInventoryValue(): Promise<{ rows: InventoryValueRow[]; total: number }> {
  const materials = await getMaterialsSortedByName();
  const rows = materials.map((m) => {
    const currentStock = Number(m.currentStock);
    const weightedAvgCost = Number(m.weightedAvgCost);
    return {
      materialId: m.id,
      materialName: m.name,
      currentStock,
      weightedAvgCost,
      value: currentStock * weightedAvgCost,
      hasCost: weightedAvgCost > 0,
    };
  });
  const total = rows.filter((r) => r.hasCost).reduce((sum, r) => sum + r.value, 0);
  return { rows, total };
}

// Card 13 — dollar burn rate over the selected window. Approximation: the
// schema doesn't snapshot cost-per-unit on each usage row, so this applies
// each material's *current* weightedAvgCost to however much of it was used
// in the window, rather than the (unrecorded) cost at the time of use.
// Materials with no recorded cost yet are excluded and called out, same
// empty-state dependency as card 12.
export async function getBurnRate(filters: DashboardFilters): Promise<{
  total: number;
  excludedMaterialCount: number;
}> {
  const result = await db.execute<{ material_id: string; used: string }>(sql`
    SELECT material_id, COALESCE(SUM(-quantity), 0) AS used
    FROM inventory_transactions
    WHERE type = 'usage' AND logged_at >= ${filters.from} AND logged_at <= ${filters.to}
    GROUP BY material_id
  `);

  const materials = await db.query.materials.findMany();
  const costByMaterial = new Map(materials.map((m) => [m.id, Number(m.weightedAvgCost)]));

  let total = 0;
  let excludedMaterialCount = 0;
  for (const row of result.rows) {
    const cost = costByMaterial.get(row.material_id) ?? 0;
    if (cost > 0) {
      total += Number(row.used) * cost;
    } else {
      excludedMaterialCount += 1;
    }
  }
  return { total, excludedMaterialCount };
}
