'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from '@/db';
import { products } from '@/db/schema';
import { auth } from '@/lib/auth/auth';

const createProductSchema = z.object({
  name: z.string().min(1),
});

export async function createProduct(formData: FormData) {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    throw new Error('Forbidden');
  }

  const parsed = createProductSchema.parse({ name: formData.get('name') });

  await db.insert(products).values({ name: parsed.name });

  revalidatePath('/products');
}
