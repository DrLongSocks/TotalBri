import 'server-only';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { serverEnv } from '@/lib/env.server';
import * as schema from './schema';

// Module-scope singleton: many short-lived Vercel function instances each
// holding a small pool is safer than one instance exhausting Neon's
// connection ceiling with a large pool. Points at Neon's POOLED connection
// string — PgBouncer transaction mode still supports real transactions and
// `FOR UPDATE`, which the atomic stock-update query in queries/log-usage.ts
// depends on.
const pool = new Pool({ connectionString: serverEnv.DATABASE_URL, max: 3 });

export const db = drizzle(pool, { schema });
