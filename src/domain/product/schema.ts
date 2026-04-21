import { z } from 'zod';

export const CategoryEnum = z.enum([
  'detergentes',
  'suavizantes',
  'limpiadores-pisos',
  'desinfectantes',
  'linea-automotriz',
  'desengrasantes',
  'aromatizantes',
  'jarceria',
  'trapeadores',
  'escobas',
  'despachadores',
  'higienicos',
  'varios',
]);

export const LocalizedString = z.object({
  es: z.string().min(1),
  en: z.string().min(1),
});

export const ProductSchema = z.object({
  id: z.string().regex(/^P\d{3,}$/),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: LocalizedString,
  description: LocalizedString,
  category: CategoryEnum,
  subcategory: z.string().min(1),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
  images: z.array(z.string()).min(1),
  tags: z.array(z.string()),
  inStock: z.boolean(),
  featured: z.boolean(),
  unit: z.enum(['litro', 'pieza', 'kilo']),
});

export type Product = z.infer<typeof ProductSchema>;
export type Category = z.infer<typeof CategoryEnum>;
export type LocalizedString = z.infer<typeof LocalizedString>;
