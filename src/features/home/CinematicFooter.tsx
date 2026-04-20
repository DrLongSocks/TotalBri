'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/cn';
import { env } from '@/lib/env';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const STYLES = `
@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes footer-heartbeat {
  0%, 100% { transform: scale(1); }
  15%, 45% { transform: scale(1.25); }
  30% { transform: scale(1); }
}

.animate-footer-breathe {
  animation: footer-breathe 8s ease-in-out infinite alternate;
}

.animate-footer-scroll-marquee {
  animation: footer-scroll-marquee 40s linear infinite;
}

.animate-footer-heartbeat {
  animation: footer-heartbeat 2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}

.cinematic-footer-wrapper {
  --pill-bg-1: color-mix(in oklch, var(--foreground) 3%, transparent);
  --pill-bg-2: color-mix(in oklch, var(--foreground) 1%, transparent);
  --pill-shadow: color-mix(in oklch, var(--background) 50%, transparent);
  --pill-highlight: color-mix(in oklch, var(--foreground) 10%, transparent);
  --pill-inset-shadow: color-mix(in oklch, var(--background) 80%, transparent);
  --pill-border: color-mix(in oklch, var(--foreground) 8%, transparent);
  --pill-bg-1-hover: color-mix(in oklch, var(--foreground) 8%, transparent);
  --pill-bg-2-hover: color-mix(in oklch, var(--foreground) 2%, transparent);
  --pill-border-hover: color-mix(in oklch, var(--foreground) 20%, transparent);
  --pill-shadow-hover: color-mix(in oklch, var(--background) 70%, transparent);
  --pill-highlight-hover: color-mix(in oklch, var(--foreground) 20%, transparent);
}

.footer-bg-grid {
  background-size: 60px 60px;
  background-image:
    linear-gradient(to right, color-mix(in oklch, var(--foreground) 3%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in oklch, var(--foreground) 3%, transparent) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
}

.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%,
    color-mix(in oklch, var(--primary) 15%, transparent) 0%,
    color-mix(in oklch, var(--secondary) 15%, transparent) 40%,
    transparent 70%
  );
}

.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow:
    0 10px 30px -10px var(--pill-shadow),
    inset 0 1px 1px var(--pill-highlight),
    inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow:
    0 20px 40px -10px var(--pill-shadow-hover),
    inset 0 1px 1px var(--pill-highlight-hover);
  color: var(--foreground);
}

.footer-giant-bg-text {
  font-size: 26vw;
  line-height: 0.75;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1px color-mix(in oklch, var(--foreground) 5%, transparent);
  background: linear-gradient(180deg, color-mix(in oklch, var(--foreground) 10%, transparent) 0%, transparent 60%);
  -webkit-background-clip: text;
  background-clip: text;
}

.footer-text-glow {
  background: linear-gradient(180deg, var(--foreground) 0%, color-mix(in oklch, var(--foreground) 40%, transparent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 20px color-mix(in oklch, var(--foreground) 15%, transparent));
}
`;

type MagneticProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as?: React.ElementType;
  };

function MagneticButton({ className, children, as: Component = 'button', ...props }: MagneticProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(el, { x: x * 0.4, y: y * 0.4, rotationX: -y * 0.15, rotationY: x * 0.15, scale: 1.05, ease: 'power2.out', duration: 0.4 });
      };
      const onLeave = () => {
        gsap.to(el, { x: 0, y: 0, rotationX: 0, rotationY: 0, scale: 1, ease: 'elastic.out(1, 0.3)', duration: 1.2 });
      };
      el.addEventListener('mousemove', onMove as EventListener);
      el.addEventListener('mouseleave', onLeave);
      return () => {
        el.removeEventListener('mousemove', onMove as EventListener);
        el.removeEventListener('mouseleave', onLeave);
      };
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <Component
      ref={ref}
      className={cn('cursor-pointer', className)}
      {...props}
    >
      {children}
    </Component>
  );
}

function MarqueeItem() {
  return (
    <div className="flex items-center space-x-12 px-6">
      <span>Limpieza profesional</span> <span className="text-primary/60">✦</span>
      <span>Entrega mismo día</span> <span className="text-secondary/60">✦</span>
      <span>Los Reyes</span> <span className="text-primary/60">✦</span>
      <span>Pide por WhatsApp</span> <span className="text-secondary/60">✦</span>
      <span>Sin complicaciones</span> <span className="text-primary/60">✦</span>
    </div>
  );
}

function WAIcon() {
  return (
    <svg viewBox="0 0 32 32" width={20} height={20} fill="currentColor" aria-hidden>
      <path d="M16 3C9 3 3 9 3 16c0 2.5.7 4.8 1.9 6.8L3 29l6.4-1.8c1.9 1 4.2 1.6 6.6 1.6 7 0 13-6 13-13S23 3 16 3z" />
    </svg>
  );
}

export function CinematicFooter() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  const waNumber = env.NEXT_PUBLIC_WHATSAPP_PRIMARY ?? '3546880969';
  const waUrl = `https://wa.me/${waNumber.replace(/\D/g, '')}?text=${encodeURIComponent('¡Hola Total Bri! Quiero hacer un pedido.')}`;

  useEffect(() => {
    if (typeof window === 'undefined' || !wrapperRef.current) return;
    const ctx = gsap.context(() => {
      if (giantTextRef.current) {
        gsap.fromTo(
          giantTextRef.current,
          { y: '10vh', scale: 0.8, opacity: 0 },
          {
            y: '0vh', scale: 1, opacity: 1, ease: 'power1.out',
            scrollTrigger: { trigger: wrapperRef.current, start: 'top 80%', end: 'bottom bottom', scrub: 1 },
          },
        );
      }
      const targets = [headingRef.current, linksRef.current].filter(Boolean);
      if (targets.length > 0) {
        gsap.fromTo(
          targets,
          { y: 50, opacity: 0 },
          {
            y: 0, opacity: 1, stagger: 0.15, ease: 'power3.out',
            scrollTrigger: { trigger: wrapperRef.current, start: 'top 40%', end: 'bottom bottom', scrub: 1 },
          },
        );
      }
    }, wrapperRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div
        ref={wrapperRef}
        className="relative h-screen w-full"
        style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}
      >
        <footer
          className="fixed bottom-0 left-0 flex h-screen w-full flex-col justify-between overflow-hidden cinematic-footer-wrapper"
          style={{
            '--background': '#0B1F3A',
            '--foreground': '#F6F3EC',
            '--primary': '#0FB3AC',
            '--secondary': '#122C4C',
            '--destructive': '#dc2626',
            '--border': 'rgba(246,243,236,0.10)',
            '--muted-foreground': 'rgba(246,243,236,0.55)',
            background: '#0B1F3A',
            color: '#F6F3EC',
          } as React.CSSProperties}
        >
          {/* Ambient glow */}
          <div className="footer-aurora absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[80px] pointer-events-none z-0" />
          <div className="footer-bg-grid absolute inset-0 z-0 pointer-events-none" />

          {/* Giant bg text */}
          <div
            ref={giantTextRef}
            className="footer-giant-bg-text absolute -bottom-[5vh] left-1/2 -translate-x-1/2 whitespace-nowrap z-0 pointer-events-none select-none"
          >
            TOTAL BRI
          </div>

          {/* Marquee */}
          <div className="absolute top-12 left-0 w-full overflow-hidden border-y border-white/10 bg-black/20 backdrop-blur-md py-4 z-10 -rotate-2 scale-110 shadow-2xl">
            <div className="flex w-max animate-footer-scroll-marquee text-xs md:text-sm font-bold tracking-[0.3em] uppercase" style={{ color: 'rgba(246,243,236,0.55)' }}>
              <MarqueeItem />
              <MarqueeItem />
            </div>
          </div>

          {/* Main content */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 mt-20 w-full max-w-5xl mx-auto">
            <h2
              ref={headingRef}
              className="text-5xl md:text-8xl font-black footer-text-glow tracking-tighter mb-12 text-center"
            >
              ¿Tu empresa merece un proveedor que no falla?
            </h2>

            <div ref={linksRef} className="flex flex-col items-center gap-6 w-full">
              {/* Primary CTAs */}
              <div className="flex flex-wrap justify-center gap-4 w-full">
                <MagneticButton
                  as="a"
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-glass-pill px-10 py-5 rounded-full font-bold text-sm md:text-base flex items-center gap-3"
                  style={{ background: '#25D366', border: 'none', color: '#fff' }}
                >
                  <WAIcon />
                  Enviar pedido por WhatsApp
                </MagneticButton>

                <MagneticButton
                  as={Link}
                  href="/tienda"
                  className="footer-glass-pill px-10 py-5 rounded-full font-bold text-sm md:text-base flex items-center gap-3"
                  style={{ color: '#F6F3EC' }}
                >
                  Ver catálogo →
                </MagneticButton>
              </div>

              {/* Category pills */}
              <div className="flex flex-wrap justify-center gap-3 md:gap-4 w-full mt-2">
                <MagneticButton as={Link} href="/tienda/detergentes" className="footer-glass-pill px-6 py-3 rounded-full font-medium text-xs md:text-sm" style={{ color: 'rgba(246,243,236,0.55)' }}>
                  Detergentes
                </MagneticButton>
                <MagneticButton as={Link} href="/tienda/limpiadores-pisos" className="footer-glass-pill px-6 py-3 rounded-full font-medium text-xs md:text-sm" style={{ color: 'rgba(246,243,236,0.55)' }}>
                  Limpiadores
                </MagneticButton>
                <MagneticButton as={Link} href="/tienda/aromatizantes" className="footer-glass-pill px-6 py-3 rounded-full font-medium text-xs md:text-sm" style={{ color: 'rgba(246,243,236,0.55)' }}>
                  Aromatizantes
                </MagneticButton>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="relative z-20 w-full pb-8 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-[10px] md:text-xs font-semibold tracking-widest uppercase order-2 md:order-1" style={{ color: 'rgba(246,243,236,0.40)' }}>
              © 2026 Total Bri · Los Reyes
            </div>

            <div className="footer-glass-pill px-6 py-3 rounded-full flex items-center gap-2 order-1 md:order-2 cursor-default">
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(246,243,236,0.55)' }}>Hecho con</span>
              <span className="animate-footer-heartbeat text-sm md:text-base" style={{ color: '#dc2626' }}>❤</span>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(246,243,236,0.55)' }}>en Los Reyes</span>
            </div>

            <MagneticButton
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="footer-glass-pill h-12 w-12 flex items-center justify-center group order-3"
              style={{ color: 'rgba(246,243,236,0.55)' }}
            >
              <svg className="w-5 h-5 transform group-hover:-translate-y-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </MagneticButton>
          </div>
        </footer>
      </div>
    </>
  );
}
