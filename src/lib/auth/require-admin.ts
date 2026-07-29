import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';

// Page-level gate for admin-only routes (materials/workers) — the mutating
// actions re-check role independently, but a worker session must never even
// render these pages.
export async function requireAdminSession() {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    redirect('/admin/dashboard');
  }
  return session;
}

// Page-level gate for routes any authenticated user (worker or admin) can
// reach — dashboard and the NFC log page. Now that /admin/* is reachable
// directly on the storefront's own domain (not just a dedicated subdomain
// middleware could fully gate), pages that render real data can't rely on
// routing structure alone for auth.
export async function requireSession() {
  const session = await auth();
  if (!session?.user) {
    redirect('/admin/login');
  }
  return session;
}
