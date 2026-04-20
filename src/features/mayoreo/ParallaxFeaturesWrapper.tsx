'use client';

import dynamic from 'next/dynamic';

const ParallaxFeatures = dynamic(
  () => import('./ParallaxFeatures').then((m) => m.ParallaxFeatures),
  { ssr: false, loading: () => <div className="py-8" /> },
);

type Props = { onCtaClick: () => void };

export function ParallaxFeaturesWrapper({ onCtaClick }: Props) {
  return <ParallaxFeatures onCtaClick={onCtaClick} />;
}
