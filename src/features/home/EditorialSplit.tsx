import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/primitives/FadeIn';
import { cn } from '@/lib/cn';

type Props = {
  eyebrow: string;
  headline: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
  reversed?: boolean;
  tone?: 'porcelain' | 'paper';
  gradient?: string;
};

export function EditorialSplit({
  eyebrow,
  headline,
  body,
  ctaLabel,
  ctaHref,
  reversed,
  tone = 'porcelain',
  gradient = 'from-azure-deep to-ink',
}: Props) {
  return (
    <section className={cn('py-16 md:py-32', tone === 'porcelain' ? 'bg-porcelain' : 'bg-paper')}>
      <div className="container-shell grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <FadeIn className={cn('order-1 flex flex-col', reversed ? 'md:order-2' : 'md:order-1')}>
          <p className="eyebrow mb-4 text-slate">{eyebrow}</p>
          <h2 className="display-l">{headline}</h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-slate">{body}</p>
          {ctaLabel && ctaHref ? (
            <div className="mt-8">
              <Button asChild variant="secondary" size="md">
                <Link href={ctaHref}>{ctaLabel}</Link>
              </Button>
            </div>
          ) : null}
        </FadeIn>
        <FadeIn
          delay={0.1}
          className={cn('order-2 relative h-[420px] overflow-hidden rounded-2xl md:h-[560px]', reversed ? 'md:order-1' : 'md:order-2')}
        >
          <div className={cn('absolute inset-0 bg-gradient-to-br', gradient)} aria-hidden />
          <div className="noise" />
        </FadeIn>
      </div>
    </section>
  );
}
