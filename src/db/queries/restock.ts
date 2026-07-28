import 'server-only';
import { sql } from 'drizzle-orm';
import { db } from '@/db';
import { computeWeightedAvgCost } from '@/domain/inventory/cost';

export type RestockResult = {
  currentStock: number;
  weightedAvgCost: number;
};

// Locks the material row for the duration of the transaction so a restock
// can never race with a concurrent usage scan or another restock reading a
// stale currentStock/weightedAvgCost pair — same FOR UPDATE principle as
// log-usage.ts, just spanning a read + JS-computed write instead of a single
// CTE, since the weighted-average formula is easier to keep correct (and
// independently testable, see src/domain/inventory/cost.ts) in application
// code than as inline SQL.
export async function restockAtomic({
  materialId,
  quantity,
  totalCost,
  loggedByUserId,
  note,
}: {
  materialId: string;
  quantity: number;
  totalCost: number;
  loggedByUserId: string;
  note?: string;
}): Promise<RestockResult> {
  return db.transaction(async (tx) => {
    const lockResult = await tx.execute<{ current_stock: string; weighted_avg_cost: string }>(
      sql`SELECT current_stock, weighted_avg_cost FROM materials WHERE id = ${materialId} FOR UPDATE`,
    );
    const row = lockResult.rows[0];
    if (!row) {
      throw new Error(`Material ${materialId} not found`);
    }

    const currentStock = Number(row.current_stock);
    const newAvgCost = computeWeightedAvgCost({
      currentStock,
      oldAvgCost: Number(row.weighted_avg_cost),
      restockQuantity: quantity,
      totalCost,
    });
    const newStock = currentStock + quantity;

    await tx.execute(sql`
      INSERT INTO inventory_transactions
        (material_id, type, quantity, total_cost, logged_by_user_id, logged_at, note)
      VALUES
        (${materialId}, 'restock', ${quantity}, ${totalCost}, ${loggedByUserId}, now(), ${note ?? null})
    `);
    await tx.execute(sql`
      UPDATE materials
      SET current_stock = ${newStock}, weighted_avg_cost = ${newAvgCost}
      WHERE id = ${materialId}
    `);

    return { currentStock: newStock, weightedAvgCost: newAvgCost };
  });
}
