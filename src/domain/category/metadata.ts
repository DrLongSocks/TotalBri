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
  'limpieza-hogar': {
    slug: 'limpieza-hogar',
    name: { es: 'Limpieza del hogar', en: 'Home cleaning' },
    tagline: { es: 'Un hogar limpio, día a día.', en: 'A clean home, every day.' },
    intro: {
      es: 'Multiusos concentrados, desinfectantes y fórmulas especiales fabricadas en Michoacán. Rinden por litros y trabajan sobre pisos, azulejos y baños.',
      en: 'Concentrated multi-surface cleaners, disinfectants and specialty formulas made in Michoacán. Multi-liter yield on floors, tile and bathrooms.',
    },
    heroAccent: 'from-azure to-teal',
    showOnHome: true,
    homeOrder: 1,
  },
  lavanderia: {
    slug: 'lavanderia',
    name: { es: 'Lavandería', en: 'Laundry' },
    tagline: { es: 'Ropa impecable, aroma duradero.', en: 'Impeccable laundry, lasting scent.' },
    intro: {
      es: 'Detergentes líquidos y en polvo, suavizantes con doble aroma y jabones de barra. Hechos para el ritmo de la familia mexicana.',
      en: 'Liquid and powder detergents, double-scent softeners and bar soaps. Built for a Mexican household.',
    },
    heroAccent: 'from-ink to-azure-deep',
    showOnHome: true,
    homeOrder: 3,
  },
  higiene: {
    slug: 'higiene',
    name: { es: 'Higiene', en: 'Hygiene' },
    tagline: { es: 'Protección para tu equipo.', en: 'Protection for your team.' },
    intro: {
      es: 'Gel antibacterial, sanitizantes, jabón de manos y despachadores para oficinas, escuelas y negocios.',
      en: 'Antibacterial gel, sanitizers, hand soap and dispensers for offices, schools and businesses.',
    },
    heroAccent: 'from-teal to-teal-soft',
    showOnHome: true,
    homeOrder: 4,
  },
  jarceria: {
    slug: 'jarceria',
    name: { es: 'Jarcería', en: 'Janitorial tools' },
    tagline: { es: 'La caja de herramientas del limpieza.', en: 'The cleaning toolbox.' },
    intro: {
      es: 'Trapeadores, escobas, fibras, cubetas, atomizadores y guantes. Todo lo que necesitas para un día de limpieza completo.',
      en: 'Mops, brooms, fibers, buckets, sprayers and gloves. Everything you need for a full cleaning day.',
    },
    heroAccent: 'from-azure-deep to-ink',
    showOnHome: true,
    homeOrder: 2,
  },
  automotriz: {
    slug: 'automotriz',
    name: { es: 'Automotriz', en: 'Automotive' },
    tagline: { es: 'Carros como nuevos.', en: 'Cars like new.' },
    intro: {
      es: 'Shampoo para carrocería, cera líquida, alto brillo y desengrasante de motor. Para lavadores y autos personales.',
      en: 'Car wash shampoo, liquid wax, high gloss and engine degreaser. For detailers and daily drivers.',
    },
    heroAccent: 'from-ink to-ink-soft',
    showOnHome: false,
    homeOrder: 5,
  },
  aromatizantes: {
    slug: 'aromatizantes',
    name: { es: 'Aromatizantes', en: 'Air fresheners' },
    tagline: { es: 'Aromas que perduran.', en: 'Scents that last.' },
    intro: {
      es: 'Autofresh, Total Fresh, Glade y Febrize. Para hogar, auto y negocio.',
      en: 'Autofresh, Total Fresh, Glade and Febrize. For home, car and business.',
    },
    heroAccent: 'from-teal-soft to-teal',
    showOnHome: false,
    homeOrder: 6,
  },
  varios: {
    slug: 'varios',
    name: { es: 'Varios', en: 'Various' },
    tagline: { es: 'Todo lo demás.', en: 'Everything else.' },
    intro: {
      es: 'Insecticidas, destapacaños, quitasarro, aceites y especialidades que no caben en un solo pasillo.',
      en: 'Insecticides, drain openers, descalers, oils and specialties that need their own aisle.',
    },
    heroAccent: 'from-slate to-ink-soft',
    showOnHome: false,
    homeOrder: 7,
  },
};

export const CATEGORIES_ORDER: Category[] = (
  Object.values(CATEGORY_META)
    .sort((a, b) => a.homeOrder - b.homeOrder)
    .map((c) => c.slug)
) as Category[];
