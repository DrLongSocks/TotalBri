'use server';

import { randomBytes } from 'crypto';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db';
import { invites, users } from '@/db/schema';
import { isInviteValid } from '@/domain/invites/token';
import { requireAdmin } from '@/lib/auth/require-admin';
import { sendInviteEmail } from '@/lib/email/invite';

const INVITE_TTL_MS = 1000 * 60 * 60 * 24 * 7;

const createInviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'worker']),
});

export async function createInvite(formData: FormData) {
  await requireAdmin();

  const parsed = createInviteSchema.parse({
    email: formData.get('email'),
    role: formData.get('role'),
  });

  const token = randomBytes(32).toString('hex');

  await db.insert(invites).values({
    email: parsed.email,
    role: parsed.role,
    token,
    expiresAt: new Date(Date.now() + INVITE_TTL_MS),
  });

  try {
    await sendInviteEmail({ email: parsed.email, role: parsed.role, token });
  } catch (error) {
    // The invite row is already committed and still visible/copyable on the
    // workers page — a Resend outage shouldn't block invite creation.
    console.error('Failed to send invite email', error);
  }

  revalidatePath('/admin/workers');
}

const acceptInviteSchema = z.object({
  token: z.string().min(1),
  name: z.string().min(1),
  password: z.string().min(8),
});

export type AcceptInviteState = { error?: string } | undefined;

export async function acceptInvite(
  _prevState: AcceptInviteState,
  formData: FormData,
): Promise<AcceptInviteState> {
  const parsed = acceptInviteSchema.safeParse({
    token: formData.get('token'),
    name: formData.get('name'),
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return { error: 'invalid' };
  }

  const invite = await db.query.invites.findFirst({
    where: (i, { eq: eqOp }) => eqOp(i.token, parsed.data.token),
  });
  if (!invite || !isInviteValid(invite, new Date())) {
    return { error: 'invalid' };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  await db.transaction(async (tx) => {
    await tx.insert(users).values({
      name: parsed.data.name,
      email: invite.email,
      passwordHash,
      role: invite.role,
    });
    await tx.update(invites).set({ usedAt: new Date() }).where(eq(invites.id, invite.id));
  });

  redirect('/admin/login');
}
