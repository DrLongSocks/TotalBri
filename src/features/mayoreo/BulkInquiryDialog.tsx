'use client';

import { BulkInquiryForm } from './BulkInquiryForm';

type Props = {
  open: boolean;
  onClose: () => void;
};

export function BulkInquiryDialog({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Card */}
      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-porcelain shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-ink/10 text-ink transition hover:bg-ink/20"
        >
          ×
        </button>
        <BulkInquiryForm />
      </div>
    </div>
  );
}
