'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db';
import { users } from '@/db/schema';
import { auth } from '@/lib/auth/auth';

const removeWorkerSchema = z.object({
  userId: z.string().uuid(),
});

// Sets `disabledAt` rather than deleting the row — see the comment on
// `users.disabledAt` in schema.ts for why a hard delete isn't safe here.
export async function removeWorker(formData: FormData) {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    throw new Error('Forbidden');
  }

  const parsed = removeWorkerSchema.parse({ userId: formData.get('userId') });
  if (parsed.userId === session.user.id) {
    throw new Error('Cannot remove your own account');
  }

  await db.update(users).set({ disabledAt: new Date() }).where(eq(users.id, parsed.userId));

  revalidatePath('/admin/workers');
}
