// Verificación automatizada del sitio con Chrome/Edge headless (puppeteer-core).
// Sirve la raíz del proyecto en http://localhost:8089, recorre las cuatro secciones en
// 360 / 768 / 1024 / 1440 px y comprueba: sección activa y aria-current, imágenes rotas,
// desbordamiento horizontal, solapamiento del botón flotante con enlaces, errores de consola,
// navegación por hash (clic, atrás) y el enlace "Saltar al contenido".
// Capturas en tools/shots/. Uso: cd tools && npm install && node verify-site.mjs
// Navegador: variable CHROME_PATH o detección de Chrome/Edge en rutas habituales de Windows.

import puppeteer from 'puppeteer-core';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'tools', 'shots');
fs.mkdirSync(OUT, { recursive: true });
const PORT = 8089;
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml' };

function chromePath() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;
  const candidates = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  ];
  const found = candidates.find((p) => fs.existsSync(p));
  if (!found) throw new Error('No se encontró Chrome ni Edge. Define CHROME_PATH.');
  return found;
}

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
  if (p === '/') p = '/index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(PORT, r));

const browser = await puppeteer.launch({ executablePath: chromePath(), headless: true, args: ['--no-sandbox', '--disable-gpu'] });
const sections = ['inicio', 'nosotros', 'servicios', 'contacto'];
const viewports = [
  { name: 'movil', width: 360, height: 740, dsf: 2 },
  { name: 'tablet', width: 768, height: 1024, dsf: 1 },
  { name: 'laptop', width: 1024, height: 768, dsf: 1 },
  { name: 'escritorio', width: 1440, height: 900, dsf: 1 },
];
let fallos = 0;
const fail = (msg) => { fallos++; console.log('  FALLO: ' + msg); };

for (const vp of viewports) {
  const page = await browser.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: vp.dsf });
  console.log(`\n[${vp.name} ${vp.width}px]`);
  for (const s of sections) {
    await page.goto(`http://localhost:${PORT}/?v=${s}#${s}`, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.evaluate(async () => {
      const step = Math.max(300, window.innerHeight - 100);
      for (let y = 0; y < document.body.scrollHeight; y += step) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
      window.scrollTo(0, 0);
    });
    await page.waitForNetworkIdle({ idleTime: 300, timeout: 15000 }).catch(() => {});
    const info = await page.evaluate((sec) => {
      const active = [...document.querySelectorAll('.section.is-active')].map((e) => e.id);
      const current = document.querySelector('nav[aria-label="Principal"] a[aria-current="page"]')?.getAttribute('href') || null;
      const visible = [...document.querySelectorAll('img')].filter((i) => i.getClientRects().length > 0);
      const broken = visible.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.getAttribute('src'));
      const fab = document.querySelector('.whatsapp-float');
      const enViewport = (r) => r && r.width > 0 && r.top >= 0 && r.bottom <= window.innerHeight && r.right <= window.innerWidth;
      window.scrollTo(0, Math.floor(document.body.scrollHeight / 2));
      const fabMedio = fab ? enViewport(fab.getBoundingClientRect()) : false;
      window.scrollTo(0, document.body.scrollHeight);
      const fr = fab ? fab.getBoundingClientRect() : null;
      const fabFinal = enViewport(fr);
      const overlaps = fr ? [...document.querySelectorAll('footer a, footer p, footer strong, .contacto a')].filter((a) => { const r = a.getBoundingClientRect(); return r.width > 0 && !(r.right < fr.left || r.left > fr.right || r.bottom < fr.top || r.top > fr.bottom); }).map((a) => a.textContent.trim().slice(0, 30) || a.getAttribute('aria-label')) : [];
      window.scrollTo(0, 0);
      return { active, current, broken, overlaps, hScroll: document.documentElement.scrollWidth > window.innerWidth, sw: document.documentElement.scrollWidth, iw: window.innerWidth, bg: getComputedStyle(document.body).backgroundColor, fab: fabMedio && fabFinal };
    }, s);
    await page.screenshot({ path: path.join(OUT, `${s}-${vp.name}.png`), fullPage: true });
    const ok = info.active.length === 1 && info.active[0] === s && info.current === '#' + s && !info.broken.length && !info.hScroll && !info.overlaps.length && info.fab && info.bg === 'rgb(255, 255, 255)';
    console.log(`  ${ok ? 'OK   ' : 'ERROR'} #${s}: activa=${info.active} menú=${info.current} rotas=${info.broken.length} desborde=${info.hScroll ? info.sw + '/' + info.iw : 'no'} flotante-visible(medio+final)=${info.fab} solapa=${info.overlaps.length}`);
    if (!ok) fail(`${vp.name} #${s} ${JSON.stringify(info)}`);
  }
  if (errors.length) fail(`${vp.name} errores de consola: ${errors.join(' | ')}`);
  await page.close();
}

// Navegación por hash y enlace de salto
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(`http://localhost:${PORT}/#servicios`, { waitUntil: 'networkidle2' });
const initial = await page.evaluate(() => document.querySelector('.section.is-active').id);
await page.click('nav[aria-label="Principal"] a[href="#contacto"]');
await new Promise((r) => setTimeout(r, 200));
const afterClick = await page.evaluate(() => [document.querySelector('.section.is-active').id, location.hash, document.activeElement.id]);
await page.goBack();
await new Promise((r) => setTimeout(r, 300));
const afterBack = await page.evaluate(() => [document.querySelector('.section.is-active').id, location.hash]);
await page.close();
const fresh = await browser.newPage();
await fresh.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle2' });
await fresh.keyboard.press('Tab');
const skip = await fresh.evaluate(() => document.activeElement.textContent.trim());
await fresh.close();
console.log('\n[navegación]');
console.log(`  inicio con #servicios → ${initial}; clic Contacto → ${afterClick.join(' ')}; atrás → ${afterBack.join(' ')}; primer Tab → "${skip}"`);
if (initial !== 'servicios' || afterClick[0] !== 'contacto' || afterClick[2] !== 'contacto-titulo' || afterBack[0] !== 'servicios' || skip !== 'Saltar al contenido') fail('navegación por hash o enlace de salto');

await browser.close();
server.close();
console.log(`\n${fallos ? fallos + ' fallo(s)' : 'Todo en orden'}. Capturas en tools/shots/`);
process.exit(fallos ? 1 : 0);
