import type { Category } from '../product/schema';
import type { LocalizedString } from '../product/schema';

export type CategoryMeta = {
  slug: Category;
  name: LocalizedString;
  tagline: LocalizedString;
  intro: LocalizedString;
  heroAccent: string;
  showOnHome: boolean;
  homeOrder: number;
};

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  detergentes: {
    slug: 'detergentes',
    name: { es: 'Detergentes', en: 'Detergents' },
    tagline: { es: 'Limpieza profunda, ropa impecable.', en: 'Deep clean, impeccable laundry.' },
    intro: {
      es: 'Detergentes líquidos, en polvo y jabón de barra. Hechos para el ritmo de la familia mexicana.',
      en: 'Liquid and powder detergents plus bar soap. Built for a Mexican household.',
    },
    heroAccent: 'from-azure to-teal',
    showOnHome: true,
    homeOrder: 1,
  },
  suavizantes: {
    slug: 'suavizantes',
    name: { es: 'Suavizantes', en: 'Softeners' },
    tagline: { es: 'Ropa suave, aroma duradero.', en: 'Soft clothes, lasting scent.' },
    intro: {
      es: 'Suavizantes concentrados y doble aroma para dejar la ropa suave y perfumada por más tiempo.',
      en: 'Concentrated and double-scent softeners for longer-lasting softness and fragrance.',
    },
    heroAccent: 'from-azure-deep to-teal',
    showOnHome: true,
    homeOrder: 2,
  },
  'limpiadores-pisos': {
    slug: 'limpiadores-pisos',
    name: { es: 'Limpiadores de pisos', en: 'Floor cleaners' },
    tagline: { es: 'Pisos relucientes en cada pasada.', en: 'Gleaming floors with every pass.' },
    intro: {
      es: 'Multiusos concentrados, microcápsulas y fórmulas especiales para pisos, azulejos y baños.',
      en: 'Concentrated multi-surface cleaners, microcapsules and specialty formulas for floors and tile.',
    },
    heroAccent: 'from-azure to-ink',
    showOnHome: true,
    homeOrder: 3,
  },
  desinfectantes: {
    slug: 'desinfectantes',
    name: { es: 'Desinfectantes', en: 'Disinfectants' },
    tagline: { es: 'Elimina gérmenes, protege espacios.', en: 'Eliminates germs, protects spaces.' },
    intro: {
      es: 'Desinfectantes líquidos y pastillas de cloro para espacios seguros en hoteles, negocios y hogares.',
      en: 'Liquid disinfectants and chlorine tablets for safe spaces in hotels, businesses and homes.',
    },
    heroAccent: 'from-teal to-azure',
    showOnHome: false,
    homeOrder: 4,
  },
  'linea-automotriz': {
    slug: 'linea-automotriz',
    name: { es: 'Línea automotriz', en: 'Automotive' },
    tagline: { es: 'Carros como nuevos.', en: 'Cars like new.' },
    intro: {
      es: 'Shampoo para carrocería, cera líquida, alto brillo y desengrasante de motor. Para lavadores y uso personal.',
      en: 'Car wash shampoo, liquid wax, high gloss and engine degreaser. For detailers and daily drivers.',
    },
    heroAccent: 'from-ink to-azure-deep',
    showOnHome: false,
    homeOrder: 5,
  },
  desengrasantes: {
    slug: 'desengrasantes',
    name: { es: 'Desengrasantes', en: 'Degreasers' },
    tagline: { es: 'Corta grasa a la primera.', en: 'Cuts grease on the first pass.' },
    intro: {
      es: 'Desengrasantes industriales y de uso doméstico para cocinas, talleres y superficies difíciles.',
      en: 'Industrial and household degreasers for kitchens, workshops and tough surfaces.',
    },
    heroAccent: 'from-azure-deep to-ink',
    showOnHome: false,
    homeOrder: 6,
  },
  aromatizantes: {
    slug: 'aromatizantes',
    name: { es: 'Aromatizantes', en: 'Air fresheners' },
    tagline: { es: 'Aromas que perduran.', en: 'Scents that last.' },
    intro: {
      es: 'Autofresh y fragancias de ambiente para hogar, auto y negocio.',
      en: 'Autofresh and ambient fragrances for home, car and business.',
    },
    heroAccent: 'from-teal to-azure',
    showOnHome: false,
    homeOrder: 7,
  },
  jarceria: {
    slug: 'jarceria',
    name: { es: 'Jarcería', en: 'Janitorial' },
    tagline: { es: 'Todo lo que necesitas para limpiar.', en: 'Everything you need to clean.' },
    intro: {
      es: 'Cubetas, bolsas, guantes, esponjas, fibras y accesorios de limpieza profesional.',
      en: 'Buckets, bags, gloves, sponges, scrubbers and professional cleaning accessories.',
    },
    heroAccent: 'from-azure to-teal',
    showOnHome: true,
    homeOrder: 8,
  },
  trapeadores: {
    slug: 'trapeadores',
    name: { es: 'Trapeadores', en: 'Mops' },
    tagline: { es: 'Pisos limpios, trabajo hecho.', en: 'Clean floors, job done.' },
    intro: {
      es: 'Trapeadores de microfibra, hilaza y pabilo para uso doméstico e industrial.',
      en: 'Microfiber, yarn and pabilo mops for home and industrial use.',
    },
    heroAccent: 'from-teal to-azure-deep',
    showOnHome: true,
    homeOrder: 9,
  },
  escobas: {
    slug: 'escobas',
    name: { es: 'Escobas', en: 'Brooms' },
    tagline: { es: 'Barre rápido, barre bien.', en: 'Sweep fast, sweep clean.' },
    intro: {
      es: 'Escobas abanico, venecianas, mega y cepillo para interiores y exteriores.',
      en: 'Fan, venetian, mega and brush brooms for indoor and outdoor use.',
    },
    heroAccent: 'from-azure-deep to-teal',
    showOnHome: false,
    homeOrder: 10,
  },
  despachadores: {
    slug: 'despachadores',
    name: { es: 'Despachadores', en: 'Dispensers' },
    tagline: { es: 'Higiene al alcance de todos.', en: 'Hygiene within reach.' },
    intro: {
      es: 'Despachadores de jabón y alcohol para oficinas, escuelas y negocios.',
      en: 'Soap and alcohol dispensers for offices, schools and businesses.',
    },
    heroAccent: 'from-ink to-azure',
    showOnHome: false,
    homeOrder: 11,
  },
  higienicos: {
    slug: 'higienicos',
    name: { es: 'Higiénicos', en: 'Hygiene products' },
    tagline: { es: 'Cuidado personal y sanitario.', en: 'Personal and sanitary care.' },
    intro: {
      es: 'Papel higiénico, gel antibacterial, sanitizantes y artículos de higiene personal.',
      en: 'Toilet paper, antibacterial gel, sanitizers and personal hygiene products.',
    },
    heroAccent: 'from-teal to-ink',
    showOnHome: false,
    homeOrder: 12,
  },
  varios: {
    slug: 'varios',
    name: { es: 'Varios', en: 'Various' },
    tagline: { es: 'Todo lo demás.', en: 'Everything else.' },
    intro: {
      es: 'Insecticidas, destapacaños, quitasarro, aceites y especialidades.',
      en: 'Insecticides, drain openers, descalers, oils and specialties.',
    },
    heroAccent: 'from-slate to-ink',
    showOnHome: false,
    homeOrder: 13,
  },
};

export const CATEGORIES_ORDER: Category[] = (
  Object.values(CATEGORY_META)
    .sort((a, b) => a.homeOrder - b.homeOrder)
    .map((c) => c.slug)
) as Category[];
