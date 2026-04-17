'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

export function AnnouncementBar() {
  const t = useTranslations('announcement');
  const messages = [t('delivery'), t('wholesale'), t('local')];
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % messages.length), 5000);
    return () => window.clearInterval(id);
  }, [messages.length]);

  return (
    <div
      role="region"
      aria-label="Announcements"
      className="bg-ink text-paper"
    >
      <div className="container-shell flex h-9 items-center justify-center overflow-hidden text-[11px] uppercase tracking-[0.15em]">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="font-medium text-paper/90"
            aria-live="polite"
          >
            {messages[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
