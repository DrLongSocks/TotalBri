import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getAdminMessages } from '@/domain/admin-i18n/messages';
import { getAdminLocale } from '@/lib/admin-locale';

export default async function AdminNotFound() {
  const locale = await getAdminLocale();
  const messages = getAdminMessages(locale).notFound;

  return (
    <section className="flex min-h-[50vh] items-center py-16">
      <div className="flex flex-col items-start">
        <p className="eyebrow mb-4 text-slate">404</p>
        <h1 className="display-l">{messages.title}</h1>
        <p className="mt-4 max-w-md text-slate">{messages.body}</p>
        <Button asChild variant="primary" size="md" className="mt-8">
          <Link href="/admin/dashboard">{messages.cta}</Link>
        </Button>
      </div>
    </section>
  );
}
