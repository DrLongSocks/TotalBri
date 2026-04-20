'use client';

import { Button } from '@/components/ui/button';

type Props = {
  waUrl: string;
  label: string;
};

export function MayoreoHeroCTA({ waUrl, label }: Props) {
  return (
    <Button asChild variant="whatsapp" size="lg">
      <a href={waUrl} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    </Button>
  );
}
