import { relations } from 'drizzle-orm';
import { index, numeric, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';

export const userRole = pgEnum('user_role', ['admin', 'worker']);
export const transactionType = pgEnum('transaction_type', ['usage', 'restock', 'adjustment']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: varchar('email', { length: 320 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: userRole('role').notNull().default('worker'),
  // Set on removal instead of deleting the row: `inventory_transactions.logged_by_user_id`
  // is a NOT NULL FK with no cascade, so a worker who ever logged a scan can't be
  // hard-deleted without breaking the ledger. A disabled user is blocked at login
  // (see authorize() in lib/auth/auth.ts) but their history stays intact.
  disabledAt: timestamp('disabled_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// `category` and `unit` are plain text, not enums, on purpose: new material
// categories/units must be addable by inserting a row, never a migration.
export const materials = pgTable(
  'materials',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    category: text('category').notNull().default('fragrance'),
    unit: varchar('unit', { length: 20 }).notNull(),
    currentStock: numeric('current_stock', { precision: 12, scale: 2 }).notNull().default('0'),
    // Weighted-average cost per unit, recomputed on every restock:
    // (currentStock * oldAvgCost + totalCost) / (currentStock + restockQuantity).
    // See src/domain/inventory/cost.ts. Stays 0 — and dashboard cards show
    // "Costo no registrado aún" — until a material has at least one restock.
    weightedAvgCost: numeric('weighted_avg_cost', { precision: 12, scale: 4 }).notNull().default('0'),
    lowStockThreshold: numeric('low_stock_threshold', { precision: 12, scale: 2 }).notNull(),
    provider: text('provider'),
    // Supplier's own product/reference code — not every material has one.
    code: text('code'),
    nfcTagId: text('nfc_tag_id'),
    locationId: uuid('location_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    // Nullable + unique: two materials can never claim the same physical tag,
    // and Postgres treats multiple NULLs as distinct so unassigned rows are fine.
    uniqueIndex('materials_nfc_tag_id_unique').on(table.nfcTagId),
  ],
);

// Append-only ledger — the source of truth for stock. Never update or delete
// a row; corrections are offsetting 'adjustment' inserts.
export const inventoryTransactions = pgTable(
  'inventory_transactions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    materialId: uuid('material_id')
      .notNull()
      .references(() => materials.id),
    type: transactionType('type').notNull(),
    quantity: numeric('quantity', { precision: 12, scale: 2 }).notNull(),
    // References the real storefront catalog's product id (e.g. "P001",
    // data/catalog.csv via src/domain/product/repository.ts) — a plain text
    // column, not a DB-level FK, since that catalog is file-backed, not a
    // Postgres table. Validated at write time against the loaded catalog.
    productId: text('product_id'),
    // Set only when type='usage': how much of the product this consumption
    // produced (e.g. 500 for "500 litros"). Powers the products-made and
    // fragrance-per-unit dashboard cards.
    productQuantity: numeric('product_quantity', { precision: 12, scale: 2 }),
    // Set only when type='restock': total invoice cost, feeds computeWeightedAvgCost.
    totalCost: numeric('total_cost', { precision: 12, scale: 2 }),
    loggedByUserId: uuid('logged_by_user_id')
      .notNull()
      .references(() => users.id),
    loggedAt: timestamp('logged_at', { withTimezone: true }).notNull().defaultNow(),
    note: text('note'),
    // Set only when this restock came from the PDF invoice import flow —
    // traces the ledger row back to the source document.
    invoiceImportId: uuid('invoice_import_id').references(() => invoiceImports.id),
    // Voiding excludes a mistaken 'usage' row from every usage-based
    // dashboard aggregate (see the queries filtering type = 'usage') without
    // editing or deleting it, and deliberately never touches
    // materials.currentStock — a void corrects historical reporting for a
    // mistake whose stock impact was already fixed separately (typically via
    // a physical count adjustment). Nullable: most rows are never voided.
    voidedAt: timestamp('voided_at', { withTimezone: true }),
    voidedByUserId: uuid('voided_by_user_id').references(() => users.id),
  },
  (table) => [
    index('inventory_transactions_material_logged_at').on(table.materialId, table.loggedAt),
    index('inventory_transactions_product_logged_at').on(table.productId, table.loggedAt),
  ],
);

export const invites = pgTable('invites', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 320 }).notNull(),
  token: text('token').notNull().unique(),
  role: userRole('role').notNull().default('worker'),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  usedAt: timestamp('used_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const invoiceImports = pgTable('invoice_imports', {
  id: uuid('id').primaryKey().defaultRandom(),
  fileName: text('file_name').notNull(),
  // Vercel Blob URL for the original PDF — kept for later reference.
  fileUrl: text('file_url').notNull(),
  // AI-detected from the PDF text, not user-entered — nullable since
  // detection can fail.
  supplierName: text('supplier_name'),
  uploadedByUserId: uuid('uploaded_by_user_id')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const passwordResetTokens = pgTable('password_reset_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  usedAt: timestamp('used_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const materialsRelations = relations(materials, ({ many }) => ({
  transactions: many(inventoryTransactions),
}));

export const inventoryTransactionsRelations = relations(inventoryTransactions, ({ one }) => ({
  material: one(materials, {
    fields: [inventoryTransactions.materialId],
    references: [materials.id],
  }),
  loggedByUser: one(users, {
    fields: [inventoryTransactions.loggedByUserId],
    references: [users.id],
  }),
}));
