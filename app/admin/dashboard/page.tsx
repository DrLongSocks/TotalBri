import { getAdminMessages } from '@/domain/admin-i18n/messages';
import { getStockOverview, getUsageTrend } from '@/features/admin/reports/queries';
import { AdminPageHeading } from '@/features/admin/layout/AdminPageHeading';
import { StockTable } from '@/features/admin/reports/StockTable';
import { UsageTrendChart } from '@/features/admin/reports/UsageTrendChart';
import { getAdminLocale } from '@/lib/admin-locale';

export default async function AdminDashboardPage() {
  const [locale, stock, trend] = await Promise.all([
    getAdminLocale(),
    getStockOverview(),
    getUsageTrend(30),
  ]);
  const messages = getAdminMessages(locale);

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeading>{messages.dashboard.title}</AdminPageHeading>

      <section className="rounded-2xl border border-ink/10 bg-card p-6 shadow-[var(--shadow-card)]">
        <h2 className="eyebrow mb-4 text-slate">{messages.dashboard.usageTrend}</h2>
        <UsageTrendChart data={trend} messages={messages.dashboard} />
      </section>

      <section className="rounded-2xl border border-ink/10 bg-card p-6 shadow-[var(--shadow-card)]">
        <StockTable rows={stock} messages={messages} />
      </section>
    </div>
  );
}
