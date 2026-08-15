'use server';

import { revalidatePath } from 'next/cache';
import { and, eq, isNull } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db';
import { inventoryTransactions } from '@/db/schema';
import { logUsageAtomic } from '@/db/queries/log-usage';
import { didCrossLowStockThreshold } from '@/domain/inventory/stock';
import { getProductById } from '@/domain/product/repository';
import { auth } from '@/lib/auth/auth';
import { requireAdmin } from '@/lib/auth/require-admin';
import { sendLowStockAlert } from '@/lib/email/low-stock-alert';

const logUsageSchema = z.object({
  nfcTagId: z.string().min(1),
  amountMl: z.coerce.number().positive(),
  // Validated against the real storefront catalog (data/catalog.csv), not a
  // uuid — see the comment on inventoryTransactions.productId in schema.ts.
  productId: z.string().min(1).refine((id) => getProductById(id) !== undefined, {
    message: 'Unknown product',
  }),
  productQuantity: z.coerce.number().positive().optional(),
});

export type LogUsageState = { error?: string; success?: boolean } | undefined;

// Callable by both worker and admin sessions — the NFC tap flow is the whole
// point of the tool. Tags live on the shelf and get re-linked to different
// materials without reprinting, so the tag -> material resolution happens
// here, server-side, on every call rather than trusting a client-supplied id.
export async function logUsage(_prevState: LogUsageState, formData: FormData): Promise<LogUsageState> {
  const session = await auth();
  if (!session?.user) {
    return { error: 'unauthorized' };
  }

  const parsed = logUsageSchema.safeParse({
    nfcTagId: formData.get('nfcTagId'),
    amountMl: formData.get('amountMl'),
    productId: formData.get('productId'),
    productQuantity: formData.get('productQuantity') || undefined,
  });
  if (!parsed.success) {
    return { error: 'invalid' };
  }

  const material = await db.query.materials.findFirst({
    where: (m, { eq }) => eq(m.nfcTagId, parsed.data.nfcTagId),
  });
  if (!material) {
    return { error: 'unknown-tag' };
  }

  const { before, after } = await logUsageAtomic({
    materialId: material.id,
    quantityDelta: -parsed.data.amountMl,
    productId: parsed.data.productId,
    productQuantity: parsed.data.productQuantity,
    loggedByUserId: session.user.id,
  });

  const threshold = Number(material.lowStockThreshold);
  if (didCrossLowStockThreshold(before, after, threshold)) {
    try {
      await sendLowStockAlert({
        materialName: material.name,
        currentStock: after,
        unit: material.unit,
        threshold,
      });
    } catch (error) {
      // An email-send failure must not block the worker's tap-to-log flow — the
      // usage transaction already committed above.
      console.error('Failed to send low-stock alert', error);
    }
  }

  revalidatePath(`/admin/log/${parsed.data.nfcTagId}`);
  return { success: true };
}

const voidUsageSchema = z.object({
  transactionId: z.string().uuid(),
});

// Excludes a mistaken usage entry from every usage-based dashboard aggregate
// without editing or deleting the row (see schema.ts's comment on
// voidedAt) — deliberately never touches materials.currentStock, since a
// void corrects historical reporting for a mistake whose stock impact was
// already fixed separately (typically via a physical count adjustment).
export async function voidUsageEntry(formData: FormData) {
  const session = await requireAdmin();

  const parsed = voidUsageSchema.parse({ transactionId: formData.get('transactionId') });

  const [updated] = await db
    .update(inventoryTransactions)
    .set({ voidedAt: new Date(), voidedByUserId: session.user.id })
    .where(
      and(
        eq(inventoryTransactions.id, parsed.transactionId),
        eq(inventoryTransactions.type, 'usage'),
        isNull(inventoryTransactions.voidedAt),
      ),
    )
    .returning();

  if (!updated) {
    throw new Error('Entry not found, not a usage entry, or already voided');
  }

  revalidatePath('/admin/materials');
  revalidatePath(`/admin/materials/${updated.materialId}`);
  revalidatePath('/admin/dashboard');
}
