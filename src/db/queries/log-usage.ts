import 'server-only';
import { sql } from 'drizzle-orm';
import { db } from '@/db';

export type LogUsageResult = {
  before: number;
  after: number;
};

// Single atomic round trip via a raw SQL CTE — a deliberate exception to
// "always use the query builder". Reading current_stock, subtracting in app
// code, then writing it back would race: two workers scanning near-
// simultaneously could both read the same value and one update would be
// silently lost. `FOR UPDATE` serializes concurrent writers to the same
// material, and returning both before/after in one round trip is what makes
// the low-stock crossing check (didCrossLowStockThreshold) correct.
//
// `quantityDelta` is signed — negative for usage (stock going down).
// `productId` is the real storefront catalog's product id (e.g. "P010"),
// not a Postgres FK — see the comment on inventoryTransactions.productId in
// src/db/schema.ts. `productQuantity` is how much of that product this
// consumption produced (e.g. 500 for "500 litros").
export async function logUsageAtomic({
  materialId,
  quantityDelta,
  productId,
  productQuantity,
  loggedByUserId,
  note,
}: {
  materialId: string;
  quantityDelta: number;
  productId: string;
  productQuantity?: number;
  loggedByUserId: string;
  note?: string;
}): Promise<LogUsageResult> {
  const result = await db.execute<{ before: string; after: string }>(sql`
    WITH prev AS (
      SELECT current_stock FROM materials WHERE id = ${materialId} FOR UPDATE
    ),
    ins AS (
      INSERT INTO inventory_transactions
        (material_id, type, quantity, product_id, product_quantity, logged_by_user_id, logged_at, note)
      VALUES
        (${materialId}, 'usage', ${quantityDelta}, ${productId}, ${productQuantity ?? null}, ${loggedByUserId}, now(), ${note ?? null})
    ),
    upd AS (
      UPDATE materials
      SET current_stock = current_stock + ${quantityDelta}
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
