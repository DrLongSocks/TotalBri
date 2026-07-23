import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';

// Page-level gate for admin-only routes (materials/products/workers) — the
// mutating actions re-check role independently, but a worker session must
// never even render these pages.
export async function requireAdminSession() {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    redirect('/dashboard');
  }
  return session;
}
