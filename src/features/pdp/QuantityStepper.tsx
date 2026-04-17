'use client';

import { Minus, Plus } from 'lucide-react';
import { MAX_QTY } from '@/domain/cart/types';

type Props = {
  value: number;
  onChange: (v: number) => void;
  label?: string;
};

export function QuantityStepper({ value, onChange, label }: Props) {
  return (
    <div className="inline-flex h-12 items-center overflow-hidden rounded-full border border-mist">
      {label ? <span className="sr-only">{label}</span> : null}
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        aria-label="-1"
        className="flex h-full w-11 items-center justify-center hover:bg-mist"
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (!Number.isFinite(n)) return;
          onChange(Math.max(1, Math.min(MAX_QTY, Math.floor(n))));
        }}
        className="h-full w-12 text-center text-sm font-medium outline-none"
        min={1}
        max={MAX_QTY}
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(MAX_QTY, value + 1))}
        disabled={value >= MAX_QTY}
        aria-label="+1"
        className="flex h-full w-11 items-center justify-center hover:bg-mist disabled:opacity-30"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
