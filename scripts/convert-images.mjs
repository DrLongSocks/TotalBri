import sharp from 'sharp';
import { readdirSync, existsSync, mkdirSync, copyFileSync } from 'fs';
import { join, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const INPUT_DIR = join(ROOT, 'public', 'images', 'website-pic-collection');
const OUTPUT_DIR = join(ROOT, 'public', 'images', 'products');
const QUALITY = 85;

function stripAccents(str) {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

if (!existsSync(INPUT_DIR)) {
  console.error(`Input folder not found: ${INPUT_DIR}`);
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });

const allFiles = readdirSync(INPUT_DIR).filter(f => ['.png', '.jpg', '.jpeg'].includes(extname(f).toLowerCase()));

if (allFiles.length === 0) {
  console.log('No image files found in the staging folder.');
  process.exit(0);
}

let converted = 0;
let copied = 0;
let skipped = 0;

for (const file of allFiles) {
  const ext = extname(file).toLowerCase();
  const outputName = stripAccents(basename(file, ext)) + '.jpg';
  const outputPath = join(OUTPUT_DIR, outputName);

  if (existsSync(outputPath)) {
    console.log(`⏭  skipped (already exists): ${outputName}`);
    skipped++;
    continue;
  }

  if (ext === '.png') {
    await sharp(join(INPUT_DIR, file))
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toFile(outputPath);
    console.log(`✓  ${file} → ${outputName}`);
    converted++;
  } else {
    copyFileSync(join(INPUT_DIR, file), outputPath);
    console.log(`⇒  ${file} → ${outputName} (copied)`);
    copied++;
  }
}

console.log(`\nDone: ${converted} converted, ${copied} copied, ${skipped} skipped.`);
