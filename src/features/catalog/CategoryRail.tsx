import Link from 'next/link';
import { CATEGORY_TREE } from '@/domain/category/tree';
import type { Locale } from '@/domain/i18n/config';

type Props = {
  locale: Locale;
};

const icons: Record<string, string> = {
  detergentes: '🧴',
  suavizantes: '🌸',
  'limpiadores-pisos': '🪣',
  desinfectantes: '🦠',
  'linea-automotriz': '🚗',
  desengrasantes: '⚙️',
  aromatizantes: '🌿',
  jarceria: '🧤',
  trapeadores: '🧹',
  escobas: '🪡',
  despachadores: '🖐️',
  higienicos: '🧻',
  varios: '📦',
};

export function CategoryRail({ locale }: Props) {
  const basePath = '';

  return (
    <div className="container-shell">
      <h2 className="display-l mb-10">Categorías</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
        {CATEGORY_TREE.map((cat) => (
          <Link
            key={cat.slug}
            href={`${basePath}/tienda/${cat.slug}`}
            className="group flex flex-col items-center gap-3 rounded-2xl border border-mist bg-porcelain px-3 py-5 text-center transition hover:border-azure hover:bg-paper hover:shadow-[var(--shadow-card-hover)]"
          >
            <span className="text-3xl" aria-hidden>
              {icons[cat.slug] ?? '✨'}
            </span>
            <span className="text-[0.8125rem] font-semibold leading-tight text-ink group-hover:text-azure">
              {cat.name[locale]}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
