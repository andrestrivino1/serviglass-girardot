# Design Tokens: paleta, tipografía, espaciado

**Feature**: `001-serviglass-site-refresh` · **Date**: 2026-10-06

Los tokens se declaran en `:root` al inicio de `styles.css`. Los colores de marca se muestrearon del logo nuevo (ver research.md R3). Los contrastes son WCAG 2.1 (luminancia relativa) y se recalculan con `tools/contrast-check.mjs`.

## 1. Color

### Fondo y neutros

| Token | Valor | Uso |
|-------|-------|-----|
| `--fondo` | `#FFFFFF` | fondo de página y de tarjetas |
| `--azul-50` | `#F3F8FB` | fondo de franjas (aliados, testimonios, galería), hover de tarjetas |
| `--azul-100` | `#E8F3F9` | fondo de íconos circulares, pastillas de horario |
| `--borde` | `#D9E2EC` | bordes de tarjetas, separadores, marco de fotos |
| `--texto` | `#1F2933` | texto de lectura |
| `--texto-sec` | `#4B5563` | texto secundario (cargos, subtítulos) |
| `--texto-muted` | `#6B7280` | notas, pie de página, `cite` |

### Marca Serviglass

| Token | Valor | Uso |
|-------|-------|-----|
| `--verde-500` | `#28770A` | íconos, marcas de verificación, acentos |
| `--verde-600` | `#236809` | botón primario (fondo), enlaces en hover |
| `--verde-700` | `#1C6407` | hover/active del botón primario, subtítulos verdes |
| `--azul-400` | `#2A77D5` | íconos y detalles decorativos (nunca texto < 24 px) |
| `--azul-600` | `#153B96` | enlaces, botón secundario (borde y texto), ícono activo del menú |
| `--azul-900` | `#041B58` | títulos h1/h2/h3, texto del encabezado, `theme-color` |
| `--degradado-marca` | `linear-gradient(135deg, #236809, #153B96)` | solo franjas decorativas finas (borde superior del hero/banner); nunca detrás de texto |

### WhatsApp

| Token | Valor | Uso |
|-------|-------|-----|
| `--wa` | `#128C7E` | fondo del botón flotante y de los botones de WhatsApp |
| `--wa-hover` | `#075E54` | hover/focus |
| `--wa-brand` | `#25D366` | solo como detalle decorativo (punto/anillo), nunca como único contraste |

### ATRIO (solo en `.footer__credit`)

| Token | Valor | Uso |
|-------|-------|-----|
| `--atrio-noche` | `#1E1726` | "RIO" del wordmark |
| `--atrio-acento-claro` | `#9A5F2C` | "AT" del wordmark sobre blanco |
| `--atrio-texto` | `#5A4F63` | "Desarrollado por" |

### Contraste verificado (pares obligatorios)

| Primer plano | Fondo | Ratio | Umbral | Resultado |
|--------------|-------|-------|--------|-----------|
| `--texto` #1F2933 | `--fondo` #FFFFFF | 14.76 | 4.5 | PASS |
| `--texto` #1F2933 | `--azul-50` #F3F8FB | 13.79 | 4.5 | PASS |
| `--texto-sec` #4B5563 | `--fondo` | 7.56 | 4.5 | PASS |
| `--texto-muted` #6B7280 | `--fondo` | 4.83 | 4.5 | PASS |
| `--texto-muted` #6B7280 | `--azul-50` | 4.52 | 4.5 | PASS |
| `--azul-900` #041B58 | `--fondo` | 16.12 | 4.5 | PASS |
| `--azul-600` #153B96 | `--fondo` | 10.01 | 4.5 | PASS |
| `--azul-600` #153B96 | `--azul-100` #E8F3F9 | 8.88 | 4.5 | PASS |
| `--verde-600` #236809 | `--fondo` | 6.87 | 4.5 | PASS |
| `--verde-500` #28770A | `--fondo` | 5.62 | 3.0 (ícono) | PASS |
| `--azul-400` #2A77D5 | `--fondo` | 4.47 | 3.0 (ícono / texto grande) | PASS |
| `#FFFFFF` (texto) | `--verde-600` #236809 | 6.87 | 4.5 | PASS |
| `#FFFFFF` (texto) | `--verde-700` #1C6407 | 7.30 | 4.5 | PASS |
| `#FFFFFF` (texto) | `--azul-600` #153B96 | 10.01 | 4.5 | PASS |
| `#FFFFFF` (ícono) | `--wa` #128C7E | 4.14 | 3.0 | PASS |
| `--wa` #128C7E | `--fondo` (frontera del botón) | 4.14 | 3.0 | PASS |
| `--atrio-texto` #5A4F63 | `--fondo` | 7.23 | 4.5 | PASS |
| `--atrio-acento-claro` #9A5F2C | `--fondo` | 5.74 | 4.5 | PASS |
| `--atrio-noche` #1E1726 | `--fondo` | 16.0 | 4.5 | PASS |

Prohibido como texto sobre blanco: `#43B02A` (2.81), `#25D366` (1.98), `--azul-400` por debajo de 24 px.

## 2. Tipografía

| Token | Valor |
|-------|-------|
| `--fuente` | `"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` |
| `--fuente-atrio` | `"Chakra Petch", "Segoe UI", sans-serif` (peso 700, `letter-spacing: 2px`) |
| `--t-h1` | `clamp(2rem, 1.4rem + 2.2vw, 3rem)` |
| `--t-h2` | `clamp(1.6rem, 1.2rem + 1.5vw, 2.25rem)` |
| `--t-h3` | `1.25rem` |
| `--t-body` | `1rem` / `line-height: 1.6` |
| `--t-small` | `0.875rem` |
| `--t-cifra` | `clamp(2rem, 1.5rem + 2vw, 2.75rem)` (indicadores) |

Títulos en `--azul-900`, peso 700. Texto en `--texto`, peso 400.

## 3. Espaciado, radios y sombras

| Token | Valor |
|-------|-------|
| `--esp-1` … `--esp-6` | `0.25rem`, `0.5rem`, `1rem`, `1.5rem`, `2.5rem`, `4rem` |
| `--contenedor` | `max-width: 1200px; padding-inline: 16px` (24 px desde 768 px) |
| `--radio` | `16px` (tarjetas), `999px` (botones píldora), `12px` (imágenes) |
| `--sombra-1` | `0 1px 2px rgba(4,27,88,.06), 0 4px 12px rgba(4,27,88,.06)` |
| `--sombra-2` | `0 8px 24px rgba(4,27,88,.12)` (hover, botón flotante) |

## 4. Puntos de quiebre

| Nombre | Ancho | Cambios principales |
|--------|-------|---------------------|
| móvil | < 768 px | 1 columna; menú en 2 filas; hero apilado (texto, luego imagen); botón flotante solo ícono; `footer__bottom` apilado |
| tableta | ≥ 768 px | 2 columnas en valores, servicios, equipo, testimonios, galería; hero en 2 columnas |
| escritorio | ≥ 1024 px | 3 columnas en valores, servicios y galería; 4 en equipo e indicadores |
| ancho | ≥ 1440 px | solo crece el margen; el contenedor se mantiene en 1200 px |

## 5. Movimiento

- Transiciones permitidas: `color`, `background-color`, `box-shadow`, `transform: translateY(-2px)` en hover de tarjetas y botones, 150–200 ms.
- `@media (prefers-reduced-motion: reduce)`: `transition: none; transform: none`.
- Eliminados: formas flotantes animadas, paralaje con el mouse y con el scroll, onda al clic.
