'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { RankedVolumeRow } from './queries';

// Single hue, ranked-by-entity bars — the correct chart form for comparing
// magnitude across many categorical entities (a multi-line time series with
// 20+ materials would be unreadable, see the dataviz "too many series"
// anti-pattern). Colors tuned for the dark hero background — this
// component's only two usages both live in app/admin/dashboard/page.tsx's
// hero, not the light card sections.
const BAR_COLOR = '#0FB3AC';
const GRID_COLOR = 'rgba(246, 243, 236, 0.15)'; // paper/15
const LABEL_COLOR = 'rgba(246, 243, 236, 0.7)'; // paper/70

export function RankedBarChart({ data, emptyState }: { data: RankedVolumeRow[]; emptyState: string }) {
  if (data.length === 0) {
    return <p className="text-sm text-paper/60">{emptyState}</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(160, data.length * 36)}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 12, fill: LABEL_COLOR }} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="label"
          width={120}
          tick={{ fontSize: 12, fill: LABEL_COLOR }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip />
        <Bar dataKey="totalMl" fill={BAR_COLOR} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
