import type { Category, LocalizedString } from './schema';

type DescriptionTemplate = {
  es: (name: string) => string;
  en: (name: string) => string;
};

const templates: Record<string, DescriptionTemplate> = {
  multiusos: {
    es: (n) =>
      `${n} — limpiador multiusos concentrado, rinde por litros y deja un aroma duradero. Ideal para pisos, azulejos y superficies del hogar.`,
    en: (n) =>
      `${n} — concentrated multi-surface cleaner. Dilutes by the liter with a long-lasting scent. Great for floors, tile and household surfaces.`,
  },
  microcapsulas: {
    es: (n) =>
      `${n} — limpiador con microcápsulas que liberan fragancia gradualmente. Perfume en la casa por más horas con menos producto.`,
    en: (n) =>
      `${n} — microcapsule cleaner that releases fragrance gradually over hours. More scent, less product.`,
  },
  especiales: {
    es: (n) =>
      `${n} — fórmula especial para tareas específicas del hogar. Concentrada, rinde por litros y cuida las superficies.`,
    en: (n) => `${n} — specialty formula for targeted home cleaning. Concentrated and surface-safe.`,
  },
  'pastillas-cloro': {
    es: (n) => `${n} — cloro sólido de alta pureza para desinfección de agua, inodoros y superficies.`,
    en: (n) => `${n} — high-purity solid chlorine for water, toilets, and surface disinfection.`,
  },
  desinfectantes: {
    es: (n) =>
      `${n} — desinfectante para hogar y negocio. Elimina hongos, bacterias y malos olores sobre pisos, paredes y baños.`,
    en: (n) =>
      `${n} — home and business disinfectant. Eliminates fungi, bacteria and odors on floors, walls and bathrooms.`,
  },
  desengrasantes: {
    es: (n) =>
      `${n} — desengrasante industrial que remueve grasa pesada de cocina, motores y pisos sin esfuerzo.`,
    en: (n) => `${n} — industrial degreaser that cuts heavy kitchen, engine and floor grease.`,
  },
  'detergentes-liquidos': {
    es: (n) =>
      `${n} — detergente líquido concentrado para ropa blanca y de color. Lava más con menos producto.`,
    en: (n) => `${n} — concentrated liquid detergent for whites and colors. More wash per bottle.`,
  },
  'detergentes-polvo': {
    es: (n) =>
      `${n} — detergente en polvo multiusos, ideal para ropa pesada y tandas grandes.`,
    en: (n) => `${n} — multi-use powder detergent, ideal for heavy fabrics and big loads.`,
  },
  suavizantes: {
    es: (n) => `${n} — suavizante para telas con fragancia duradera. Ropa suave y aromatizada.`,
    en: (n) => `${n} — fabric softener with long-lasting fragrance. Soft, scented laundry.`,
  },
  'suavizantes-doble-aroma': {
    es: (n) =>
      `${n} — suavizante doble aroma. Dos capas de perfume que perduran hasta la próxima lavada.`,
    en: (n) =>
      `${n} — double-scent fabric softener. Two fragrance layers that last until the next wash.`,
  },
  'jabon-barra': {
    es: (n) => `${n} — jabón de barra para prelavado, manchas difíciles y ropa delicada.`,
    en: (n) => `${n} — bar soap for pre-wash, tough stains and delicates.`,
  },
  'jabon-manos': {
    es: (n) =>
      `${n} — jabón líquido para manos. Suave con la piel, ideal para oficina, escuela y hogar.`,
    en: (n) => `${n} — liquid hand soap. Gentle for office, school and home.`,
  },
  'gel-antibacterial': {
    es: (n) =>
      `${n} — gel antibacterial con 70% de alcohol. Elimina el 99.9% de bacterias sin enjuague.`,
    en: (n) => `${n} — 70% alcohol antibacterial gel. Kills 99.9% of bacteria without rinsing.`,
  },
  sanitizantes: {
    es: (n) => `${n} — sanitizante líquido de uso general para superficies y utensilios.`,
    en: (n) => `${n} — general-use liquid sanitizer for surfaces and utensils.`,
  },
  'higiene-personal': {
    es: (n) => `${n} — producto de higiene personal de marcas reconocidas, a precio de mayorista.`,
    en: (n) => `${n} — brand-name personal hygiene product at wholesale pricing.`,
  },
  higienicos: {
    es: (n) =>
      `${n} — producto de higiene institucional para baños, negocios, oficinas y eventos.`,
    en: (n) => `${n} — institutional hygiene product for bathrooms, offices and events.`,
  },
  despachadores: {
    es: (n) =>
      `${n} — despachador comercial de alta resistencia. Compatible con consumibles estándar.`,
    en: (n) => `${n} — heavy-duty commercial dispenser. Compatible with standard refills.`,
  },
  autofresh: {
    es: (n) =>
      `${n} — aromatizante de ambiente con fragancia de larga duración. Perfecto para casa, auto y negocio.`,
    en: (n) =>
      `${n} — long-lasting air freshener. Perfect for home, car and business.`,
  },
  'linea-automotriz': {
    es: (n) =>
      `${n} — línea automotriz de uso profesional. Lava, encerra y da brillo a la carrocería y llantas.`,
    en: (n) =>
      `${n} — professional automotive line. Wash, wax and shine your body and tires.`,
  },
  trapeadores: {
    es: (n) =>
      `${n} — trapeador de alta absorción. Deja los pisos secos y limpios con menos esfuerzo.`,
    en: (n) => `${n} — high-absorbency mop. Cleans and dries floors fast.`,
  },
  escobas: {
    es: (n) => `${n} — escoba resistente para uso doméstico o industrial.`,
    en: (n) => `${n} — durable broom for home or industrial use.`,
  },
  fibras: {
    es: (n) => `${n} — fibra de limpieza para trastes, pisos y superficies.`,
    en: (n) => `${n} — cleaning fiber for dishes, floors and surfaces.`,
  },
  esponjas: {
    es: (n) => `${n} — esponja resistente para lavado y fregado.`,
    en: (n) => `${n} — durable sponge for washing and scrubbing.`,
  },
  cubetas: {
    es: (n) => `${n} — cubeta de plástico resistente, de grado alimenticio.`,
    en: (n) => `${n} — heavy-duty food-grade plastic bucket.`,
  },
  atomizadores: {
    es: (n) =>
      `${n} — atomizador reutilizable ideal para productos de limpieza diluidos y aromatizantes.`,
    en: (n) => `${n} — reusable spray bottle for diluted cleaners and air fresheners.`,
  },
  guantes: {
    es: (n) => `${n} — guantes protectores para tareas de limpieza pesada.`,
    en: (n) => `${n} — protective gloves for heavy cleaning work.`,
  },
  bolsas: {
    es: (n) => `${n} — bolsas resistentes para hogar y negocio.`,
    en: (n) => `${n} — durable bags for home and business.`,
  },
  accesorios: {
    es: (n) => `${n} — accesorio útil para tareas diarias de limpieza y dosificación.`,
    en: (n) => `${n} — handy tool for everyday cleaning and dispensing.`,
  },
  mascotas: {
    es: (n) => `${n} — producto de cuidado para mascotas de uso frecuente.`,
    en: (n) => `${n} — frequent-use pet care product.`,
  },
  varios: {
    es: (n) =>
      `${n} — producto especializado del catálogo Total Bri. Escríbenos para asesoría y usos sugeridos.`,
    en: (n) =>
      `${n} — specialty product from the Total Bri catalog. Message us for advice and suggested uses.`,
  },
};

const fallback: DescriptionTemplate = templates.varios!;

export function buildDescription(name: LocalizedString, subcategory: string): LocalizedString {
  const tpl = templates[subcategory] ?? fallback;
  return {
    es: tpl.es(name.es),
    en: tpl.en(name.en),
  };
}

export function usageNotes(subcategory: string, _category: Category) {
  const map: Record<string, LocalizedString> = {
    multiusos: {
      es: 'Diluir 1 tapa por litro de agua. Aplicar directo sobre la superficie, tallar y retirar con paño húmedo.',
      en: 'Dilute 1 cap per liter of water. Apply directly, scrub and wipe off with a damp cloth.',
    },
    desinfectantes: {
      es: 'Aplicar puro o diluido según superficie. Dejar actuar 2–5 minutos y enjuagar si es necesario.',
      en: 'Apply straight or diluted depending on surface. Let sit 2–5 minutes and rinse if needed.',
    },
    'gel-antibacterial': {
      es: 'Aplicar una cantidad suficiente en las manos secas y frotar hasta que se absorba. No requiere enjuague.',
      en: 'Apply enough to cover dry hands and rub until absorbed. No rinsing needed.',
    },
    'detergentes-liquidos': {
      es: 'Usar 1 tapa por cada 5 kg de ropa. Compatible con lavadoras automáticas.',
      en: 'Use 1 cap per 5 kg of laundry. Compatible with automatic washers.',
    },
  };
  return (
    map[subcategory] ?? {
      es: 'Sigue las instrucciones generales de uso del producto. Escríbenos para recomendaciones específicas.',
      en: 'Follow general product instructions. Contact us for specific recommendations.',
    }
  );
}
