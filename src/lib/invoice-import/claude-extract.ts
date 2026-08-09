import 'server-only';
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { serverEnv } from '@/lib/env.server';

const lineItemSchema = z.object({
  description: z.string(),
  code: z.string().nullable(),
  quantity: z.number(),
  unit: z.string(),
  unitPrice: z.number(),
  totalCost: z.number(),
});

const extractionSchema = z.object({
  supplierName: z.string().nullable(),
  documentType: z.enum(['quote', 'invoice', 'unknown']),
  lineItems: z.array(lineItemSchema),
});

export type InvoiceLineItem = z.infer<typeof lineItemSchema>;
export type InvoiceExtraction = z.infer<typeof extractionSchema>;

const EXTRACT_TOOL = {
  name: 'extract_invoice',
  description: 'Extract structured line items and metadata from a supplier invoice or quote.',
  input_schema: {
    type: 'object' as const,
    properties: {
      supplierName: {
        type: ['string', 'null'],
        description: 'The supplier/vendor company name, or null if not identifiable.',
      },
      documentType: {
        type: 'string',
        enum: ['quote', 'invoice', 'unknown'],
        description:
          "'quote' if the document is a price quotation/estimate (e.g. labeled COTIZACIÓN, has an offer-validity date), " +
          "'invoice' if it's a confirmed order/invoice/receipt of an actual transaction, 'unknown' if unclear.",
      },
      lineItems: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            description: { type: 'string', description: 'The product/material name as printed.' },
            code: { type: ['string', 'null'], description: "The supplier's item/product code, if printed." },
            quantity: { type: 'number' },
            unit: { type: 'string', description: "The unit as printed, e.g. 'KGM', 'ml', 'L', 'pza'." },
            unitPrice: { type: 'number' },
            totalCost: { type: 'number', description: 'The line total (quantity * unitPrice, or as printed).' },
          },
          required: ['description', 'code', 'quantity', 'unit', 'unitPrice', 'totalCost'],
        },
      },
    },
    required: ['supplierName', 'documentType', 'lineItems'],
  },
};

// Tool-use forces structured output — far more reliable than asking the
// model to emit prose JSON and hoping it parses. Response is still
// zod-validated: never trust an LLM's output shape blindly.
export async function extractInvoiceWithClaude(text: string): Promise<InvoiceExtraction> {
  if (!serverEnv.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not configured — invoice import is unavailable until it is set.');
  }

  const client = new Anthropic({ apiKey: serverEnv.ANTHROPIC_API_KEY });

  const response = await client.messages.create({
    model: 'claude-sonnet-5',
    max_tokens: 4096,
    tools: [EXTRACT_TOOL],
    tool_choice: { type: 'tool', name: 'extract_invoice' },
    messages: [
      {
        role: 'user',
        content: `Extract the line items and metadata from this supplier invoice/quote text (from a fragrance/cleaning-products supplier in Mexico — descriptions and units may be in Spanish):\n\n${text}`,
      },
    ],
  });

  const toolUse = response.content.find((block) => block.type === 'tool_use');
  if (!toolUse || toolUse.type !== 'tool_use') {
    throw new Error('Claude did not return a structured extraction');
  }

  return extractionSchema.parse(toolUse.input);
}
