'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from '@/db';
import { logUsageAtomic } from '@/db/queries/log-usage';
import { didCrossLowStockThreshold } from '@/domain/inventory/stock';
import { auth } from '@/lib/auth/auth';
import { sendLowStockAlert } from '@/lib/email/low-stock-alert';

const logUsageSchema = z.object({
  nfcTagId: z.string().min(1),
  amountMl: z.coerce.number().positive(),
  productId: z.string().uuid(),
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
      // A Resend outage must not block the worker's tap-to-log flow — the
      // usage transaction already committed above.
      console.error('Failed to send low-stock alert', error);
    }
  }

  revalidatePath(`/log/${parsed.data.nfcTagId}`);
  return { success: true };
}
