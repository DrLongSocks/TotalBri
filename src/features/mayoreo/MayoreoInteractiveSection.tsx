'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { BulkInquiryDialog } from './BulkInquiryDialog';

const ParallaxFeatures = dynamic(
  () => import('./ParallaxFeatures').then((m) => m.ParallaxFeatures),
  { ssr: false, loading: () => <div className="py-8" /> },
);

export function MayoreoInteractiveSection() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <ParallaxFeatures onCtaClick={() => setDialogOpen(true)} />
      <BulkInquiryDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
}
