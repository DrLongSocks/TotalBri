'use client';

import Image from 'next/image';
import Link from 'next/link';
import { DottedSurface } from '@/components/ui/DottedSurface';

export function HeroCarousel() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-ink">
      <DottedSurface />
      <div className="noise pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-azure/20 blur-[120px]" />

      <div className="relative z-10 flex flex-col items-center gap-0 px-8 py-12 text-center md:flex-row md:items-center md:gap-8 md:px-12 md:py-16 md:text-left">
        {/* Left: eyebrow + heading + description */}
        <div className="flex flex-1 flex-col items-center md:items-start">
          <p className="eyebrow mb-3 text-azure">Total Bri · 2026 · Los Reyes</p>
          <h1 className="display-xl leading-none text-paper">
            Limpieza profesional
            <br />
            a un WhatsApp.
          </h1>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-paper/75">
            Arma tu pedido, elige entrega o recoger, y te confirmamos por WhatsApp.
            Sin apps, sin cuentas complicadas.
          </p>
        </div>

        {/* Center/Right: logo + CTA stacked */}
        <div className="flex flex-shrink-0 flex-col items-center gap-6 mt-8 md:mt-0">
          <div className="relative flex items-center justify-center">
            <div className="absolute h-96 w-96 rounded-full bg-azure/30 blur-[80px]" />
            <Image
              src="/logo.png"
              alt="Total Bri"
              width={340}
              height={340}
              className="relative z-10 h-56 w-56 object-contain md:h-80 md:w-80 drop-shadow-2xl"
              priority
            />
          </div>
          <Link
            href="#mas-vendidos"
            className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 font-display text-[15px] font-extrabold uppercase tracking-wide text-paper transition-opacity hover:opacity-90"
          >
            Ver catálogo →
          </Link>
        </div>
      </div>
    </section>
  );
}
