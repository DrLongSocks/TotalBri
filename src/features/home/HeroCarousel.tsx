'use client';

import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Locale } from '@/domain/i18n/config';

type Slide = {
  eyebrow: string;
  headline: string;
  support: string;
  cta: string;
  ctaHref: string;
  ctaSecondary: string;
  ctaSecondaryHref: string;
  gradient: string;
};

export function HeroCarousel() {
  const t = useTranslations('home');
  const locale = useLocale() as Locale;
  const reduce = useReducedMotion();
  const base = locale === 'en' ? '/en' : '';

  const slides: Slide[] = [
    {
      eyebrow: t('heroEyebrow1'),
      headline: t('heroHeadline1'),
      support: t('heroSupport1'),
      cta: t('heroCta1'),
      ctaHref: `${base}/tienda`,
      ctaSecondary: t('heroCtaSecondary1'),
      ctaSecondaryHref: `${base}/tienda/limpieza-hogar`,
      gradient: 'from-azure to-teal',
    },
    {
      eyebrow: t('heroEyebrow2'),
      headline: t('heroHeadline2'),
      support: t('heroSupport2'),
      cta: t('heroCta2'),
      ctaHref: `${base}/mayoreo`,
      ctaSecondary: t('heroCtaSecondary2'),
      ctaSecondaryHref: `${base}/tienda`,
      gradient: 'from-ink to-azure-deep',
    },
    {
      eyebrow: t('heroEyebrow3'),
      headline: t('heroHeadline3'),
      support: t('heroSupport3'),
      cta: t('heroCta3'),
      ctaHref: `${base}/tienda/jarceria`,
      ctaSecondary: t('heroCtaSecondary3'),
      ctaSecondaryHref: `${base}/tienda`,
      gradient: 'from-teal to-teal-soft',
    },
  ];

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(next, 6000);
    return () => window.clearInterval(id);
  }, [next, paused]);

  useEffect(() => {
    const vis = () => setPaused(document.visibilityState !== 'visible');
    document.addEventListener('visibilitychange', vis);
    return () => document.removeEventListener('visibilitychange', vis);
  }, []);

  const slide = slides[index]!;

  return (
    <section
      className="relative h-[70dvh] min-h-[520px] w-full overflow-hidden bg-ink text-paper md:h-[85vh]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="region"
      aria-label="Hero"
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`}
        >
          <div className="noise" />
        </motion.div>
      </AnimatePresence>

      <div className="container-shell relative z-10 flex h-full flex-col justify-end pb-16 md:justify-center md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
            aria-live="polite"
          >
            <p className="eyebrow mb-4 text-paper/80">{slide.eyebrow}</p>
            <h1 className="display-xl text-paper">{slide.headline}</h1>
            <p className="mt-6 max-w-xl text-lg text-paper/80 md:text-xl">{slide.support}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="onInk" size="lg">
                <Link href={slide.ctaHref}>{slide.cta}</Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="text-paper hover:bg-paper/10">
                <Link href={slide.ctaSecondaryHref}>{slide.ctaSecondary}</Link>
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-8 right-6 z-20 hidden items-center gap-2 md:flex xl:right-20">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/30 text-paper hover:bg-paper/15"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/30 text-paper hover:bg-paper/15"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 md:bottom-8 md:left-6 md:translate-x-0 xl:left-20">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1 w-8 rounded-full transition ${i === index ? 'bg-paper' : 'bg-paper/30'}`}
          />
        ))}
      </div>
    </section>
  );
}
