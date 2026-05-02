import { readFileSync, writeFileSync, renameSync, unlinkSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CATALOG_PATH = join(ROOT, 'data', 'catalog.csv');
const PRODUCTS_DIR = join(ROOT, 'public', 'images', 'products');

// ── 1. File operations ────────────────────────────────────────────────────────

// Rename artboard-1.jpg → jabon-de-tocador-rosa.jpg
const artboard = join(PRODUCTS_DIR, 'artboard-1.jpg');
const jabonDeTocador = join(PRODUCTS_DIR, 'jabon-de-tocador-rosa.jpg');
if (existsSync(artboard)) {
  renameSync(artboard, jabonDeTocador);
  console.log('✓  artboard-1.jpg → jabon-de-tocador-rosa.jpg');
}

// Delete Artboard copy 27 (duplicate design file)
const artboard27 = join(PRODUCTS_DIR, 'Artboard 1 copy 27.jpg');
if (existsSync(artboard27)) {
  unlinkSync(artboard27);
  console.log('🗑  Deleted: Artboard 1 copy 27.jpg');
}

// Delete duplicate persil photo
const persil2 = join(PRODUCTS_DIR, 'detergente-liquido-tipo-persil-2.jpg');
if (existsSync(persil2)) {
  unlinkSync(persil2);
  console.log('🗑  Deleted: detergente-liquido-tipo-persil-2.jpg');
}

// Fix P238 — points to file with spaces/capitals, update to clean version
// Both P238 and P239 will use despachador-kim-barra.jpg (same product photo)
const dirtyKim = join(PRODUCTS_DIR, 'Despachador-Kim-Barra copy 3.jpg');
if (existsSync(dirtyKim)) {
  unlinkSync(dirtyKim);
  console.log('🗑  Deleted: Despachador-Kim-Barra copy 3.jpg (duplicate)');
}

// ── 2. Catalog updates ────────────────────────────────────────────────────────

const raw = readFileSync(CATALOG_PATH, 'utf8');
const lines = raw.split('\n');
const header = lines[0];
const rows = lines.slice(1);

// Map of product ID → new image path
const imageUpdates = {
  P076: 'images/products/suavitel-azul.jpg',
  P129: 'images/products/jeringa-cucarachas-130.jpg',
  P151: 'images/products/escoba-veneciana.jpg',
  P155: 'images/products/escoba-mega.jpg',
  P171: 'images/products/cubeta-16-56.jpg',
  P175: 'images/products/embudo-grande-41.jpg',
  P181: 'images/products/atomizador-1-litro-40.jpg',
  P218: 'images/products/franela-roja-29.jpg',
  P238: 'images/products/despachador-kim-barra.jpg',
  P251: 'images/products/hig-dalia-pieza-39.jpg',
  P253: 'images/products/toalla-en-rollo-fapsa-tr180.jpg',
  P257: 'images/products/cofias.jpg',
};

const updatedRows = rows.map(row => {
  if (!row.trim()) return row;
  const cols = row.split(',');
  const id = cols[0];
  if (imageUpdates[id]) {
    cols[11] = imageUpdates[id];
    console.log(`✓  ${id} image → ${imageUpdates[id]}`);
    return cols.join(',');
  }
  return row;
});

// ── 3. New products ───────────────────────────────────────────────────────────

const newProducts = [
  'P264,jabon-de-tocador-rosa,Jabón de Tocador Rosa,Pink Bar Soap,varios,varios,20,jabon;tocador;rosa,true,false,pieza,images/products/jabon-de-tocador-rosa.jpg',
  'P265,pastilla-mary,Pastilla Mary,Mary Tablet,higiene,higienicos,15,pastilla;mary,true,false,pieza,images/products/pastilla-mary-15.jpg',
  'P266,limpia-pisos-coco,Limpiapisos Coco,Coconut Multi-Surface Cleaner,limpieza-hogar,multiusos,12,limpieza;coco;aroma,true,false,litro,images/products/limpia-pisos-coco.jpg',
  'P267,jerga-rayada,Jerga Rayada,Striped Cleaning Cloth,jarceria,accesorios,29,jerga;rayada;limpieza,true,false,pieza,images/products/jerga-rayada-29.jpg',
  'P268,despachador-generico,Despachador,Dispenser,higiene,despachadores,0,despachador,true,false,pieza,images/products/despachador.jpg',
];

newProducts.forEach(p => {
  const id = p.split(',')[0];
  console.log(`✓  Added new product: ${id} — ${p.split(',')[2]}`);
});

// ── 4. Write catalog ──────────────────────────────────────────────────────────

const finalLines = [header, ...updatedRows.filter(Boolean), ...newProducts];
writeFileSync(CATALOG_PATH, finalLines.join('\n') + '\n', 'utf8');
console.log('\nDone. catalog.csv updated.');
