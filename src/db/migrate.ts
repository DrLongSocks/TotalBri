import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';

config({ path: '.env.local' });
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

// DDL runs against the UNPOOLED connection, not the pooled runtime one in
// db/index.ts — a transaction-mode pooler doesn't reliably preserve the
// session-level state some migrations need.
async function main() {
  const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('Set DATABASE_URL_UNPOOLED (or DATABASE_URL) before running db:migrate');
  }

  const pool = new Pool({ connectionString });
  const db = drizzle(pool);

  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: './src/db/migrations' });
  console.log('Migrations complete.');

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
