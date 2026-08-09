'use server';

import { revalidatePath } from 'next/cache';
import { put } from '@vercel/blob';
import { z } from 'zod';
import { db } from '@/db';
import { invoiceImports } from '@/db/schema';
import { restockAtomic } from '@/db/queries/restock';
import { extractInvoiceWithClaude, type InvoiceLineItem } from '@/lib/invoice-import/claude-extract';
import { extractPdfText } from '@/lib/invoice-import/extract-text';
import { guessQuantityMl } from '@/domain/inventory/unit-conversion';
import { requireAdmin } from '@/lib/auth/require-admin';
import { serverEnv } from '@/lib/env.server';

const MAX_INVOICE_FILE_BYTES = 10 * 1024 * 1024;
const PDF_MAGIC_BYTES = Buffer.from('%PDF-');

export type DraftLineItem = InvoiceLineItem & { matchedMaterialId: string | null; quantityMl: number };

export type ExtractState =
  | {
      success: true;
      fileName: string;
      fileUrl: string;
      supplierName: string | null;
      documentType: 'quote' | 'invoice' | 'unknown';
      lines: DraftLineItem[];
    }
  | { success?: false; error: string }
  | undefined;

// Nothing is written to materials/inventory_transactions here — only the
// source PDF is stored (regardless of what the admin does next) and the
// extraction is returned as a draft for the review dialog to edit. See
// confirmInvoiceRestock for the actual commit.
export async function extractInvoiceLineItems(_prevState: ExtractState, formData: FormData): Promise<ExtractState> {
  await requireAdmin();

  if (!serverEnv.ANTHROPIC_API_KEY || !serverEnv.BLOB_READ_WRITE_TOKEN) {
    return { error: 'not-configured' };
  }

  const file = formData.get('file');
  if (!(file instanceof File) || file.type !== 'application/pdf') {
    return { error: 'invalid-file' };
  }
  if (file.size > MAX_INVOICE_FILE_BYTES) {
    return { error: 'file-too-large' };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (!buffer.subarray(0, PDF_MAGIC_BYTES.length).equals(PDF_MAGIC_BYTES)) {
    return { error: 'invalid-file' };
  }

  const blob = await put(file.name, buffer, {
    access: 'private',
    addRandomSuffix: true,
    contentType: 'application/pdf',
    token: serverEnv.BLOB_READ_WRITE_TOKEN,
  });

  let extraction;
  try {
    const text = await extractPdfText(buffer);
    extraction = await extractInvoiceWithClaude(text);
  } catch (error) {
    console.error('Invoice extraction failed', error);
    return { error: 'extraction-failed' };
  }

  const lines: DraftLineItem[] = [];
  for (const item of extraction.lineItems) {
    const material = item.code
      ? await db.query.materials.findFirst({ where: (m, { eq }) => eq(m.code, item.code!) })
      : undefined;
    lines.push({
      ...item,
      matchedMaterialId: material?.id ?? null,
      quantityMl: guessQuantityMl(item.quantity, item.unit),
    });
  }

  return {
    success: true,
    fileName: file.name,
    fileUrl: blob.url,
    supplierName: extraction.supplierName,
    documentType: extraction.documentType,
    lines,
  };
}

const rowSchema = z.object({
  materialId: z.string().min(1),
  quantityMl: z.coerce.number().positive(),
  totalCost: z.coerce.number().nonnegative(),
});

export type ConfirmState = { error?: string; success?: boolean } | undefined;

export async function confirmInvoiceRestock(_prevState: ConfirmState, formData: FormData): Promise<ConfirmState> {
  const session = await requireAdmin();

  const fileName = formData.get('fileName');
  const fileUrl = formData.get('fileUrl');
  const supplierName = formData.get('supplierName');
  if (typeof fileName !== 'string' || typeof fileUrl !== 'string') {
    return { error: 'invalid' };
  }

  const rowCount = Number(formData.get('rowCount') ?? 0);
  const rows: z.infer<typeof rowSchema>[] = [];
  for (let i = 0; i < rowCount; i++) {
    const materialId = formData.get(`materialId_${i}`);
    if (!materialId) continue; // row removed or left unmatched by the admin

    const parsed = rowSchema.safeParse({
      materialId,
      quantityMl: formData.get(`quantityMl_${i}`),
      totalCost: formData.get(`totalCost_${i}`),
    });
    if (parsed.success) rows.push(parsed.data);
  }

  if (rows.length === 0) {
    return { error: 'no-rows' };
  }

  // One transaction for the import record + every restock row: a failure on
  // any row (e.g. a stale materialId) must roll back the whole import rather
  // than leaving a partially-applied invoice.
  await db.transaction(async (tx) => {
    const [importRow] = await tx
      .insert(invoiceImports)
      .values({
        fileName,
        fileUrl,
        supplierName: typeof supplierName === 'string' && supplierName ? supplierName : null,
        uploadedByUserId: session.user.id,
      })
      .returning();
    if (!importRow) {
      throw new Error('Failed to record invoice import');
    }

    for (const row of rows) {
      await restockAtomic({
        materialId: row.materialId,
        quantity: row.quantityMl,
        totalCost: row.totalCost,
        loggedByUserId: session.user.id,
        note: `Invoice import: ${fileName}`,
        invoiceImportId: importRow.id,
        tx,
      });
    }
  });

  revalidatePath('/admin/materials');
  revalidatePath('/admin/materials/import');
  revalidatePath('/admin/dashboard');
  return { success: true };
}
