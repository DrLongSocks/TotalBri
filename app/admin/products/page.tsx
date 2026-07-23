import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/db';
import { getAdminMessages } from '@/domain/admin-i18n/messages';
import { AdminPageHeading } from '@/features/admin/layout/AdminPageHeading';
import { createProduct } from '@/features/admin/products/actions';
import { getAdminLocale } from '@/lib/admin-locale';
import { requireAdminSession } from '@/lib/auth/require-admin';

export default async function ProductsPage() {
  await requireAdminSession();

  const [locale, allProducts] = await Promise.all([
    getAdminLocale(),
    db.query.products.findMany({ orderBy: (p, { asc }) => asc(p.name) }),
  ]);
  const messages = getAdminMessages(locale).products;

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeading>{messages.title}</AdminPageHeading>

      <ul className="flex flex-col gap-0.5 rounded-2xl border border-ink/10 bg-card p-2 shadow-[var(--shadow-card)]">
        {allProducts.map((product) => (
          <li
            key={product.id}
            className="rounded-xl px-4 py-2.5 text-sm transition-colors hover:bg-porcelain/40"
          >
            {product.name}
          </li>
        ))}
      </ul>

      <form
        action={createProduct}
        className="flex max-w-md items-end gap-4 rounded-2xl border border-ink/10 bg-card p-6 shadow-[var(--shadow-card)]"
      >
        <div className="flex flex-1 flex-col gap-1">
          <label htmlFor="name" className="text-sm text-slate">
            {messages.name}
          </label>
          <Input id="name" name="name" required />
        </div>
        <Button type="submit">{messages.create}</Button>
      </form>
    </div>
  );
}
