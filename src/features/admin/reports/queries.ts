import 'server-only';
import { sql } from 'drizzle-orm';
import { db } from '@/db';

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
    .sort(
      (a, b) =>
        a.currentStock - a.lowStockThreshold - (b.currentStock - b.lowStockThreshold),
    );
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
