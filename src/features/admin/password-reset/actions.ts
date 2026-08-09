'use server';

import { randomBytes } from 'crypto';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db';
import { passwordResetTokens, users } from '@/db/schema';
import { isResetTokenValid } from '@/domain/password-reset/token';
import { sendPasswordResetEmail } from '@/lib/email/password-reset';

const RESET_TTL_MS = 1000 * 60 * 60;

const requestResetSchema = z.object({
  email: z.string().email(),
});

export type RequestResetState = { error?: string; success?: boolean } | undefined;

// Public — no session required, this is for logged-out users. Always
// returns the same success response whether or not the email matches an
// account, so the response can't be used to enumerate registered emails.
export async function requestPasswordReset(
  _prevState: RequestResetState,
  formData: FormData,
): Promise<RequestResetState> {
  const parsed = requestResetSchema.safeParse({ email: formData.get('email') });
  if (!parsed.success) {
    return { error: 'invalid' };
  }

  const user = await db.query.users.findFirst({
    where: (u, { eq: eqOp }) => eqOp(u.email, parsed.data.email),
  });

  if (user && !user.disabledAt) {
    const token = randomBytes(32).toString('hex');
    await db.insert(passwordResetTokens).values({
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + RESET_TTL_MS),
    });

    try {
      await sendPasswordResetEmail({ email: user.email, token });
    } catch (error) {
      // A Resend outage must not reveal whether the account exists via a
      // different error path than the generic success state.
      console.error('Failed to send password reset email', error);
    }
  }

  return { success: true };
}

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

export type ResetPasswordState = { error?: string } | undefined;

export async function resetPassword(
  _prevState: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get('token'),
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return { error: 'invalid' };
  }

  const resetToken = await db.query.passwordResetTokens.findFirst({
    where: (t, { eq: eqOp }) => eqOp(t.token, parsed.data.token),
  });
  if (!resetToken || !isResetTokenValid(resetToken, new Date())) {
    return { error: 'invalid' };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  await db.transaction(async (tx) => {
    await tx.update(users).set({ passwordHash }).where(eq(users.id, resetToken.userId));
    await tx
      .update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(eq(passwordResetTokens.id, resetToken.id));
  });

  redirect('/admin/login');
}
