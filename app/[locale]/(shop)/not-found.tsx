import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';

export default async function NotFound() {
  const t = await getTranslations('notFound');
  return (
    <section className="flex min-h-[60vh] items-center py-20">
      <div className="container-shell flex flex-col items-start">
        <p className="eyebrow mb-4 text-slate">404</p>
        <h1 className="display-l">{t('title')}</h1>
        <p className="mt-6 max-w-md text-slate">{t('body')}</p>
        <Button asChild variant="primary" size="md" className="mt-8">
          <Link href="/">{t('cta')}</Link>
        </Button>
      </div>
    </section>
  );
}
