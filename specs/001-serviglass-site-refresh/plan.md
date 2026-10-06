# Implementation Plan: Renovación visual y de contenido del sitio Serviglass Girardot

**Branch**: `001-serviglass-site-refresh` | **Date**: 2026-10-06 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-serviglass-site-refresh/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

El sitio actual es una plantilla genérica (TemplateMo "Glossy Touch") de una sola página con cuatro secciones conmutadas por JavaScript, fondo degradado oscuro y contenido de relleno en inglés. La feature lo convierte en el sitio real de Serviglass Girardot: fondo blanco con la paleta verde/azul del logo nuevo, todo el contenido del documento del cliente (propuesta de valor, servicios, equipo, planta, aliados, testimonios, datos de contacto y horario), botón flotante y enlaces de WhatsApp, mapa real, sin formulario, y crédito "Desarrollado por ATRIO" en el pie de página.

Enfoque técnico (ver [research.md](research.md)): se conserva la arquitectura estática sin framework ni paso de build. `index.html` se reestructura por secciones con identificadores en español y navegación por `hash`; `styles.css` se reescribe desde cero sobre tokens CSS (custom properties) derivados del logo y verificados contra WCAG AA; `scripts.js` queda reducido a la navegación entre secciones. Los íconos pasan de emojis a SVG inline. Las imágenes del cliente se optimizan con un script Node de un solo uso (`sharp`) que también recorta el favicon del logo nuevo. La validación combina una guía manual ([quickstart.md](quickstart.md)), `html-validate`, un script de contraste y Lighthouse.

## Technical Context

**Language/Version**: HTML5, CSS3 (custom properties, Grid, Flexbox, `clamp()`), JavaScript ES2018 sin módulos ni transpilación. Node.js 24.13 (ya instalado) únicamente para herramientas de desarrollo.

**Primary Dependencies**: Ninguna en tiempo de ejecución. Desarrollo: `sharp` 0.35 (optimización de imágenes, verificado en esta máquina), `html-validate` 11.16 (validación de marcado, verificado vía `npx`). Servicios externos: Google Fonts (subconjunto de Chakra Petch para la palabra "ATRIO"), Google Maps embed (iframe sin clave de API), WhatsApp click-to-chat (`wa.me`).

**Storage**: N/A. Sitio estático sin backend; `contacto.php` se elimina.

**Testing**: Guía manual por historia de usuario en `quickstart.md`; `npx html-validate index.html`; `node tools/contrast-check.mjs` (pares de tokens vs. WCAG AA); Lighthouse en Chrome DevTools (Accesibilidad ≥ 95, Rendimiento ≥ 90 en móvil); matriz de anchos 360 / 768 / 1024 / 1440 px.

**Target Platform**: Navegadores modernos (últimas dos versiones de Chrome, Edge, Firefox y Safari; iOS Safari 15+; Chrome Android). Alojamiento estático en cualquier servidor HTTP.

**Project Type**: Sitio web estático de una página con cuatro secciones.

**Performance Goals**: Carga completa < 3 s en 4G; peso de la carga inicial < 1,5 MB (hoy la plantilla carga 1,7 MB solo en la imagen del hero); LCP < 2,5 s; imágenes fuera del viewport con `loading="lazy"`.

**Constraints**: Sin build ni framework (el sitio debe seguir abriéndose como archivos planos); sin backend; interfaz en español; textos del documento del cliente sin cambios salvo ortotipografía; contraste AA (4.5:1 texto normal, 3:1 texto grande y componentes); el logo nuevo solo existe como JPEG de 561×374 px con fondo blanco (sirve para encabezado y favicon, no para usos a gran tamaño).

**Scale/Scope**: 1 archivo HTML (~600 líneas), 1 CSS (~700 líneas), 1 JS (~60 líneas), 2 scripts de herramientas, 15 activos gráficos del cliente + 1 SVG de ATRIO. Un solo desarrollador.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

`.specify/memory/constitution.md` es la plantilla sin diligenciar (no hay principios ratificados), por lo que no existen compuertas formales. Se aplican las siguientes compuertas derivadas de la especificación y del sentido común del proyecto:

| Gate | Criterio | Pre-diseño | Post-diseño |
|------|----------|------------|-------------|
| G1 Simplicidad | Sin framework, sin build, sin backend; tres archivos de código | PASS | PASS (solo se añaden 2 scripts de herramientas fuera del sitio publicable) |
| G2 Fidelidad de contenido | Todo texto visible proviene del documento del cliente o de las aclaraciones registradas | PASS | PASS (data-model.md cita la fuente de cada entidad) |
| G3 Accesibilidad | Tokens de color verificados AA; nombres accesibles en botones e íconos; `prefers-reduced-motion` | PASS | PASS (contracts/design-tokens.md, 19 pares verificados) |
| G4 Sin restos de plantilla | Se eliminan textos, imágenes y archivos de la plantilla | PASS | PASS (lista de eliminación en Project Structure) |
| G5 Marca | Verde/azul del logo nuevo para la UI; ATRIO solo en el crédito del pie | PASS | PASS |

Recomendación: ejecutar `/speckit-constitution` después de esta feature para formalizar G1 a G5 como principios del proyecto.

## Project Structure

### Documentation (this feature)

```text
specs/001-serviglass-site-refresh/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   ├── ui-contract.md   # secciones, navegación, enlaces, metadatos, pie de página, herramientas
│   └── design-tokens.md # custom properties de color, tipografía, espaciado y contraste
├── checklists/requirements.md
├── assets/              # material del cliente y de ATRIO (fuente de verdad del contenido)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
serviglass-girardot/
├── index.html                 # única página: <header>, <main> con 4 <section> (#inicio, #nosotros,
│                              #  #servicios, #contacto), <footer>, botón flotante de WhatsApp
├── styles.css                 # reescrito: 1 tokens, 2 base/reset, 3 layout, 4 componentes,
│                              #  5 secciones, 6 pie y botón flotante, 7 responsive, 8 reduced-motion
├── scripts.js                 # reescrito: navegación por secciones con hash, aria-current,
│                              #  foco al cambiar de sección
├── images/
│   ├── logo-serviglass.jpg            # logo nuevo para el encabezado (561 px de ancho)
│   ├── favicon-32.png                 # recorte del emblema del logo nuevo
│   ├── favicon-192.png
│   ├── apple-touch-icon.png           # 180×180
│   ├── og-image.jpg                   # 1200×630, logo centrado (vista previa al compartir)
│   ├── equipo/{mario-dominguez,tatiana-lenis,julio-sanchez,laura-avila}.{jpg,webp}
│   ├── planta/planta-0{1..5}.{jpg,webp}
│   ├── aliados/{jm-construcciones,fc-fabian-cano,techos-y-aluminios,vg-ingenieria}.{jpg,webp}
│   └── atrio/atrio-simbolo-pie-sobre-blanco.svg
├── tools/                     # solo desarrollo; no se publica
│   ├── package.json           # devDependencies: sharp, html-validate
│   ├── optimize-images.mjs    # specs/.../assets → images/ (redimensión, compresión, WebP, favicons, OG)
│   └── contrast-check.mjs     # calcula contraste WCAG de los pares de tokens definidos
└── specs/...

Se eliminan del sitio: contacto.php, images/welcome.png, images/pexels-suntorn-somtong-386224-1029243.jpg,
images/rain-2590345_1280.jpg, images/templatemo-futuristic-girl.jpg.
Se archiva (no se publica): images/serviglass-logo.png → specs/001-serviglass-site-refresh/assets/sitio-actual/logo-anterior.png
```

**Structure Decision**: Se mantiene el proyecto como sitio estático de tres archivos en la raíz, porque así está desplegado hoy y la especificación exige que siga funcionando sin build ni backend. Las imágenes se organizan por tipo de contenido bajo `images/` para que el marcado sea legible y el script de optimización sea idempotente. Las herramientas viven en `tools/` con su propio `package.json` para no introducir `node_modules` ni configuración en la raíz publicable.

## Complexity Tracking

Sin violaciones de las compuertas. No aplica.

## Design Overview

Resumen del diseño resuelto en Phase 0 y Phase 1 (los detalles están en los artefactos enlazados):

1. **Secciones** (`index.html`, ver [contracts/ui-contract.md](contracts/ui-contract.md)):
   - `#inicio`: hero (título, párrafo, 2 CTA, foto `planta-04`), 6 tarjetas de valor con ícono SVG, franja "Aliados comerciales" (4 logos), "Experiencias de éxito" (4 testimonios).
   - `#nosotros`: "La Fortaleza de un Gran Distribuidor" (3 párrafos) + 4 indicadores (2 con cifra, 2 solo título con ícono), equipo (4 tarjetas con foto), galería "Nuestra planta" (5 fotos).
   - `#servicios`: banner + 6 tarjetas de servicio con lista de verificación.
   - `#contacto`: dirección, teléfono, WhatsApp, horario, 4 correos, 3 redes; mapa incrustado con enlace "Abrir en Google Maps".
   - `<footer>` único (ya no se mueve con JavaScript): enlaces a secciones, redes, "© 2026 Serviglass Girardot S.A.S. Todos los derechos reservados." y "Desarrollado por ATRIO".
   - Botón flotante de WhatsApp fijo, último elemento del `<body>`.
2. **Estilo** ([contracts/design-tokens.md](contracts/design-tokens.md)): fondo blanco; tarjetas blancas con borde `--borde`, sombra suave y radio 16 px; títulos en `--azul-900`; botones primarios `--verde-600` con texto blanco; enlaces e íconos en `--azul-600` y `--verde-500`; tintes `--azul-50/100` solo en franjas (aliados, testimonios, galería). Se eliminan formas flotantes, paralaje, ondas al clic y sombras de texto blancas.
3. **Comportamiento** (`scripts.js`): `showSection(id)` activa la sección, actualiza `aria-current`, `location.hash` y el foco en el encabezado de la sección; `hashchange` y la carga inicial leen el hash (`#servicios` abre Servicios). Sin otras interacciones JavaScript.
4. **Imágenes** (`tools/optimize-images.mjs`): fotos de equipo → JPEG q82 + WebP, 480 px de ancho, 3:4; planta → máx. 1200 px; aliados → 160 px de alto; favicon y OG recortados del logo nuevo; `<picture>` con WebP y JPEG de respaldo; `width`/`height` declarados para evitar saltos de maquetación.
5. **Riesgos y mitigaciones**:
   - Logo nuevo de baja resolución (561×374): se usa a ≤ 72 px de alto en el encabezado; pedir al cliente la versión vectorial como mejora posterior.
   - Dependencias externas (Google Fonts, Google Maps): si no cargan, el pie usa fuente de respaldo y el mapa muestra el enlace a Google Maps; el resto del sitio no depende de ellas.
   - URL de la página de Facebook desconocida: enlace provisional a la búsqueda del nombre; reemplazar cuando el cliente la entregue.
   - Licencia TemplateMo: el crédito se retira por instrucción del desarrollador (registrado en spec.md, Assumptions).

## Phase 0: Research

Resultados en [research.md](research.md) (R1 a R15). Todas las incógnitas del Technical Context quedaron resueltas con mediciones hechas en esta máquina (colores muestreados del logo, contraste, tamaños de imagen, disponibilidad de `sharp` y `html-validate`). No hay marcadores NEEDS CLARIFICATION.

## Phase 1: Design & Contracts

- [data-model.md](data-model.md): 14 entidades de contenido con campos, validaciones y mapa fuente → sección.
- [contracts/ui-contract.md](contracts/ui-contract.md): esqueleto del HTML, navegación por hash, identificadores, 10 enlaces externos, botón flotante, pie de página, metadatos, patrones de imagen y herramientas.
- [contracts/design-tokens.md](contracts/design-tokens.md): tokens de color (con 19 pares de contraste verificados), tipografía, espaciado, puntos de quiebre y movimiento.
- [quickstart.md](quickstart.md): preparación de imágenes, servidor local, validaciones automáticas y pruebas manuales por historia de usuario.

Constitution Check post-diseño: PASS (ver tabla arriba).

## Orden sugerido de implementación (entrada para `/speckit-tasks`)

1. Herramientas: `tools/package.json`, `optimize-images.mjs`, `contrast-check.mjs`; generar `images/`; archivar el logo anterior; eliminar archivos de la plantilla.
2. Base: `<head>` con metadatos y favicons; tokens y base de `styles.css`; `scripts.js` con navegación por hash; esqueleto de secciones vacías y pie con crédito ATRIO (US1, US7 parciales).
3. Botón flotante y enlaces de WhatsApp (US2).
4. Contenido de Inicio y Servicios con íconos SVG (US3).
5. Sobre nosotros: texto, indicadores, equipo, galería (US4).
6. Contacto: datos, horario, redes, mapa; eliminación del formulario y de `contacto.php` (US5).
7. Aliados y testimonios en Inicio (US6).
8. Responsive, reduced-motion, pulido visual (US1 completa).
9. Validación según `quickstart.md`; corrección de hallazgos; informe Lighthouse.
