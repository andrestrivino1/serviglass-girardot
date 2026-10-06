# Research: Renovación visual y de contenido del sitio Serviglass Girardot

**Feature**: `001-serviglass-site-refresh` · **Date**: 2026-10-06

Cada decisión sigue el formato Decision / Rationale / Alternatives considered. Las mediciones (colores y contraste, tamaños de imagen, disponibilidad de herramientas) se hicieron en esta máquina el 6 de octubre de 2026 con Node 24.13 y los scripts descritos al final.

## R1. Arquitectura de página: una página con secciones conmutadas y navegación por hash

- **Decision**: Conservar `index.html` como única página con cuatro `<section>` (`#inicio`, `#nosotros`, `#servicios`, `#contacto`) de las que solo una es visible, y reemplazar `showPage()` + `onclick` por un `showSection(id)` que lee y escribe `location.hash`.
- **Rationale**: La especificación exige mantener las cuatro secciones y el comportamiento actual (FR-061). El hash hace que los CTA del hero, los enlaces del pie y los enlaces compartidos lleven a la sección correcta y que el botón "atrás" funcione, con unas 40 líneas de JavaScript. El pie de página deja de moverse con JavaScript porque, al estar fuera de las secciones, siempre queda debajo de la activa.
- **Alternatives considered**: (a) Página larga con desplazamiento por anclas: cambia la experiencia actual y alarga la carga inicial con todas las imágenes; (b) cuatro archivos HTML: duplica encabezado y pie y complica el mantenimiento; (c) mantener `onclick` inline: no permite enlaces compartibles ni accesibles por teclado sin trabajo extra.

## R2. Estrategia de estilos: reescritura sobre tokens, estética "vidrio claro"

- **Decision**: Reescribir `styles.css` desde cero, organizado en capas (tokens, base, layout, componentes, secciones, pie y botón flotante, responsive, reduced-motion). Eliminar `.bg-shapes`, el paralaje con el mouse, el efecto de onda al clic y las sombras de texto. Las tarjetas serán blancas con borde de 1 px (`--borde`), sombra suave y radio de 16 px; opcionalmente `backdrop-filter: blur()` solo sobre franjas con tinte azul.
- **Rationale**: El CSS actual está construido para fondo oscuro (texto blanco, `rgba(255,255,255,…)` en todas partes); adaptarlo regla por regla deja residuos y es más lento que reescribirlo. Los tokens permiten verificar el contraste en un solo lugar y aplicar la paleta corporativa de forma consistente (FR-001 a FR-005).
- **Alternatives considered**: (a) Editar el CSS existente: alto riesgo de residuos de la plantilla; (b) framework CSS (Tailwind/Bootstrap): añade dependencia y build o CDN pesado para una página.

## R3. Paleta derivada del logo nuevo y verificada contra WCAG AA

- **Decision**: Tokens de color tomados de los píxeles del logo nuevo (`assets/logo-nuevo-serviglass.jpeg`) y ajustados solo donde el contraste lo exige. Valores definitivos en [contracts/design-tokens.md](contracts/design-tokens.md). Resumen:

  | Token | Valor | Origen | Contraste sobre blanco |
  |-------|-------|--------|------------------------|
  | `--verde-500` | `#28770A` | píxel dominante del verde brillante del logo | 5.62:1 |
  | `--verde-600` | `#236809` | píxel dominante del verde medio del logo | 6.87:1 |
  | `--verde-700` | `#1C6407` | verde más saturado del logo | 7.30:1 |
  | `--azul-400` | `#2A77D5` | azul brillante del logo | 4.47:1 (solo íconos y texto grande) |
  | `--azul-600` | `#153B96` | azul medio del logo | 10.01:1 |
  | `--azul-900` | `#041B58` | azul marino del logo (texto "GIRARDOT S.A.S.") | 16.12:1 |
  | `--azul-50` / `--azul-100` | `#F3F8FB` / `#E8F3F9` | aclarado de los tintes del "vidrio" del logo (`#B7D9EA`) | fondos de franja |
  | `--texto` / `--texto-sec` / `--texto-muted` | `#1F2933` / `#4B5563` / `#6B7280` | neutros | 14.76 / 7.56 / 4.83 |

- **Rationale**: El muestreo mostró que los verdes del logo son más oscuros que la estimación visual inicial (`#43B02A` solo alcanza 2.81:1 y no sirve para texto ni botones). Todos los tokens de texto y botón superan 4.5:1 sobre blanco y sobre los tintes; `--azul-400` queda reservado a íconos y texto ≥ 24 px (3:1 requerido, 4.47 obtenido).
- **Alternatives considered**: Paleta "de catálogo" (Material green/blue): no corresponde al logo; colores del logo anterior (`images/serviglass-logo.png`, verde esmeralda e índigo): el documento del cliente declara el logo nuevo como vigente.

## R4. Tipografía

- **Decision**: Pila de sistema para todo el sitio: `"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` (sin descarga). Para la palabra "ATRIO" del pie, Chakra Petch 700 cargada desde Google Fonts con subconjunto `text=ATRIO` y `display=swap`, con `font-family` de respaldo `"Segoe UI", sans-serif` en negrita.
- **Rationale**: El documento del cliente no define tipografía; la pila de sistema es la opción más rápida y legible. El subconjunto de Google Fonts pesa unos pocos KB y respeta la guía de marca de ATRIO (FR-063) sin cambiar la tipografía del resto del sitio (Assumptions).
- **Alternatives considered**: Cargar Chakra Petch completa (innecesario); convertir "ATRIO" a trazados SVG (no se dispone de las curvas de la fuente en el paquete de marca); usar la pila de sistema también para ATRIO (incumple la guía).

## R5. Íconos: SVG inline

- **Decision**: Sustituir los emojis por SVG inline de 24×24 (trazo 2 px) tomados de Lucide (licencia MIT) para tarjetas, indicadores y datos de contacto, y de Simple Icons (CC0) para WhatsApp, Instagram, Facebook y TikTok. Color por `currentColor`, con `aria-hidden="true"` cuando acompañan texto y `aria-label` cuando van solos.

  | Elemento | Ícono (Lucide) |
  |----------|----------------|
  | Vidrios a la Medida y Alta Resistencia | `ruler` (regla/escuadra) |
  | Transformación y Acabados de Lujo | `gem` (diamante) |
  | Cumplimiento y Entregas Oportunas | `truck` |
  | Garantía de Calidad | `shield-check` |
  | Asesoría Técnica y Solución Inmediata | `headset` |
  | Respaldo y Cobertura Regional | `map-pin` |
  | Servicios: Distribución / Seguridad / Procesamiento / Divisiones de baño / Espejería / Asesoría | `package`, `shield`, `settings`, `shower-head`, `sparkles`, `handshake` |
  | Indicadores sin cifra: Toneladas-Metros / Milímetros de espesor | `weight` (o `boxes`), `layers` |
  | Contacto: dirección / teléfono / horario / correo | `map-pin`, `phone`, `clock`, `mail` |

- **Rationale**: Los emojis cambian de aspecto por plataforma y no pueden colorearse con la paleta (FR-002, recomendación de iconografía del cliente). Los SVG inline no requieren descargas ni fuentes de íconos.
- **Alternatives considered**: Font Awesome u otra fuente de íconos (dependencia externa de cientos de KB); imágenes PNG (no escalan ni se recoloran).

## R6. WhatsApp: enlace click-to-chat y botón flotante

- **Decision**: Enlace `https://wa.me/573203816643?text=` + mensaje codificado ("Hola Serviglass Girardot, quiero información sobre vidrios.") con `target="_blank"` y `rel="noopener"`. Botón flotante `<a>` de 56×56 px, `position: fixed; right: 16px; bottom: calc(16px + env(safe-area-inset-bottom))`, fondo `#128C7E`, ícono blanco, `aria-label="Escríbenos por WhatsApp"`, `z-index` superior al contenido, con etiqueta de texto visible ("WhatsApp") a partir de 768 px. El pie de página lleva `padding-bottom` extra de 88 px en móvil para que el botón no cubra sus enlaces. En Contacto se repite el enlace como botón normal.
- **Rationale**: `wa.me` abre la app en móvil y WhatsApp Web en escritorio sin lógica adicional (FR-010 a FR-013). El verde oficial `#25D366` solo alcanza 1.98:1 contra blanco, por lo que la frontera del botón y el ícono blanco no cumplirían el 3:1 de componentes; `#128C7E` (verde oscuro oficial de WhatsApp) da 4.14:1 y sigue siendo reconocible. El `padding-bottom` resuelve el caso límite de solapamiento del spec.
- **Alternatives considered**: `https://api.whatsapp.com/send?phone=` (equivalente, más largo); fondo `#25D366` con borde oscuro (el ícono seguiría sin contraste); widget de terceros (dependencia y rastreo innecesarios).

## R7. Mapa: Google Maps incrustado sin clave

- **Decision**: `<iframe src="https://www.google.com/maps?q=Cra.+9+%2314-30,+Girardot,+Cundinamarca&output=embed" loading="lazy" title="Ubicación de Serviglass Girardot en Google Maps" referrerpolicy="no-referrer-when-downgrade">` dentro de un contenedor con relación de aspecto 16:9 (altura mínima 320 px), más un enlace "Abrir en Google Maps" (`https://www.google.com/maps/search/?api=1&query=Cra.+9+%2314-30,+Girardot,+Cundinamarca`) para abrir la app de mapas del visitante.
- **Rationale**: Cumple FR-052 sin clave de API ni costo. `loading="lazy"` evita cargar el mapa hasta que la sección Contacto sea visible. El enlace de respaldo cubre el caso en que el iframe no cargue.
- **Alternatives considered**: OpenStreetMap/Leaflet (requiere biblioteca o iframe de terceros con menos reconocimiento por los visitantes); Google Maps Embed API con clave (innecesaria para una consulta de dirección).

## R8. Imágenes: optimización con `sharp` y favicon desde el logo nuevo

- **Decision**: Script `tools/optimize-images.mjs` (Node + `sharp`, verificado: `sharp 0.35.5`, libvips 8.18.7, formatos jpeg/png/webp) que lee `specs/001-serviglass-site-refresh/assets/` y escribe `images/`:

  | Grupo | Fuente (px) | Salida | Nota |
  |-------|-------------|--------|------|
  | Equipo (4 PNG, 158–185 KB, ~360×460) | PNG con fondo blanco | JPEG q82 + WebP, 480 px de ancho, relación 3:4 con recorte centrado | pasa de ~690 KB a ~120 KB en total |
  | Planta (5 JPEG, 92–190 KB, ≤ 782 px) | JPEG | JPEG q82 + WebP, ancho máx. 1200 px (no se amplían) | `planta-04` es la imagen del hero |
  | Aliados (4 JPEG, 55–122 KB) | JPEG, proporciones mixtas | JPEG q85 + WebP, alto 160 px, fondo blanco | se muestran en cajas de 72 px de alto con `object-fit: contain` |
  | Logo nuevo (561×374 JPEG) | fondo blanco | `logo-serviglass.jpg` tal cual (q90) | se muestra a ≤ 72 px de alto (≤ 110 px de ancho), por lo que 561 px cubre pantallas 2x |
  | Favicon | recorte del emblema del logo (hexágono) | `favicon-32.png`, `favicon-192.png`, `apple-touch-icon.png` 180×180 | el recorte se define por coordenadas en el script |
  | Open Graph | logo centrado sobre blanco | `og-image.jpg` 1200×630 | vista previa al compartir por WhatsApp |

  Se eliminan `welcome.png` (1,7 MB), `pexels-…jpg` (2,9 MB), `rain-…jpg` y `templatemo-futuristic-girl.jpg`. El logo anterior se archiva en `assets/sitio-actual/logo-anterior.png`.
- **Rationale**: Las imágenes actuales de la plantilla pesan 5,1 MB y son ajenas al cliente; las del cliente suman 1,5 MB sin optimizar y pueden bajar a ~600 KB. Declarar `width`/`height` y usar `loading="lazy"` cumple el objetivo de < 3 s en 4G (SC-006). No hay Python ni ImageMagick en la máquina; `sharp` se instaló y ejecutó correctamente.
- **Alternatives considered**: Optimizar a mano en un servicio web (no reproducible); servir los originales (peso y fondo blanco de las fotos de equipo sin recorte uniforme); `favicon.ico` multi-tamaño (los PNG bastan para navegadores actuales).

## R9. Dependencias externas y privacidad

- **Decision**: Solo dos recursos de terceros: la hoja de Google Fonts (subconjunto) y el iframe de Google Maps (lazy). Todos los enlaces externos llevan `rel="noopener"`; no se añaden analíticas ni scripts de terceros.
- **Rationale**: Minimiza puntos de fallo y rastreo; el sitio funciona íntegramente sin ellos (fuente de respaldo y enlace a mapas).
- **Alternatives considered**: Autoalojar Chakra Petch (archivo woff2 de ~20 KB en el repositorio; válido como mejora si se quiere eliminar Google Fonts).

## R10. Validación y pruebas

- **Decision**: Cuatro mecanismos, sin suite automatizada de navegador:
  1. `npx html-validate index.html` (reglas por defecto + `require-sri` desactivada; se confirmará la ejecución en `quickstart.md`).
  2. `node tools/contrast-check.mjs`: calcula el contraste WCAG de cada par (token de primer plano, token de fondo) declarado en `contracts/design-tokens.md` y falla si alguno baja del umbral.
  3. Lighthouse (Chrome DevTools, modo móvil): Accesibilidad ≥ 95, Rendimiento ≥ 90, Buenas prácticas ≥ 90.
  4. Guía manual `quickstart.md` por historia de usuario, con la matriz de anchos 360/768/1024/1440 y la lista de 10 enlaces de contacto.
- **Rationale**: Para un sitio estático de una página, una suite E2E (Playwright/pa11y) añade más mantenimiento que valor; los cuatro mecanismos cubren marcado, color, rendimiento y comportamiento. `html-validate` y `sharp` corren con Node ya instalado.
- **Alternatives considered**: pa11y/axe-cli (descargan Chromium; Lighthouse ya incluye axe); pruebas unitarias de `scripts.js` (lógica trivial).

## R11. Formulario de contacto: eliminación

- **Decision**: Eliminar el `<form>` de Contacto, el manejador de envío de `scripts.js` y el archivo `contacto.php`. El bloque de Contacto pasa a dos columnas: datos (dirección, teléfono, WhatsApp, horario, correos, redes) y mapa.
- **Rationale**: Decisión del cliente registrada en spec.md (Clarifications, FR-053). Sin formulario el sitio no necesita servidor con PHP ni correo.
- **Alternatives considered**: Documentadas en la sesión de aclaraciones (correo real, redirección a WhatsApp).

## R12. Crédito ATRIO en el pie de página

- **Decision**: Reproducir el patrón "Pie de página dentro de tus aplicaciones" de la guía ATRIO en su variante sobre blanco: `<span>Desarrollado por</span>` + símbolo SVG inline (`assets/atrio/svg/atrio-simbolo-pie-sobre-blanco.svg`, 22 px, con `margin` igual al ancho de la T ≈ 25 % del tamaño) + `<strong class="atrio-wordmark">` con "AT" en `#9A5F2C` y "RIO" en `#1E1726`, Chakra Petch 700 y `letter-spacing: 2px`. Texto del crédito en `#5A4F63` a 13 px. Se coloca a la derecha de la línea "© 2026 Serviglass Girardot S.A.S. Todos los derechos reservados." y se apila en móvil. Sin enlace (la guía no define sitio web).
- **Rationale**: Cumple FR-063/FR-064 y la instrucción del desarrollador; el SVG inline evita una petición y hereda el fondo blanco en los calados. Los colores de ATRIO quedan confinados al pie (G5).
- **Alternatives considered**: Imagen PNG del lockup (no disponible en el paquete, no escala); crédito solo en texto (incumple la guía).

## R13. Metadatos y SEO básico

- **Decision**: `<html lang="es">`; `<title>Serviglass Girardot S.A.S. | Distribuidora de vidrios en Girardot</title>`; `<meta name="description">` con el párrafo del hero resumido (≤ 160 caracteres); Open Graph (`og:title`, `og:description`, `og:image` = `images/og-image.jpg`, `og:locale` = `es_CO`); `<meta name="theme-color" content="#041B58">`; favicons según R8. Sin `canonical` ni `sitemap` porque el dominio de publicación no está definido.
- **Rationale**: FR-006/FR-007 y vista previa correcta al compartir el enlace por WhatsApp (canal principal del cliente).
- **Alternatives considered**: Datos estructurados `LocalBusiness` (JSON-LD): mejora posterior cuando se conozca el dominio y el horario esté confirmado en producción.

## R14. Accesibilidad y movimiento

- **Decision**: Enlace "Saltar al contenido"; `<nav aria-label="Principal">` con `<a href="#seccion">` y `aria-current="page"` en la activa; al cambiar de sección se mueve el foco al encabezado de la sección (`tabindex="-1"`); `prefers-reduced-motion: reduce` desactiva transiciones; todos los íconos decorativos con `aria-hidden`; imágenes con `alt` descriptivo en español; `<picture>` con `width`/`height`.
- **Rationale**: FR-003, FR-013, casos límite de movimiento reducido y de pantallas pequeñas; Lighthouse Accesibilidad ≥ 95.
- **Alternatives considered**: Dejar la navegación con `onclick` en `<a href="#">` (no accesible por teclado ni compartible).

## R15. Contenido: fuente única y correcciones permitidas

- **Decision**: Todo texto se copia de `assets/informacion-serviglass-texto.txt` y de la sección Clarifications de `spec.md`. Correcciones permitidas: eliminar el " ." final del párrafo del hero, normalizar espacios dobles y mayúsculas iniciales. Los testimonios se publican como están (dos citas idénticas), según Assumptions.
- **Rationale**: FR-072 y G2.
- **Alternatives considered**: Reescribir o resumir textos (prohibido por el spec).

## Cómo se obtuvieron las mediciones

- Colores: decodificación del JPEG del logo con `jpeg-js` en Node, agrupación de píxeles no blancos ni grises en celdas de 16 niveles y promedio por familia (verde/azul). Píxeles verdes 11 545, azules 19 388. Familias dominantes: verde `#236809`/`#28770A`/`#1C6407`; azul `#2A77D5`/`#153B96`/`#133789`/`#041B58`; tintes claros `#B7D9EA`/`#AAD3E7`.
- Contraste: fórmula WCAG 2.1 de luminancia relativa; tabla completa en `contracts/design-tokens.md`.
- Imágenes: dimensiones con `jpeg-js`/`pngjs`; tamaños con el sistema de archivos (tabla en R8).
- Herramientas: `sharp` instalado y ejecutado en un directorio temporal; `html-validate` se ejecuta con `npx` (ver quickstart).
