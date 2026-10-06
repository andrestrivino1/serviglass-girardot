// Verifica el contraste WCAG 2.1 de los pares de tokens definidos en
// specs/001-serviglass-site-refresh/contracts/design-tokens.md (§1 "Contraste verificado").
// Uso: node tools/contrast-check.mjs  → código de salida 1 si algún par falla.

const TOKENS = {
  fondo: '#FFFFFF',
  'azul-50': '#F3F8FB',
  'azul-100': '#E8F3F9',
  texto: '#1F2933',
  'texto-sec': '#4B5563',
  'texto-muted': '#6B7280',
  'verde-500': '#28770A',
  'verde-600': '#236809',
  'verde-700': '#1C6407',
  'azul-400': '#2A77D5',
  'azul-600': '#153B96',
  'azul-900': '#041B58',
  wa: '#128C7E',
  'atrio-noche': '#1E1726',
  'atrio-acento-claro': '#9A5F2C',
  'atrio-texto': '#5A4F63',
  blanco: '#FFFFFF',
};

// [primer plano, fondo, umbral, uso]
const PARES = [
  ['texto', 'fondo', 4.5, 'texto de lectura'],
  ['texto', 'azul-50', 4.5, 'texto sobre franjas'],
  ['texto-sec', 'fondo', 4.5, 'texto secundario'],
  ['texto-muted', 'fondo', 4.5, 'notas y pie'],
  ['texto-muted', 'azul-50', 4.5, 'notas sobre franjas'],
  ['azul-900', 'fondo', 4.5, 'títulos'],
  ['azul-600', 'fondo', 4.5, 'enlaces'],
  ['azul-600', 'azul-100', 4.5, 'enlaces sobre píldoras'],
  ['verde-600', 'fondo', 4.5, 'texto verde / marcas de verificación'],
  ['verde-500', 'fondo', 3.0, 'íconos'],
  ['azul-400', 'fondo', 3.0, 'íconos y texto grande'],
  ['blanco', 'verde-600', 4.5, 'texto del botón primario'],
  ['blanco', 'verde-700', 4.5, 'texto del botón primario (hover)'],
  ['blanco', 'azul-600', 4.5, 'texto sobre azul'],
  ['blanco', 'wa', 3.0, 'ícono del botón de WhatsApp'],
  ['wa', 'fondo', 3.0, 'frontera del botón de WhatsApp'],
  ['atrio-texto', 'fondo', 4.5, '"Desarrollado por"'],
  ['atrio-acento-claro', 'fondo', 4.5, '"AT" del wordmark ATRIO'],
  ['atrio-noche', 'fondo', 4.5, '"RIO" del wordmark ATRIO'],
];

const lin = (v) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const luminancia = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
const ratio = (a, b) => {
  const [hi, lo] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

let fallos = 0;
console.log('primer plano'.padEnd(20), 'fondo'.padEnd(12), 'ratio'.padStart(6), ' umbral', ' resultado  uso');
for (const [fg, bg, umbral, uso] of PARES) {
  const r = ratio(TOKENS[fg], TOKENS[bg]);
  const ok = r >= umbral;
  if (!ok) fallos++;
  console.log(
    `${fg} ${TOKENS[fg]}`.padEnd(20),
    `${bg}`.padEnd(12),
    r.toFixed(2).padStart(6),
    `  ${umbral.toFixed(1)}`,
    `   ${ok ? 'PASS' : 'FAIL'}      ${uso}`,
  );
}
console.log(`\n${PARES.length - fallos}/${PARES.length} pares cumplen.`);
process.exit(fallos ? 1 : 0);
