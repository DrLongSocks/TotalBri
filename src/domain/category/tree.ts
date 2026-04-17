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
    slug: 'limpieza-hogar',
    name: { es: 'Limpieza del hogar', en: 'Home cleaning' },
    subcategories: [
      sub('multiusos', 'Multiusos', 'Multi-surface'),
      sub('desinfectantes', 'Desinfectantes', 'Disinfectants'),
      sub('pastillas-cloro', 'Pastillas de cloro', 'Chlorine tablets'),
      sub('microcapsulas', 'Microcápsulas', 'Microcapsule'),
      sub('desengrasantes', 'Desengrasantes', 'Degreasers'),
      sub('especiales', 'Especiales', 'Specialty'),
    ],
  },
  {
    slug: 'lavanderia',
    name: { es: 'Lavandería', en: 'Laundry' },
    subcategories: [
      sub('detergentes-liquidos', 'Detergentes líquidos', 'Liquid detergents'),
      sub('detergentes-polvo', 'Detergentes en polvo', 'Powder detergents'),
      sub('suavizantes', 'Suavizantes', 'Softeners'),
      sub('suavizantes-doble-aroma', 'Suavizantes doble aroma', 'Double-scent softeners'),
      sub('jabon-barra', 'Jabón de barra', 'Bar soap'),
    ],
  },
  {
    slug: 'higiene',
    name: { es: 'Higiene', en: 'Hygiene' },
    subcategories: [
      sub('gel-antibacterial', 'Gel antibacterial', 'Antibacterial gel'),
      sub('sanitizantes', 'Sanitizantes', 'Sanitizers'),
      sub('jabon-manos', 'Jabón para manos', 'Hand soap'),
      sub('higiene-personal', 'Higiene personal', 'Personal hygiene'),
      sub('higienicos', 'Higiénicos', 'Toilet & napkins'),
      sub('despachadores', 'Despachadores', 'Dispensers'),
    ],
  },
  {
    slug: 'jarceria',
    name: { es: 'Jarcería', en: 'Janitorial tools' },
    subcategories: [
      sub('trapeadores', 'Trapeadores', 'Mops'),
      sub('escobas', 'Escobas', 'Brooms'),
      sub('fibras', 'Fibras', 'Scrubbers'),
      sub('esponjas', 'Esponjas', 'Sponges'),
      sub('cubetas', 'Cubetas', 'Buckets'),
      sub('atomizadores', 'Atomizadores', 'Sprayers'),
      sub('guantes', 'Guantes', 'Gloves'),
      sub('bolsas', 'Bolsas', 'Bags'),
      sub('accesorios', 'Accesorios', 'Accessories'),
    ],
  },
  {
    slug: 'automotriz',
    name: { es: 'Automotriz', en: 'Automotive' },
    subcategories: [sub('linea-automotriz', 'Línea automotriz', 'Car care')],
  },
  {
    slug: 'aromatizantes',
    name: { es: 'Aromatizantes', en: 'Air fresheners' },
    subcategories: [sub('autofresh', 'Autofresh', 'Autofresh')],
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
