import { describe, expect, it } from 'vitest';

// Same deferred-import pattern as log-usage.concurrency.test.ts — see that
// file's comment for why.
describe.skipIf(!process.env.DATABASE_URL)('restockAtomic composed in an outer transaction', () => {
  it('rolls back every row when one row in the batch fails', async () => {
    const { eq } = await import('drizzle-orm');
    const { db } = await import('@/db');
    const { materials, inventoryTransactions } = await import('@/db/schema');
    const { restockAtomic } = await import('./restock');

    const suffix = Date.now();
    const [user] = await db.query.users.findMany({ limit: 1 });
    if (!user) {
      throw new Error('Expected at least one seeded user to run this test — run `pnpm db:seed` first.');
    }

    const [material] = await db
      .insert(materials)
      .values({
        name: `restock-tx-test-material-${suffix}`,
        unit: 'ml',
        currentStock: '100',
        lowStockThreshold: '10',
      })
      .returning();
    if (!material) {
      throw new Error('Failed to seed test material');
    }

    try {
      // Mirrors confirmInvoiceRestock: a batch of restock rows composed into
      // one outer transaction via the `tx` param, where a later row throws
      // (unknown materialId) — the earlier, otherwise-valid row must not
      // stick if this were still per-row transactions like before the fix.
      await expect(
        db.transaction(async (tx) => {
          await restockAtomic({
            materialId: material.id,
            quantity: 50,
            totalCost: 25,
            loggedByUserId: user.id,
            tx,
          });
          await restockAtomic({
            materialId: 'does-not-exist',
            quantity: 1,
            totalCost: 1,
            loggedByUserId: user.id,
            tx,
          });
        }),
      ).rejects.toThrow();

      const [reloaded] = await db.select().from(materials).where(eq(materials.id, material.id));
      expect(Number(reloaded?.currentStock)).toBe(100);

      const ledgerRows = await db
        .select()
        .from(inventoryTransactions)
        .where(eq(inventoryTransactions.materialId, material.id));
      expect(ledgerRows).toHaveLength(0);
    } finally {
      await db.delete(inventoryTransactions).where(eq(inventoryTransactions.materialId, material.id));
      await db.delete(materials).where(eq(materials.id, material.id));
    }
  });
});
