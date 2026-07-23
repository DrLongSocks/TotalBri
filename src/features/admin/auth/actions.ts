'use server';

import { AuthError } from 'next-auth';
import { signIn } from '@/lib/auth/auth';

export type LoginState = { error?: string } | undefined;

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  try {
    await signIn('credentials', formData);
    return undefined;
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'invalid' };
    }
    // NextAuth signals a successful sign-in via a thrown NEXT_REDIRECT, which
    // must propagate rather than being swallowed here.
    throw error;
  }
}
