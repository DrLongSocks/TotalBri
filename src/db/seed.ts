import { config } from 'dotenv';
import bcrypt from 'bcryptjs';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { z } from 'zod';
import * as schema from './schema';

config({ path: '.env.local' });

// Bootstraps the very first admin account directly in the DB — self-serve
// signup needs an invite, and invites need a logged-in admin to create them,
// so day one has to start somewhere other than the invite flow.
const seedEnvSchema = z.object({
  SEED_ADMIN_EMAIL: z.string().email(),
  SEED_ADMIN_PASSWORD: z.string().min(8),
  SEED_ADMIN_NAME: z.string().min(1),
});

async function main() {
  const seedEnv = seedEnvSchema.parse({
    SEED_ADMIN_EMAIL: process.env.SEED_ADMIN_EMAIL,
    SEED_ADMIN_PASSWORD: process.env.SEED_ADMIN_PASSWORD,
    SEED_ADMIN_NAME: process.env.SEED_ADMIN_NAME,
  });

  const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('Set DATABASE_URL before running db:seed');
  }

  const pool = new Pool({ connectionString });
  const db = drizzle(pool, { schema });

  const passwordHash = await bcrypt.hash(seedEnv.SEED_ADMIN_PASSWORD, 10);

  const [admin] = await db
    .insert(schema.users)
    .values({
      name: seedEnv.SEED_ADMIN_NAME,
      email: seedEnv.SEED_ADMIN_EMAIL,
      passwordHash,
      role: 'admin',
    })
    .onConflictDoNothing({ target: schema.users.email })
    .returning();

  if (admin) {
    console.log(`Seeded admin user: ${admin.email}`);
  } else {
    console.log(`Admin user ${seedEnv.SEED_ADMIN_EMAIL} already exists, skipping.`);
  }

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
