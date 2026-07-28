'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { RankedVolumeRow } from './queries';

// Single hue, ranked-by-entity bars — the correct chart form for comparing
// magnitude across many categorical entities (a multi-line time series with
// 20+ materials would be unreadable, see the dataviz "too many series"
// anti-pattern).
const BAR_COLOR = '#0FB3AC';

export function RankedBarChart({ data, emptyState }: { data: RankedVolumeRow[]; emptyState: string }) {
  if (data.length === 0) {
    return <p className="text-sm text-slate">{emptyState}</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(160, data.length * 36)}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-mist)" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 12, fill: 'var(--color-slate)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="label"
          width={120}
          tick={{ fontSize: 12, fill: 'var(--color-ink)' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip />
        <Bar dataKey="totalMl" fill={BAR_COLOR} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
