ALTER TABLE "products" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "products" CASCADE;--> statement-breakpoint
ALTER TABLE "inventory_transactions" ALTER COLUMN "product_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "inventory_transactions" ADD COLUMN "product_quantity" numeric(12, 2);--> statement-breakpoint
ALTER TABLE "inventory_transactions" ADD COLUMN "total_cost" numeric(12, 2);--> statement-breakpoint
ALTER TABLE "materials" ADD COLUMN "weighted_avg_cost" numeric(12, 4) DEFAULT '0' NOT NULL;--> statement-breakpoint
CREATE INDEX "inventory_transactions_material_logged_at" ON "inventory_transactions" USING btree ("material_id","logged_at");--> statement-breakpoint
CREATE INDEX "inventory_transactions_product_logged_at" ON "inventory_transactions" USING btree ("product_id","logged_at");