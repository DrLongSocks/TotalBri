'use client';

import { Line, LineChart, ResponsiveContainer } from 'recharts';
import type { getAdminMessages } from '@/domain/admin-i18n/messages';
import { hasEnoughPointsForTrend } from '@/domain/inventory/ratio';
import type { RatioPoint } from './queries';

const LINE_COLOR = '#0FB3AC';

export type RatioProductData = {
  productId: string;
  productName: string;
  points: RatioPoint[];
};

// Card 7 — fragrance per unit of product, trended once there are enough
// points; below that, the raw latest ratio with no chart (a 2-3-point line
// implies a trend that isn't really there yet).
export function RatioCard({
  products,
  messages,
}: {
  products: RatioProductData[];
  messages: ReturnType<typeof getAdminMessages>['dashboard'];
}) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-card p-6 shadow-[var(--shadow-card)]">
      <h2 className="eyebrow mb-4 text-slate">{messages.ratioTitle}</h2>
      {products.length === 0 ? (
        <p className="text-sm text-slate">{messages.noDataInWindow}</p>
      ) : (
        <div className="flex flex-col gap-5">
          {products.map((product) => (
            <div key={product.productId}>
              <p className="mb-1 text-sm font-medium text-ink">{product.productName}</p>
              {hasEnoughPointsForTrend(product.points.length) ? (
                <ResponsiveContainer width="100%" height={56}>
                  <LineChart data={product.points}>
                    <Line type="monotone" dataKey="ratio" stroke={LINE_COLOR} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-xs text-slate">
                  {messages.notEnoughForTrend}
                  {product.points.length > 0 && (
                    <>
                      {' '}
                      {messages.rawRatio}: {product.points[product.points.length - 1]?.ratio.toFixed(3)}
                    </>
                  )}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
