'use client';

import React, { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import Image from 'next/image';

/* ── ContainerScroll ─────────────────────────────────────────────────────── */

function ContainerScroll({
  titleComponent,
  children,
}: {
  titleComponent: React.ReactNode;
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const scaleDimensions = () => (isMobile ? [0.7, 0.9] : [1.05, 1]);

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      className="relative flex h-[60rem] items-center justify-center p-2 md:h-[80rem] md:p-20"
      ref={containerRef}
    >
      <div className="relative w-full py-10 md:py-40" style={{ perspective: '1000px' }}>
        <motion.div
          style={{ translateY: translate }}
          className="mx-auto mb-0 max-w-5xl text-center"
        >
          {titleComponent}
        </motion.div>

        <motion.div
          style={{
            rotateX: rotate,
            scale,
            boxShadow:
              '0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003',
          }}
          className="mx-auto -mt-12 h-auto w-full max-w-5xl rounded-[30px] border-4 border-[#6C6C6C] bg-[#222222] p-2 shadow-2xl md:h-[40rem] md:p-6"
        >
          <div className="w-full overflow-hidden rounded-2xl bg-ink md:h-full md:rounded-2xl">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ── Section data ────────────────────────────────────────────────────────── */

const SECTIONS = [
  {
    imageSrc: '/images/products/mayorea-page-3.jpg',
    imageAlt: 'Distribuidores Total Bri',
    heading: 'Inicia tu propio negocio',
    description: 'Precios de mayoreo, apoyo directo y productos de alta demanda.',
    ctaLabel: 'Ser distribuidor',
  },
  {
    imageSrc: '/images/products/mayorea-page-2.jpg',
    imageAlt: 'Mayoreo por volumen Total Bri',
    heading: 'Mayoreo para pedidos grandes',
    description: 'Entre más compras, más ahorras. Sin contratos ni membresías.',
    ctaLabel: 'Ver precios',
  },
  {
    imageSrc: '/images/products/mayorea-page-1.jpg',
    imageAlt: 'Cotiza por WhatsApp Total Bri',
    heading: 'Cotiza por WhatsApp',
    description: 'Precio, disponibilidad y entrega — todo en un chat, en minutos.',
    ctaLabel: 'Cotizar ahora',
  },
] as const;

/* ── Export ──────────────────────────────────────────────────────────────── */

export function ParallaxFeatures({ onCtaClick }: { onCtaClick: () => void }) {
  return (
    <ContainerScroll
      titleComponent={
        <div className="mb-8">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-azure">
            Total Bri · Mayoreo
          </p>
          <h2 className="font-display text-4xl font-extrabold uppercase leading-tight tracking-tight text-ink md:text-6xl">
            Todo lo que<br />tu negocio necesita
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-slate">
            Distribuidores, pedidos grandes o una simple cotización — aquí lo tienes.
          </p>
        </div>
      }
    >
      <div className="grid h-full grid-cols-1 md:grid-cols-3">
        {SECTIONS.map((s) => (
          <div key={s.heading} className="group relative h-52 overflow-hidden md:h-full">
            <Image
              src={s.imageSrc}
              alt={s.imageAlt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
            {/* Text */}
            <div className="relative z-10 flex h-full flex-col justify-end p-5">
              <h3 className="font-display text-[15px] font-extrabold uppercase leading-tight tracking-tight text-paper md:text-lg">
                {s.heading}
              </h3>
              <p className="mt-1 text-[12px] leading-snug text-paper/70 md:text-[13px]">
                {s.description}
              </p>
              <button
                type="button"
                onClick={onCtaClick}
                className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-lg bg-azure px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-paper transition-opacity hover:opacity-90"
              >
                {s.ctaLabel} →
              </button>
            </div>
          </div>
        ))}
      </div>
    </ContainerScroll>
  );
}
