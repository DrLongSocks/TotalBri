import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PRODUCTS_DIR = join(ROOT, 'public', 'images', 'products');
const CATALOG_PATH = join(ROOT, 'data', 'catalog.csv');

// All cleaned photo filenames now in products/
const photos = readdirSync(PRODUCTS_DIR)
  .filter(f => extname(f).toLowerCase() === '.jpg');
const photoSet = new Set(photos);

// Parse catalog
const raw = readFileSync(CATALOG_PATH, 'utf8');
const lines = raw.split('\n');
const header = lines[0];
const rows = lines.slice(1).filter(Boolean);

// Already-referenced photos (skip these from matching)
const referenced = new Set(
  rows.map(r => {
    const cols = r.split(',');
    const img = cols[11]?.trim();
    return img ? img.split('/').pop() : null;
  }).filter(Boolean)
);

// Photos not yet referenced in catalog
const unreferenced = photos.filter(p => !referenced.has(p));

// Score how well a photo name matches a product slug
function score(photoName, slug) {
  const photoWords = photoName.replace('.jpg', '').split('-').filter(w => w.length > 2);
  const slugWords = slug.split('-').filter(w => w.length > 2);
  return photoWords.filter(w => slugWords.includes(w)).length;
}

// For each unreferenced photo, find the best unmatched catalog product
const unmatchedProducts = rows
  .map((r, i) => {
    const cols = r.split(',');
    const img = cols[11]?.trim();
    const hasPhoto = img && photoSet.has(img.split('/').pop());
    return hasPhoto ? null : { idx: i, slug: cols[1]?.trim(), name: cols[2]?.trim() };
  })
  .filter(Boolean);

const assignments = new Map(); // photoName → product index
const usedProducts = new Set();

for (const photo of unreferenced) {
  let best = null;
  let bestScore = 0;
  for (const product of unmatchedProducts) {
    if (usedProducts.has(product.idx)) continue;
    const s = score(photo, product.slug);
    if (s > bestScore) { bestScore = s; best = product; }
  }
  if (best && bestScore >= 2) {
    assignments.set(photo, best);
    usedProducts.add(best.idx);
  }
}

// Apply assignments to catalog rows
let updatedRows = [...rows];
for (const [photo, product] of assignments) {
  const cols = updatedRows[product.idx].split(',');
  cols[11] = `images/products/${photo}`;
  updatedRows[product.idx] = cols.join(',');
}

writeFileSync(CATALOG_PATH, [header, ...updatedRows].join('\n') + '\n', 'utf8');

// Report
console.log(`\n✅ MATCHED (${assignments.size}):`);
for (const [photo, product] of assignments) {
  console.log(`  ${product.name} ← ${photo}`);
}

const stillUnmatched = unmatchedProducts.filter(p => !usedProducts.has(p.idx));
console.log(`\n⚠️  STILL NO PHOTO (${stillUnmatched.length}):`);
stillUnmatched.forEach(p => console.log(`  ${p.name} (${p.slug})`));

const skipped = unreferenced.filter(p => !assignments.has(p));
console.log(`\n📁 PHOTOS WITH NO CATALOG MATCH (${skipped.length}):`);
skipped.forEach(p => console.log(`  ${p}`));
