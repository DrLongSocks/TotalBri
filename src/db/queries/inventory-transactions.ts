import 'server-only';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { inventoryTransactions } from '@/db/schema';

// Most recent usage entries for a material, including already-voided ones —
// the material detail page shows both so an admin can see what's been
// voided, not just what's still active.
export async function getRecentUsageForMaterial(materialId: string, limit = 15) {
  return db.query.inventoryTransactions.findMany({
    where: and(eq(inventoryTransactions.materialId, materialId), eq(inventoryTransactions.type, 'usage')),
    orderBy: desc(inventoryTransactions.loggedAt),
    limit,
    with: { loggedByUser: true },
  });
}
