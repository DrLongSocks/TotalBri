import type { getAdminMessages } from '@/domain/admin-i18n/messages';
import type {
  InventoryValueRow,
  ProductMadeRow,
  RankedVolumeRow,
  RestockRow,
  StockoutRow,
  WorkerVolumeRow,
} from './queries';

type Messages = ReturnType<typeof getAdminMessages>;

function CardShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-card p-6 shadow-[var(--shadow-card)]">
      <h2 className="eyebrow mb-4 text-slate">{title}</h2>
      {children}
    </div>
  );
}

// Cards 3, 4, 10 — a single honest number, or a zero, never a blank. Lives
// inside the dashboard's dark hero (see app/admin/dashboard/page.tsx), so
// this is a translucent glass panel rather than the shared light CardShell.
export function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl border border-paper/15 bg-paper/10 p-6 backdrop-blur-sm">
      <h2 className="eyebrow mb-4 text-paper/70">{title}</h2>
      <p className="font-display text-3xl font-extrabold text-paper">{value}</p>
    </div>
  );
}

// Card 2 — days until stockout per material.
export function StockoutCard({ rows, messages }: { rows: StockoutRow[]; messages: Messages['dashboard'] }) {
  return (
    <CardShell title={messages.stockoutTitle}>
      <ul className="flex flex-col gap-2 text-sm">
        {rows.map((row) => (
          <li
            key={row.materialId}
            className="flex items-center justify-between border-t border-ink/8 pt-2 first:border-t-0 first:pt-0"
          >
            <span>{row.materialName}</span>
            <span className={row.result === 'insufficient-data' ? 'text-slate' : 'font-semibold text-ink'}>
              {row.result === 'insufficient-data' ? messages.insufficientData : `${row.result.toFixed(1)} d`}
            </span>
          </li>
        ))}
      </ul>
    </CardShell>
  );
}

// Card 5 — products made by quantity in the selected window.
export function ProductsMadeCard({
  rows,
  messages,
}: {
  rows: ProductMadeRow[];
  messages: Messages['dashboard'];
}) {
  return (
    <CardShell title={messages.productsMadeTitle}>
      {rows.length === 0 ? (
        <p className="text-sm text-slate">{messages.noDataInWindow}</p>
      ) : (
        <ul className="flex flex-col gap-2 text-sm">
          {rows.map((row) => (
            <li
              key={row.productId}
              className="flex items-center justify-between border-t border-ink/8 pt-2 first:border-t-0 first:pt-0"
            >
              <span>{row.productName}</span>
              <span className="font-semibold text-ink">
                {row.totalQuantity} {row.unit}
              </span>
            </li>
          ))}
        </ul>
      )}
    </CardShell>
  );
}

// Card 8 — per-worker log volume.
export function WorkerVolumeCard({
  rows,
  messages,
}: {
  rows: WorkerVolumeRow[];
  messages: Messages['dashboard'];
}) {
  return (
    <CardShell title={messages.perWorkerTitle}>
      {rows.length === 0 ? (
        <p className="text-sm text-slate">{messages.noDataInWindow}</p>
      ) : (
        <ul className="flex flex-col gap-2 text-sm">
          {rows.map((row) => (
            <li
              key={row.userId}
              className="flex items-center justify-between border-t border-ink/8 pt-2 first:border-t-0 first:pt-0"
            >
              <span>{row.userName}</span>
              <span className="font-semibold text-ink">{row.logCount}</span>
            </li>
          ))}
        </ul>
      )}
    </CardShell>
  );
}

// Card 9 — restock frequency per material.
export function RestockFrequencyCard({
  rows,
  messages,
}: {
  rows: RestockRow[];
  messages: Messages['dashboard'];
}) {
  return (
    <CardShell title={messages.restockFrequencyTitle}>
      {rows.length === 0 ? (
        <p className="text-sm text-slate">{messages.noRestocks}</p>
      ) : (
        <ul className="flex flex-col gap-2 text-sm">
          {rows.map((row) => (
            <li key={row.materialId} className="border-t border-ink/8 pt-2 first:border-t-0 first:pt-0">
              <div className="flex items-center justify-between">
                <span>{row.materialName}</span>
                <span className="font-semibold text-ink">{row.count}</span>
              </div>
              <p className="text-xs text-slate">
                {row.dates
                  .slice(0, 3)
                  .map((d) => new Date(d).toLocaleDateString())
                  .join(', ')}
              </p>
            </li>
          ))}
        </ul>
      )}
    </CardShell>
  );
}

// Card 12 — current dollar value of inventory.
export function InventoryValueCard({
  rows,
  total,
  messages,
}: {
  rows: InventoryValueRow[];
  total: number;
  messages: Messages['dashboard'] & { costNotRecorded: Messages['materials']['costNotRecorded'] };
}) {
  return (
    <CardShell title={messages.inventoryValueTitle}>
      <p className="mb-4 font-display text-2xl font-extrabold text-ink">
        {messages.total}: ${total.toFixed(2)}
      </p>
      <ul className="flex flex-col gap-2 text-sm">
        {rows.map((row) => (
          <li
            key={row.materialId}
            className="flex items-center justify-between border-t border-ink/8 pt-2 first:border-t-0 first:pt-0"
          >
            <span>{row.materialName}</span>
            <span className={row.hasCost ? 'font-semibold text-ink' : 'text-slate'}>
              {row.hasCost ? `$${row.value.toFixed(2)}` : messages.costNotRecorded}
            </span>
          </li>
        ))}
      </ul>
    </CardShell>
  );
}

// Card 13 — dollar burn rate. Same cost-data dependency as card 12.
export function BurnRateCard({
  total,
  excludedMaterialCount,
  messages,
}: {
  total: number;
  excludedMaterialCount: number;
  messages: Messages['dashboard'];
}) {
  return (
    <CardShell title={messages.burnRateTitle}>
      <p className="font-display text-2xl font-extrabold text-ink">${total.toFixed(2)}</p>
      {excludedMaterialCount > 0 && (
        <p className="mt-2 text-xs text-slate">
          {excludedMaterialCount} {messages.burnRateExcluded}
        </p>
      )}
    </CardShell>
  );
}

function RankedList({ title, rows, emptyState }: { title: string; rows: RankedVolumeRow[]; emptyState: string }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate">{title}</p>
      {rows.length === 0 ? (
        <p className="text-sm text-slate">{emptyState}</p>
      ) : (
        <ol className="flex flex-col gap-1.5 text-sm">
          {rows.map((row, index) => (
            <li key={row.label} className="flex items-center justify-between gap-2">
              <span className="truncate">
                {index + 1}. {row.label}
              </span>
              <span className="flex-shrink-0 font-semibold text-ink">{row.totalMl.toFixed(0)}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

// Card 11 — top consumed materials/products, ranked. Same underlying
// SUM(...) DESC as card 6's charts, presented as a compact numbered list
// instead of duplicating the same two bar charts a second time.
export function TopConsumedCard({
  materials,
  products,
  messages,
}: {
  materials: RankedVolumeRow[];
  products: RankedVolumeRow[];
  messages: Messages['dashboard'];
}) {
  return (
    <CardShell title={messages.topConsumedTitle}>
      <div className="grid gap-6 sm:grid-cols-2">
        <RankedList title={messages.topMaterials} rows={materials} emptyState={messages.noDataInWindow} />
        <RankedList title={messages.topProducts} rows={products} emptyState={messages.noDataInWindow} />
      </div>
    </CardShell>
  );
}
