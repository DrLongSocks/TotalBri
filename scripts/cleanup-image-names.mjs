import { readdirSync, renameSync, readFileSync, writeFileSync } from 'fs';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PRODUCTS_DIR = join(ROOT, 'public', 'images', 'products');
const CATALOG_PATH = join(ROOT, 'data', 'catalog.csv');

function safeName(filename) {
  const ext = extname(filename).toLowerCase();
  let name = filename.slice(0, filename.length - ext.length);

  // NFD → strip combining diacritical marks → pure ASCII
  name = name.normalize('NFD').replace(/[̀-ͯ]/g, '');

  // Remove problematic URL characters
  name = name.replace(/[$#]/g, '');

  // Replace spaces with hyphens
  name = name.replace(/\s+/g, '-');

  // Remove "copy N" suffixes added by macOS
  name = name.replace(/-copy-\d+$/i, '');

  // Remove trailing underscores and hyphens
  name = name.replace(/[_-]+$/, '');

  // Collapse multiple hyphens
  name = name.replace(/-{2,}/g, '-');

  // Lowercase
  name = name.toLowerCase();

  return name + '.jpg';
}

// Build rename map (oldName → newName), skip if already clean
const files = readdirSync(PRODUCTS_DIR).filter(f =>
  ['.jpg', '.jpeg', '.png'].includes(extname(f).toLowerCase()) &&
  !f.includes('website pic collection')
);

const renames = new Map();
for (const file of files) {
  const clean = safeName(file);
  if (clean !== file) {
    renames.set(file, clean);
  }
}

if (renames.size === 0) {
  console.log('All filenames are already clean.');
  process.exit(0);
}

// Check for collisions
const targets = new Set();
for (const [old, next] of renames) {
  if (targets.has(next)) {
    console.warn(`⚠  Collision: ${old} → ${next} (skipped)`);
    renames.delete(old);
  }
  targets.add(next);
}

// Rename files
for (const [old, next] of renames) {
  renameSync(join(PRODUCTS_DIR, old), join(PRODUCTS_DIR, next));
  console.log(`✓  ${old} → ${next}`);
}

// Update catalog.csv - replace every old path with new path
let catalog = readFileSync(CATALOG_PATH, 'utf8');
for (const [old, next] of renames) {
  // Escape special regex chars in old filename
  const escaped = old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  catalog = catalog.replace(new RegExp(escaped, 'g'), next);
}
writeFileSync(CATALOG_PATH, catalog, 'utf8');
console.log(`\nUpdated catalog.csv — ${renames.size} paths fixed.`);
