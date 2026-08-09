import 'server-only';
import { sql } from 'drizzle-orm';
import { db } from '@/db';

export type AdjustStockResult = {
  before: number;
  after: number;
};

// Same atomic FOR UPDATE CTE pattern as logUsageAtomic (see log-usage.ts).
// A physical count sets stock to an absolute counted value, but the ledger
// still records a signed delta — computed inside the CTE from the locked
// `prev.current_stock`, not read-then-subtracted in JS, so there's no race
// with a concurrent usage/restock write to the same material.
export async function adjustStockAtomic({
  materialId,
  countedStock,
  loggedByUserId,
  note,
}: {
  materialId: string;
  countedStock: number;
  loggedByUserId: string;
  note?: string;
}): Promise<AdjustStockResult> {
  const result = await db.execute<{ before: string; after: string }>(sql`
    WITH prev AS (
      SELECT current_stock FROM materials WHERE id = ${materialId} FOR UPDATE
    ),
    ins AS (
      INSERT INTO inventory_transactions
        (material_id, type, quantity, logged_by_user_id, logged_at, note)
      SELECT ${materialId}, 'adjustment', ${countedStock} - prev.current_stock, ${loggedByUserId}, now(), ${note ?? null}
      FROM prev
    ),
    upd AS (
      UPDATE materials
      SET current_stock = ${countedStock}
      WHERE id = ${materialId}
      RETURNING current_stock
    )
    SELECT prev.current_stock AS before, upd.current_stock AS after FROM prev, upd;
  `);

  const row = result.rows[0];
  if (!row) {
    throw new Error(`Material ${materialId} not found`);
  }
  return { before: Number(row.before), after: Number(row.after) };
}
