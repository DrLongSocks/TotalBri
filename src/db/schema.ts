import { relations } from 'drizzle-orm';
import { numeric, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';

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

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
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
    lowStockThreshold: numeric('low_stock_threshold', { precision: 12, scale: 2 }).notNull(),
    provider: text('provider'),
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
export const inventoryTransactions = pgTable('inventory_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  materialId: uuid('material_id')
    .notNull()
    .references(() => materials.id),
  type: transactionType('type').notNull(),
  quantity: numeric('quantity', { precision: 12, scale: 2 }).notNull(),
  productId: uuid('product_id').references(() => products.id),
  loggedByUserId: uuid('logged_by_user_id')
    .notNull()
    .references(() => users.id),
  loggedAt: timestamp('logged_at', { withTimezone: true }).notNull().defaultNow(),
  note: text('note'),
});

export const invites = pgTable('invites', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 320 }).notNull(),
  token: text('token').notNull().unique(),
  role: userRole('role').notNull().default('worker'),
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
  product: one(products, {
    fields: [inventoryTransactions.productId],
    references: [products.id],
  }),
  loggedByUser: one(users, {
    fields: [inventoryTransactions.loggedByUserId],
    references: [users.id],
  }),
}));
