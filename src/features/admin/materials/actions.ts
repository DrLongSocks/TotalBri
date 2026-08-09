'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db';
import { materials } from '@/db/schema';
import { adjustStockAtomic } from '@/db/queries/adjust-stock';
import { restockAtomic } from '@/db/queries/restock';
import { requireAdmin } from '@/lib/auth/require-admin';

const createMaterialSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  unit: z.string().min(1),
  currentStock: z.coerce.number().nonnegative(),
  lowStockThreshold: z.coerce.number().nonnegative(),
  provider: z.string().min(1).optional(),
  code: z.string().min(1).optional(),
  nfcTagId: z.string().min(1).optional(),
});

export async function createMaterial(formData: FormData) {
  await requireAdmin();

  const parsed = createMaterialSchema.parse({
    name: formData.get('name'),
    category: formData.get('category'),
    unit: formData.get('unit'),
    currentStock: formData.get('currentStock'),
    lowStockThreshold: formData.get('lowStockThreshold'),
    provider: formData.get('provider') || undefined,
    code: formData.get('code') || undefined,
    nfcTagId: formData.get('nfcTagId') || undefined,
  });

  await db.insert(materials).values({
    name: parsed.name,
    category: parsed.category,
    unit: parsed.unit,
    currentStock: String(parsed.currentStock),
    lowStockThreshold: String(parsed.lowStockThreshold),
    provider: parsed.provider ?? null,
    code: parsed.code ?? null,
    nfcTagId: parsed.nfcTagId ?? null,
  });

  revalidatePath('/admin/materials');
}

const updateMaterialSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  unit: z.string().min(1),
  lowStockThreshold: z.coerce.number().nonnegative(),
  provider: z.string().min(1).optional(),
  code: z.string().min(1).optional(),
});

// Deliberately does not touch `currentStock` — it's a running total derived
// from `inventory_transactions`, not a field an admin edits directly.
export async function updateMaterial(materialId: string, formData: FormData) {
  await requireAdmin();

  const parsed = updateMaterialSchema.parse({
    name: formData.get('name'),
    category: formData.get('category'),
    unit: formData.get('unit'),
    lowStockThreshold: formData.get('lowStockThreshold'),
    provider: formData.get('provider') || undefined,
    code: formData.get('code') || undefined,
  });

  await db
    .update(materials)
    .set({
      name: parsed.name,
      category: parsed.category,
      unit: parsed.unit,
      lowStockThreshold: String(parsed.lowStockThreshold),
      provider: parsed.provider ?? null,
      code: parsed.code ?? null,
    })
    .where(eq(materials.id, materialId));

  revalidatePath('/admin/materials');
  revalidatePath(`/admin/materials/${materialId}`);
}

const relinkNfcTagSchema = z.object({
  nfcTagId: z.string().min(1),
});

export async function relinkNfcTag(materialId: string, formData: FormData) {
  await requireAdmin();

  const parsed = relinkNfcTagSchema.parse({
    nfcTagId: formData.get('nfcTagId'),
  });

  await db.update(materials).set({ nfcTagId: parsed.nfcTagId }).where(eq(materials.id, materialId));

  revalidatePath('/admin/materials');
  revalidatePath(`/admin/materials/${materialId}`);
}

const createRestockSchema = z.object({
  quantity: z.coerce.number().positive(),
  totalCost: z.coerce.number().nonnegative(),
});

export async function createRestock(materialId: string, formData: FormData) {
  const session = await requireAdmin();

  const parsed = createRestockSchema.parse({
    quantity: formData.get('quantity'),
    totalCost: formData.get('totalCost'),
  });

  await restockAtomic({
    materialId,
    quantity: parsed.quantity,
    totalCost: parsed.totalCost,
    loggedByUserId: session.user.id,
  });

  revalidatePath('/admin/materials');
  revalidatePath(`/admin/materials/${materialId}`);
  revalidatePath('/admin/dashboard');
}

const countFieldSchema = z.coerce.number().nonnegative();

// A physical count enters an absolute counted value per material, not a
// delta — blank fields are skipped so an admin only corrects what they
// actually recounted this session, never zeroing out materials they left
// untouched. Sequential per-material atomic calls, same as restock/usage —
// this is a low-frequency admin operation, not a concurrency hot path.
export async function recordInventoryCount(formData: FormData) {
  const session = await requireAdmin();

  const entries = Array.from(formData.entries()).filter(
    (entry): entry is [string, string] => entry[0].startsWith('count_') && entry[1] !== '',
  );

  for (const [key, rawValue] of entries) {
    const materialId = key.slice('count_'.length);
    const parsed = countFieldSchema.safeParse(rawValue);
    if (!parsed.success) continue;

    await adjustStockAtomic({
      materialId,
      countedStock: parsed.data,
      loggedByUserId: session.user.id,
      note: 'Physical count',
    });
  }

  revalidatePath('/admin/materials');
  revalidatePath('/admin/materials/count');
  revalidatePath('/admin/dashboard');
}
