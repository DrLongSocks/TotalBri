import type { Category, LocalizedString } from '../product/schema';

export type SubcategoryNode = {
  slug: string;
  name: LocalizedString;
};

export type CategoryNode = {
  slug: Category;
  name: LocalizedString;
  subcategories: SubcategoryNode[];
};

const sub = (slug: string, es: string, en: string): SubcategoryNode => ({ slug, name: { es, en } });

export const CATEGORY_TREE: CategoryNode[] = [
  {
    slug: 'detergentes',
    name: { es: 'Detergentes', en: 'Detergents' },
    subcategories: [
      sub('detergentes-liquidos', 'Líquidos', 'Liquid'),
      sub('detergentes-polvo', 'En polvo', 'Powder'),
      sub('jabon-barra', 'Jabón de barra', 'Bar soap'),
    ],
  },
  {
    slug: 'suavizantes',
    name: { es: 'Suavizantes', en: 'Softeners' },
    subcategories: [
      sub('suavizantes', 'Suavizantes', 'Softeners'),
      sub('suavizantes-doble-aroma', 'Doble aroma', 'Double scent'),
    ],
  },
  {
    slug: 'limpiadores-pisos',
    name: { es: 'Limpiadores de pisos', en: 'Floor cleaners' },
    subcategories: [
      sub('multiusos', 'Multiusos', 'Multi-surface'),
      sub('microcapsulas', 'Microcápsulas', 'Microcapsule'),
      sub('especiales', 'Especiales', 'Specialty'),
    ],
  },
  {
    slug: 'desinfectantes',
    name: { es: 'Desinfectantes', en: 'Disinfectants' },
    subcategories: [
      sub('desinfectantes', 'Desinfectantes', 'Disinfectants'),
      sub('pastillas-cloro', 'Pastillas de cloro', 'Chlorine tablets'),
    ],
  },
  {
    slug: 'linea-automotriz',
    name: { es: 'Línea automotriz', en: 'Automotive' },
    subcategories: [sub('linea-automotriz', 'Línea automotriz', 'Car care')],
  },
  {
    slug: 'desengrasantes',
    name: { es: 'Desengrasantes', en: 'Degreasers' },
    subcategories: [sub('desengrasantes', 'Desengrasantes', 'Degreasers')],
  },
  {
    slug: 'aromatizantes',
    name: { es: 'Aromatizantes', en: 'Air fresheners' },
    subcategories: [sub('autofresh', 'Autofresh', 'Autofresh')],
  },
  {
    slug: 'jarceria',
    name: { es: 'Jarcería', en: 'Janitorial' },
    subcategories: [
      sub('cubetas', 'Cubetas', 'Buckets'),
      sub('bolsas', 'Bolsas', 'Bags'),
      sub('guantes', 'Guantes', 'Gloves'),
      sub('esponjas', 'Esponjas', 'Sponges'),
      sub('fibras', 'Fibras', 'Scrubbers'),
      sub('atomizadores', 'Atomizadores', 'Sprayers'),
      sub('accesorios', 'Accesorios', 'Accessories'),
    ],
  },
  {
    slug: 'trapeadores',
    name: { es: 'Trapeadores', en: 'Mops' },
    subcategories: [sub('trapeadores', 'Trapeadores', 'Mops')],
  },
  {
    slug: 'escobas',
    name: { es: 'Escobas', en: 'Brooms' },
    subcategories: [sub('escobas', 'Escobas', 'Brooms')],
  },
  {
    slug: 'despachadores',
    name: { es: 'Despachadores', en: 'Dispensers' },
    subcategories: [
      sub('despachadores', 'Despachadores', 'Dispensers'),
      sub('jabon-manos', 'Jabón de manos', 'Hand soap'),
    ],
  },
  {
    slug: 'higienicos',
    name: { es: 'Higiénicos', en: 'Hygiene' },
    subcategories: [
      sub('higienicos', 'Higiénicos', 'Toilet & napkins'),
      sub('higiene-personal', 'Higiene personal', 'Personal hygiene'),
      sub('gel-antibacterial', 'Gel antibacterial', 'Antibacterial gel'),
      sub('sanitizantes', 'Sanitizantes', 'Sanitizers'),
    ],
  },
  {
    slug: 'varios',
    name: { es: 'Varios', en: 'Various' },
    subcategories: [
      sub('varios', 'Varios', 'Various'),
      sub('mascotas', 'Mascotas', 'Pets'),
    ],
  },
];

export function getCategoryNode(slug: Category): CategoryNode | undefined {
  return CATEGORY_TREE.find((n) => n.slug === slug);
}

export function getSubcategoryName(slug: string): LocalizedString {
  for (const cat of CATEGORY_TREE) {
    const match = cat.subcategories.find((s) => s.slug === slug);
    if (match) return match.name;
  }
  return { es: slug, en: slug };
}
