import { describe, expect, it } from 'vitest';

// Deferred imports: `@/db` pulls in `env.server.ts`, which validates the full
// server env (auth/email secrets included), not just DATABASE_URL. Importing
// it at module scope would crash test discovery in any environment missing
// those — a static top-level import would defeat the point of skipIf below.
describe.skipIf(!process.env.DATABASE_URL)('logUsageAtomic concurrency', () => {
  it('never loses an update under many concurrent calls to the same material', async () => {
    const { eq } = await import('drizzle-orm');
    const { db } = await import('@/db');
    const { materials, products, inventoryTransactions } = await import('@/db/schema');
    const { logUsageAtomic } = await import('./log-usage');

    const suffix = Date.now();
    const [product] = await db
      .insert(products)
      .values({ name: `concurrency-test-product-${suffix}` })
      .returning();
    const [user] = await db.query.users.findMany({ limit: 1 });
    if (!product || !user) {
      throw new Error('Expected at least one seeded user to run this test — run `pnpm db:seed` first.');
    }

    const [material] = await db
      .insert(materials)
      .values({
        name: `concurrency-test-material-${suffix}`,
        unit: 'ml',
        currentStock: '10000',
        lowStockThreshold: '100',
      })
      .returning();
    if (!material) {
      throw new Error('Failed to seed test material');
    }

    const CONCURRENT_CALLS = 20;
    const DELTA = -10;

    try {
      await Promise.all(
        Array.from({ length: CONCURRENT_CALLS }, () =>
          logUsageAtomic({
            materialId: material.id,
            quantityDelta: DELTA,
            productId: product.id,
            loggedByUserId: user.id,
          }),
        ),
      );

      const [updated] = await db.select().from(materials).where(eq(materials.id, material.id));
      expect(Number(updated?.currentStock)).toBe(10000 + DELTA * CONCURRENT_CALLS);
    } finally {
      await db.delete(inventoryTransactions).where(eq(inventoryTransactions.materialId, material.id));
      await db.delete(materials).where(eq(materials.id, material.id));
      await db.delete(products).where(eq(products.id, product.id));
    }
  });
});
