'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/cn';

const ESCOBA_FALLBACKS = [
  '/images/products/escoba-abanico-grande.png',
  '/images/products/escoba-arcoiris.png',
  '/images/products/escoba-tipo-cepillo.png',
  '/images/products/escoba-mega.png',
  '/images/products/escoba-romana.png',
  '/images/products/escoba-veneciana.png',
  '/images/products/escoba-hilaza.png',
];

export type CategoryCardData = {
  slug: string;
  name: string;
  image: string;
  count: number;
  locale: string;
};

function CategoryCard({ slug, name, image, count, locale }: CategoryCardData & { index: number }) {
  const fallback = ESCOBA_FALLBACKS[Math.abs(slug.length) % ESCOBA_FALLBACKS.length];

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative flex-shrink-0 w-[200px] h-[260px] rounded-2xl overflow-hidden snap-start"
    >
      <Link href={`/${locale}/tienda?categoria=${slug}`} className="block h-full group">
        {/* Image — top 55% */}
        <div className="h-[55%] w-full bg-porcelain overflow-hidden">
          <img
            src={image}
            alt={name}
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = fallback; }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Info — bottom 45% */}
        <div className="h-[45%] bg-card px-4 py-3 flex flex-col justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-azure mb-1">
              {count} productos
            </p>
            <h3 className="font-display text-[17px] font-extrabold uppercase leading-tight text-ink">
              {name}
            </h3>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-slate">Ver todo</span>
            <div className="w-7 h-7 rounded-full bg-porcelain flex items-center justify-center transition-colors duration-200 group-hover:bg-azure group-hover:text-paper text-ink">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

interface Props {
  categories: CategoryCardData[];
}

export function MobileCategoryCarousel({ categories }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full">
      {/* Left arrow */}
      <button
        onClick={() => scroll('left')}
        aria-label="Anterior"
        className={cn(
          'absolute left-0 top-1/2 -translate-y-1/2 z-10',
          'w-8 h-8 rounded-full bg-paper/80 backdrop-blur-sm shadow-sm',
          'flex items-center justify-center text-ink',
          'transition-opacity duration-200 opacity-60 hover:opacity-100',
        )}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Scrollable track */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 px-4 scrollbar-hide snap-x snap-mandatory"
      >
        {categories.map((cat, i) => (
          <CategoryCard key={cat.slug} {...cat} index={i} />
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll('right')}
        aria-label="Siguiente"
        className={cn(
          'absolute right-0 top-1/2 -translate-y-1/2 z-10',
          'w-8 h-8 rounded-full bg-paper/80 backdrop-blur-sm shadow-sm',
          'flex items-center justify-center text-ink',
          'transition-opacity duration-200 opacity-60 hover:opacity-100',
        )}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
