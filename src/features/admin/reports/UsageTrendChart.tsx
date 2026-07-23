'use client';

import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { getAdminMessages } from '@/domain/admin-i18n/messages';
import type { UsageTrendPoint } from './queries';

type DashboardMessages = ReturnType<typeof getAdminMessages>['dashboard'];

// Single series (total ml used per day) — one brand hue, no legend needed.
const LINE_COLOR = '#0FB3AC';

export function UsageTrendChart({
  data,
  messages,
}: {
  data: UsageTrendPoint[];
  messages: DashboardMessages;
}) {
  const [mode, setMode] = useState<'line' | 'bar'>('line');

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end gap-2 text-xs">
        <button
          type="button"
          onClick={() => setMode('line')}
          className={mode === 'line' ? 'font-semibold text-ink' : 'text-slate hover:text-ink'}
        >
          {messages.lineView}
        </button>
        <span className="text-slate">/</span>
        <button
          type="button"
          onClick={() => setMode('bar')}
          className={mode === 'bar' ? 'font-semibold text-ink' : 'text-slate hover:text-ink'}
        >
          {messages.barView}
        </button>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        {mode === 'line' ? (
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-mist)" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: 'var(--color-slate)' }}
              tickFormatter={(day: string) => day.slice(5)}
              axisLine={{ stroke: 'var(--color-mist)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: 'var(--color-slate)' }}
              width={40}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="usageMl"
              stroke={LINE_COLOR}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        ) : (
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-mist)" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: 'var(--color-slate)' }}
              tickFormatter={(day: string) => day.slice(5)}
              axisLine={{ stroke: 'var(--color-mist)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: 'var(--color-slate)' }}
              width={40}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip />
            <Bar dataKey="usageMl" fill={LINE_COLOR} radius={[4, 4, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
