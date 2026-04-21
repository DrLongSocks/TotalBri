import { isLocale } from '@/domain/i18n/config';
import { SideNav } from '@/components/layout/SideNav';
import { Footer } from '@/components/layout/Footer';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function ShopLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) return <>{children}</>;

  return (
    <>
      <div className="container-shell pb-20 pt-6 md:pb-24 md:pt-8">
        <div className="grid gap-7 lg:grid-cols-[240px_1fr]">
          {/* Sidebar — desktop only */}
          <aside className="hidden lg:block">
            <div className="sticky top-[100px]">
              <SideNav locale={locale} />
            </div>
          </aside>

          {/* Main content */}
          <div className="min-w-0">{children}</div>
        </div>
      </div>
      <Footer locale={locale} />
    </>
  );
}
