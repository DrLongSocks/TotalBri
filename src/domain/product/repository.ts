import Papa from 'papaparse';
import fs from 'node:fs';
import path from 'node:path';
import { ProductSchema, type Product, type Category } from './schema';
import { buildDescription } from './descriptions';

type CsvRow = {
  id: string;
  slug: string;
  name_es: string;
  name_en: string;
  category: string;
  subcategory: string;
  price: string;
  tags: string;
  in_stock: string;
  featured: string;
};

function toBool(value: string): boolean {
  return value.trim().toLowerCase() === 'true';
}

function parseTags(raw: string): string[] {
  return raw
    .split(';')
    .map((t) => t.trim())
    .filter(Boolean);
}

function placeholderUrl(name: string): string {
  const label = encodeURIComponent(name);
  return `https://placehold.co/800x800/F6F9FC/0A2540?text=${label}`;
}

function loadProducts(): { list: readonly Product[]; bySlug: Map<string, Product>; byId: Map<string, Product> } {
  const csvPath = path.join(process.cwd(), 'data', 'catalog.csv');
  const raw = fs.readFileSync(csvPath, 'utf8');
  const parsed = Papa.parse<CsvRow>(raw, { header: true, skipEmptyLines: true });

  if (parsed.errors.length) {
    const first = parsed.errors[0]!;
    throw new Error(`CSV parse error at row ${first.row}: ${first.message}`);
  }

  const list: Product[] = parsed.data.map((row, idx) => {
    const nameEs = row.name_es?.trim() ?? '';
    const nameEn = (row.name_en?.trim() || nameEs).trim();
    const price = Number(row.price);
    if (Number.isNaN(price)) {
      throw new Error(`Invalid price at row ${idx + 2} (id=${row.id}): ${row.price}`);
    }

    const localImage = `/images/products/${row.slug}.webp`;
    const name = { es: nameEs, en: nameEn };
    const description = buildDescription(name, row.subcategory);

    const draft = {
      id: row.id,
      slug: row.slug,
      name,
      description,
      category: row.category as Category,
      subcategory: row.subcategory,
      price,
      images: [localImage, placeholderUrl(nameEs)],
      tags: parseTags(row.tags ?? ''),
      inStock: toBool(row.in_stock ?? 'true'),
      featured: toBool(row.featured ?? 'false'),
    };

    try {
      return ProductSchema.parse(draft);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`Invalid product at row ${idx + 2} (id=${row.id}): ${message}`);
    }
  });

  const frozen = Object.freeze(list);
  const bySlug = new Map(frozen.map((p) => [p.slug, p]));
  const byId = new Map(frozen.map((p) => [p.id, p]));

  return { list: frozen, bySlug, byId };
}

let cached: ReturnType<typeof loadProducts> | null = null;

function getData() {
  if (!cached) {
    cached = loadProducts();
  }
  return cached;
}

export function getAllProducts(): readonly Product[] {
  return getData().list;
}

export function getProductBySlug(slug: string): Product | undefined {
  return getData().bySlug.get(slug);
}

export function getProductById(id: string): Product | undefined {
  return getData().byId.get(id);
}
