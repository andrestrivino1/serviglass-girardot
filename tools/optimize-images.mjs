// Optimización de imágenes del sitio Serviglass Girardot.
// Lee specs/001-serviglass-site-refresh/assets/ y escribe images/.
// Uso: cd tools && npm install && node optimize-images.mjs
// Idempotente: cada ejecución regenera todas las salidas.

import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = path.join(ROOT, 'specs', '001-serviglass-site-refresh', 'assets');
const OUT = path.join(ROOT, 'images');

const rows = [];

async function record(file) {
  const s = await stat(file);
  rows.push({ file: path.relative(ROOT, file).replaceAll('\\', '/'), kb: s.size / 1024 });
}

async function ensure(dir) {
  await mkdir(dir, { recursive: true });
}

/** Genera <outBase>.jpg y <outBase>.webp con el mismo redimensionado. */
async function jpgAndWebp(input, outBase, resize, { quality = 82, flatten = false, extract = null } = {}) {
  const pipeline = () => {
    let p = sharp(input).rotate();
    if (extract) p = p.extract(extract);
    if (flatten) p = p.flatten({ background: '#ffffff' });
    return p.resize(resize);
  };
  await pipeline().jpeg({ quality, mozjpeg: true, chromaSubsampling: '4:2:0' }).toFile(`${outBase}.jpg`);
  await record(`${outBase}.jpg`);
  await pipeline().webp({ quality }).toFile(`${outBase}.webp`);
  await record(`${outBase}.webp`);
  const meta = await sharp(`${outBase}.jpg`).metadata();
  return { width: meta.width, height: meta.height };
}

async function equipo() {
  const dir = path.join(OUT, 'equipo');
  await ensure(dir);
  const personas = ['mario-dominguez', 'tatiana-lenis', 'julio-sanchez', 'laura-avila'];
  const dims = {};
  for (const slug of personas) {
    dims[slug] = await jpgAndWebp(
      path.join(ASSETS, 'equipo', `${slug}.png`),
      path.join(dir, slug),
      { width: 360, height: 480, fit: 'cover', position: 'top' },
      { quality: 82, flatten: true },
    );
  }
  return dims;
}

async function planta() {
  const dir = path.join(OUT, 'planta');
  await ensure(dir);
  const dims = {};
  for (const n of [1, 2, 3, 4, 5]) {
    const name = `planta-0${n}`;
    dims[name] = await jpgAndWebp(
      path.join(ASSETS, 'empresa', `${name}.jpeg`),
      path.join(dir, name),
      { width: 1200, withoutEnlargement: true },
      { quality: 82 },
    );
  }
  return dims;
}

async function aliados() {
  const dir = path.join(OUT, 'aliados');
  await ensure(dir);
  const mapa = {
    'jm-construcciones': 'vidrios-y-aluminios-jm-construcciones.jpeg',
    'fc-fabian-cano': 'vidrios-y-aluminios-fc-fabian-cano.jpeg',
    'techos-y-aluminios': 'techos-y-aluminios.jpeg',
    'vg-ingenieria': 'ingenieria-construcciones-creaciones-vg.jpeg',
  };
  // Recortes por aliado (fracción de la altura que se conserva desde arriba).
  // fc-fabian-cano: el original trae una franja inferior con un número de WhatsApp que no debe publicarse.
  const recortes = { 'fc-fabian-cano': 0.82 };
  const dims = {};
  for (const [slug, src] of Object.entries(mapa)) {
    const input = path.join(ASSETS, 'aliados', src);
    let extract = null;
    if (recortes[slug]) {
      const m = await sharp(input).metadata();
      extract = { left: 0, top: 0, width: m.width, height: Math.round(m.height * recortes[slug]) };
    }
    dims[slug] = await jpgAndWebp(
      input,
      path.join(dir, slug),
      { height: 160, withoutEnlargement: true },
      { quality: 85, flatten: true, extract },
    );
  }
  return dims;
}

/** Devuelve el recuadro {x0,y0,x1,y1} del emblema (primer bloque de contenido no blanco, antes del texto). */
async function detectarEmblema(logo) {
  const { data, info } = await sharp(logo).greyscale().raw().toBuffer({ resolveWithObject: true });
  const W = info.width;
  const H = info.height;
  const UMBRAL = 235;
  const filaConTinta = new Array(H).fill(false);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (data[y * W + x] < UMBRAL) { filaConTinta[y] = true; break; }
    }
  }
  const y0 = filaConTinta.indexOf(true);
  let y1 = y0;
  for (let y = y0; y < H; y++) {
    if (filaConTinta[y]) { y1 = y; continue; }
    let gap = 0;
    while (y + gap < H && !filaConTinta[y + gap]) gap++;
    if (gap >= 6 && y1 - y0 > 40) break; // fin del emblema: hueco blanco antes del texto
    y += gap - 1;
  }
  let x0 = W; let x1 = 0;
  for (let y = y0; y <= y1; y++) {
    for (let x = 0; x < W; x++) {
      if (data[y * W + x] < UMBRAL) { if (x < x0) x0 = x; if (x > x1) x1 = x; }
    }
  }
  return { x0, y0, x1, y1, W, H };
}

async function logoYFavicons() {
  const logo = path.join(ASSETS, 'logo-nuevo-serviglass.jpeg');
  await ensure(OUT);
  await sharp(logo).jpeg({ quality: 90, mozjpeg: true }).toFile(path.join(OUT, 'logo-serviglass.jpg'));
  await record(path.join(OUT, 'logo-serviglass.jpg'));

  const b = await detectarEmblema(logo);
  // Recorte ajustado al emblema (poco aire vertical para no tocar el texto) y
  // luego encajado en un lienzo cuadrado blanco.
  const padX = Math.round((b.x1 - b.x0) * 0.06);
  const padY = Math.min(4, b.y0);
  const left = Math.max(0, b.x0 - padX);
  const top = Math.max(0, b.y0 - padY);
  const width = Math.min(b.W - left, b.x1 - b.x0 + 2 * padX);
  const height = Math.min(b.H - top, b.y1 - b.y0 + 2 * padY);
  console.log(`Emblema detectado: x ${b.x0}-${b.x1}, y ${b.y0}-${b.y1} → recorte ${width}×${height} en (${left},${top})`);

  const emblema = () => sharp(logo).extract({ left, top, width, height });
  for (const [name, size] of [['favicon-32.png', 32], ['favicon-192.png', 192], ['apple-touch-icon.png', 180]]) {
    const file = path.join(OUT, name);
    await emblema()
      .resize(size, size, { fit: 'contain', background: '#ffffff', kernel: 'lanczos3' })
      .png({ compressionLevel: 9 })
      .toFile(file);
    await record(file);
  }

  // Open Graph 1200×630: logo centrado sobre blanco.
  const logoOg = await sharp(logo).resize({ width: 800 }).toBuffer();
  const ogFile = path.join(OUT, 'og-image.jpg');
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#ffffff' } })
    .composite([{ input: logoOg, gravity: 'centre' }])
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(ogFile);
  await record(ogFile);
}

async function main() {
  const t0 = Date.now();
  await logoYFavicons();
  const dims = {
    equipo: await equipo(),
    planta: await planta(),
    aliados: await aliados(),
  };

  console.log('\nDimensiones (para width/height en el HTML):');
  for (const [grupo, items] of Object.entries(dims)) {
    for (const [name, d] of Object.entries(items)) console.log(`  ${grupo}/${name}: ${d.width}×${d.height}`);
  }

  console.log('\nSalidas:');
  let total = 0;
  for (const r of rows) {
    total += r.kb;
    console.log(`  ${r.kb.toFixed(0).padStart(5)} KB  ${r.file}`);
  }
  console.log(`\nTotal images/ generado: ${(total / 1024).toFixed(2)} MB en ${((Date.now() - t0) / 1000).toFixed(1)} s`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
