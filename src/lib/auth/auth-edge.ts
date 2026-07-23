import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// Imported ONLY by middleware.ts — keeps pg/bcryptjs out of the Edge bundle.
export const { auth } = NextAuth(authConfig);
