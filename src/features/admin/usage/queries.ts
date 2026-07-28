import 'server-only';
import { sql } from 'drizzle-orm';
import { db } from '@/db';

// Most-recently-used products for a material, most recent first — shown in
// the log flow's product combobox before the worker types anything.
export async function getRecentProductIdsForMaterial(materialId: string, limit = 5): Promise<string[]> {
  const result = await db.execute<{ product_id: string }>(sql`
    SELECT product_id
    FROM inventory_transactions
    WHERE material_id = ${materialId} AND type = 'usage' AND product_id IS NOT NULL
    GROUP BY product_id
    ORDER BY MAX(logged_at) DESC
    LIMIT ${limit}
  `);
  return result.rows.map((row) => row.product_id);
}
