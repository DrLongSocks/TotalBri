import 'server-only';
import { db } from '@/db';

export async function getMaterialsSortedByName() {
  return db.query.materials.findMany({ orderBy: (m, { asc }) => asc(m.name) });
}
