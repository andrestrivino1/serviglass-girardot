---

description: "Task list for feature implementation"
---

# Tasks: Renovación visual y de contenido del sitio Serviglass Girardot

**Input**: Design documents from `/specs/001-serviglass-site-refresh/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: No se solicitaron pruebas automatizadas. La verificación de cada historia es manual y está descrita en `quickstart.md`; cada fase termina con una tarea de verificación que remite a la sección correspondiente.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Sitio estático en la raíz del repositorio: `index.html`, `styles.css`, `scripts.js`, `images/`.
- Herramientas de desarrollo en `tools/` (no se publican).
- Fuente de verdad del contenido: `specs/001-serviglass-site-refresh/assets/informacion-serviglass-texto.txt` (texto) y `specs/001-serviglass-site-refresh/assets/` (imágenes). Aclaraciones: `spec.md` → Clarifications.
- Contratos que fijan nombres de clases, identificadores, enlaces y tokens: `contracts/ui-contract.md` y `contracts/design-tokens.md`.
- Nota: `index.html` y `styles.css` son archivos compartidos por todas las historias. Las tareas que editan el mismo archivo no llevan [P]; solo se marcan [P] las que tocan archivos distintos.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Herramientas de desarrollo y activos optimizados que todas las historias usan.

- [X] T001 Crear `tools/package.json` con `"private": true`, `"type": "module"`, `devDependencies` `sharp` ^0.35 y `html-validate` ^11, y scripts `"images": "node optimize-images.mjs"`, `"contrast": "node contrast-check.mjs"`, `"validate": "html-validate ../index.html"`; añadir `tools/.gitignore` con `node_modules/`
- [X] T002 [P] Escribir `tools/optimize-images.mjs` (Node + sharp) que lea `specs/001-serviglass-site-refresh/assets/` y escriba en `images/` según `contracts/ui-contract.md` §9 y `research.md` R8: equipo (`assets/equipo/*.png`) → `images/equipo/<slug>.jpg` q82 y `.webp`, 480 px de ancho, relación 3:4 con recorte centrado (`fit: cover`, `position: top`); planta (`assets/empresa/planta-0N.jpeg`) → `images/planta/planta-0N.jpg` q82 y `.webp`, ancho máximo 1200 px sin ampliar (`withoutEnlargement`); aliados → `images/aliados/{jm-construcciones,fc-fabian-cano,techos-y-aluminios,vg-ingenieria}.jpg` q85 y `.webp`, alto 160 px, fondo blanco (`flatten`); `assets/logo-nuevo-serviglass.jpeg` → `images/logo-serviglass.jpg` q90 sin redimensionar; recorte del emblema hexagonal del logo (zona superior central, definir `extract` por coordenadas y verificar visualmente) → `images/favicon-32.png`, `images/favicon-192.png`, `images/apple-touch-icon.png` (180×180); `images/og-image.jpg` 1200×630 con fondo blanco y el logo centrado a ~800 px de ancho. El script crea carpetas (`mkdir -p`), es idempotente e imprime una tabla con el peso de cada salida y el total
- [X] T003 [P] Escribir `tools/contrast-check.mjs` con la fórmula de luminancia relativa WCAG 2.1 y la tabla de 19 pares de `contracts/design-tokens.md` §1 "Contraste verificado" (primer plano, fondo, umbral 4.5 o 3.0); imprime ratio y PASS/FAIL por par y termina con código de salida 1 si alguno falla
- [X] T004 Ejecutar `cd tools && npm install && node optimize-images.mjs`; comprobar que existen `images/logo-serviglass.jpg`, `images/favicon-32.png`, `images/favicon-192.png`, `images/apple-touch-icon.png`, `images/og-image.jpg`, `images/equipo/` (4 jpg + 4 webp), `images/planta/` (5 + 5), `images/aliados/` (4 + 4); abrir `favicon-192.png` y `og-image.jpg` para confirmar el recorte del emblema; anotar en el commit el peso total de `images/` (objetivo < 1 MB sin contar los archivos de la plantilla que se eliminan en T010)
- [X] T005 [P] Copiar `specs/001-serviglass-site-refresh/assets/atrio/svg/atrio-simbolo-pie-sobre-blanco.svg` a `images/atrio/atrio-simbolo-pie-sobre-blanco.svg` (sin cambios; se usará inline en el pie)
- [X] T006 [P] Ejecutar `node tools/contrast-check.mjs` y confirmar que los 19 pares pasan antes de escribir CSS

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Esqueleto de la página, navegación y base de estilos sobre los que se montan todas las historias.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 Reescribir `index.html` como esqueleto según `contracts/ui-contract.md` §1 y §7: `<!doctype html><html lang="es">`; `<head>` con `charset`, `viewport`, `<title>Serviglass Girardot S.A.S. | Distribuidora de vidrios en Girardot</title>`, `meta description` (texto de `data-model.md` §14, ≤ 160 caracteres), `theme-color #041B58`, favicons (`images/favicon-32.png` 32x32, `images/favicon-192.png` 192x192, `images/apple-touch-icon.png`), Open Graph (`og:type`, `og:title`, `og:description`, `og:image images/og-image.jpg`, `og:locale es_CO`), `preconnect` a `fonts.googleapis.com` y `fonts.gstatic.com`, `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@700&text=ATRIO&display=swap">`, `<link rel="stylesheet" href="styles.css">`; `<body>` con `<a class="skip-link" href="#main">Saltar al contenido</a>`, `<header class="site-header">` (enlace `.brand` a `#inicio` con `<img src="images/logo-serviglass.jpg" alt="Serviglass Girardot S.A.S. – Distribuidora de vidrios" width="561" height="374">` y `<span>Serviglass Girardot</span>`; `<nav aria-label="Principal">` con `<a href="#inicio" aria-current="page">Inicio</a>`, `#nosotros` "Sobre nosotros", `#servicios` "Servicios", `#contacto` "Contacto"); `<main id="main">` con cuatro `<section class="section" id="…" aria-labelledby="…-titulo">` (`inicio` con `is-active` y `<h1 id="inicio-titulo" tabindex="-1">`, las otras con `<h2 id="…-titulo" tabindex="-1">`; encabezados provisionales "Inicio", "Sobre nosotros", "Servicios", "Contacto"); `<footer class="site-footer">` vacío con `footer__top` y `footer__bottom`; `<script src="scripts.js" defer></script>`. Eliminar todo el contenido de la plantilla (sin `bg-shapes`, sin `onclick`, sin formulario)
- [X] T008 [P] Reescribir `scripts.js` según `contracts/ui-contract.md` §2: constante `SECTION_IDS = ['inicio','nosotros','servicios','contacto']`; `showSection(id)` quita `is-active` de todas las `.section`, la pone en la destino, pone `aria-current="page"` solo en el `nav[aria-label="Principal"] a[href="#id"]` correspondiente, mueve el foco al encabezado `#id-titulo` (`focus({preventScroll:true})`) y hace `window.scrollTo({top:0})`; delegación de clic en `document` para `a[href^="#"]` cuyo destino sea una sección (`preventDefault`, `history.pushState(null,'','#id')`, `showSection`); listener `hashchange` y lectura inicial del hash (hash válido → esa sección; vacío o inválido → `inicio` sin modificar la URL). Sin ningún otro código
- [X] T009 [P] Reescribir `styles.css` capas 1 a 3 y 7 a 8 según `contracts/design-tokens.md`: `:root` con todos los tokens de §1 (color), §2 (tipografía: `--fuente`, `--fuente-atrio`, escala `--t-*`), §3 (espaciado `--esp-1..6`, `--radio`, `--sombra-1/2`); reset (`box-sizing`, márgenes, `img{max-width:100%;height:auto;display:block}`); `body{background:var(--fondo);color:var(--texto);font-family:var(--fuente);line-height:1.6}`; `h1,h2,h3{color:var(--azul-900)}` con `--t-h1/h2/h3`; `.skip-link` (oculto hasta foco); `.container` (max 1200 px, padding 16/24 px); `.section{display:none}` `.section.is-active{display:block}`; `.site-header` (fondo blanco, borde inferior `--borde`, `position:sticky;top:0`, logo 72 px de alto / 56 px en móvil); `nav[aria-label="Principal"] a` como píldoras con `aria-current="page"` en `--azul-600` sobre `--azul-100`; `.btn`, `.btn--primario` (`--verde-600`, texto blanco, hover `--verde-700`), `.btn--secundario` (borde y texto `--azul-600`), `.btn--wa` (`--wa`, hover `--wa-hover`); `:focus-visible` con anillo `--azul-400` de 3 px; `@media (prefers-reduced-motion: reduce)` que anula transiciones y transforms; puntos de quiebre 768 / 1024 de §4 con el menú en dos filas por debajo de 768 px
- [X] T010 Eliminar archivos de la plantilla: borrar `contacto.php`, `images/welcome.png`, `images/pexels-suntorn-somtong-386224-1029243.jpg`, `images/rain-2590345_1280.jpg`, `images/templatemo-futuristic-girl.jpg`; mover `images/serviglass-logo.png` a `specs/001-serviglass-site-refresh/assets/sitio-actual/logo-anterior.png`; verificar con `grep -rn "welcome.png\|serviglass-logo.png\|templatemo\|contacto.php" index.html styles.css scripts.js` que no quedan referencias
- [X] T011 Verificación de la base: `npx -y serve -l 8080 .`, abrir `http://localhost:8080/#servicios` y confirmar que carga en Servicios con el enlace resaltado, que el botón atrás vuelve a la sección anterior y que Tab llega al enlace "Saltar al contenido"; ejecutar `npx -y html-validate index.html` sin errores (seguir `quickstart.md` §5)

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Identidad visual limpia y corporativa (Priority: P1) 🎯 MVP

**Goal**: Fondo blanco en todo el sitio, paleta verde/azul del logo nuevo en títulos, botones, íconos y navegación, logo nuevo en encabezado y favicon, sin efectos de la plantilla.

**Independent Test**: Abrir las cuatro secciones en 1440 px y 360 px: fondo blanco, ningún degradado oscuro, títulos azul marino, botones verdes, logo nuevo y favicon visibles; `node tools/contrast-check.mjs` en verde (quickstart §4.1).

### Implementation for User Story 1

- [X] T012 [US1] Añadir a `styles.css` la capa 4 (componentes) según `contracts/design-tokens.md`: `.card` (fondo blanco, borde 1 px `--borde`, radio 16 px, `--sombra-1`, padding `--esp-4`, hover `translateY(-2px)` + `--sombra-2`), `.card__icono` (círculo 56 px fondo `--azul-100`, SVG 28 px color `--verde-500`), `.seccion__titulo` y `.seccion__intro` (centrados, intro en `--texto-sec`, máx. 60ch), `.franja` (fondo `--azul-50`, padding vertical `--esp-5`, ancho completo), utilidades `.grid`, `.grid--2`, `.grid--3`, `.grid--4` (1 columna < 768, 2 desde 768, 3/4 desde 1024 según `design-tokens.md` §4), `.lista-check li::before` con "✓" en `--verde-600`
- [X] T013 [US1] Añadir a `styles.css` la capa 5 (secciones) solo en lo visual: `.hero` (grid 1 columna < 768 / 2 columnas ≥ 768 con texto a la izquierda, franja superior de 4 px con `--degradado-marca`, imagen con radio 12 px y `--sombra-1`), `.banner` (fondo `--azul-50`, título `--azul-900`, borde izquierdo 6 px `--verde-600`), contenedores `.nosotros`, `.contacto` con separación `--esp-5` entre bloques
- [X] T014 [US1] Confirmar en `styles.css` que no queda ningún estilo de la plantilla: `grep -n "bg-shapes\|\.shape\|text-shadow\|backdrop-filter\|rgba(255, 255, 255" styles.css` debe devolver cero líneas salvo un `backdrop-filter` opcional en `.site-header`; `grep -n "linear-gradient" styles.css` solo debe aparecer en `--degradado-marca`
- [X] T015 [US1] Verificar `quickstart.md` §4.1 (fondo blanco en las 4 secciones, colores de títulos/botones/menú, logo y favicon, `prefers-reduced-motion`) y ejecutar `node tools/contrast-check.mjs`; corregir cualquier par que falle

**Checkpoint**: La base visual está completa; las demás historias añaden contenido sin cambiar tokens.

---

## Phase 4: User Story 2 - Contacto inmediato por WhatsApp (Priority: P2)

**Goal**: Botón flotante de WhatsApp visible en todas las secciones y enlaces de WhatsApp en el hero y en Contacto, todos al número +57 320 381 6643 con mensaje inicial.

**Independent Test**: Desde cada sección, en escritorio y móvil, el botón flotante abre WhatsApp Web o la app con el chat al número y el mensaje prellenado; el botón no cubre enlaces del pie en 360 px (quickstart §4.2).

### Implementation for User Story 2

- [X] T016 [US2] Añadir en `index.html`, como último elemento de `<body>` (después del `<footer>` y antes del `<script>`), `<a class="whatsapp-float" href="https://wa.me/573203816643?text=Hola%20Serviglass%20Girardot%2C%20quiero%20informaci%C3%B3n%20sobre%20vidrios." target="_blank" rel="noopener" aria-label="Escríbenos por WhatsApp">` con el SVG inline del ícono de WhatsApp (Simple Icons, `viewBox="0 0 24 24"`, `fill="currentColor"`, `aria-hidden="true"`) y `<span class="whatsapp-float__texto">WhatsApp</span>`
- [X] T017 [US2] Añadir en `index.html` el CTA primario del hero dentro de `#inicio` (`<p class="hero__acciones">` con `<a class="btn btn--primario" href="https://wa.me/573203816643?text=…mismo texto codificado…" target="_blank" rel="noopener">Cotiza por WhatsApp</a>`) y, dentro de `#contacto`, un `<div class="contacto__datos">` inicial con `<a class="btn btn--wa" href="…mismo enlace…" target="_blank" rel="noopener">Escríbenos por WhatsApp</a>` (US5 completará el resto del bloque). Usar exactamente la misma URL en los tres enlaces (`contracts/ui-contract.md` §4)
- [X] T018 [P] [US2] Añadir a `styles.css` la capa 6 (botón flotante) según `contracts/ui-contract.md` §5: `.whatsapp-float{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom));z-index:1000;min-width:56px;height:56px;border-radius:999px;background:var(--wa);color:#fff;box-shadow:var(--sombra-2)}` con SVG de 28 px, `:hover`/`:focus-visible` en `--wa-hover`; `.whatsapp-float__texto` oculto por debajo de 768 px y visible como píldora con padding desde 768 px; `.site-footer{padding-bottom:88px}` por debajo de 768 px
- [X] T019 [US2] Verificar `quickstart.md` §4.2 pasos 1 a 6 (escritorio: pestaña nueva con el número y el mensaje; móvil o emulación: botón visible en todas las secciones y sin solaparse con el pie; navegación por teclado con anillo de foco)

**Checkpoint**: El sitio ya convierte visitas en chats de WhatsApp aunque el contenido no esté completo.

---

## Phase 5: User Story 3 - Inicio y Servicios con la propuesta de valor real (Priority: P3)

**Goal**: Hero, seis tarjetas de valor, banner y seis tarjetas de servicio con los textos exactos del documento del cliente e íconos SVG.

**Independent Test**: Comparar cada título, párrafo y punto de lista de `#inicio` y `#servicios` con `assets/informacion-serviglass-texto.txt`; ningún texto de la plantilla ni en inglés (quickstart §4.3).

### Implementation for User Story 3

- [X] T020 [US3] Completar el hero en `index.html` dentro de `#inicio` (`<div class="hero">`): `<h1 id="inicio-titulo" tabindex="-1">Vidrio de Alta Precisión para Obras que Exigen lo Mejor</h1>`, el párrafo "Desde la distribución mayorista… sin importar el tamaño de tu proyecto." (eliminar el " ." final que trae la fuente), `.hero__acciones` con el CTA de WhatsApp (T017) seguido de `<a class="btn btn--secundario" href="#servicios">Conoce nuestros servicios</a>`, y `<picture><source type="image/webp" srcset="images/planta/planta-04.webp"><img src="images/planta/planta-04.jpg" alt="Operarios de Serviglass Girardot procesando vidrio en la máquina de pulido" width="…" height="…" fetchpriority="high"></picture>` con las dimensiones reales del archivo generado en T004
- [X] T021 [US3] Añadir en `index.html`, después del hero, `<section class="valores" aria-labelledby="valores-titulo">` con `<h2 id="valores-titulo" class="seccion__titulo">¿Por qué Serviglass Girardot?</h2>` y `<div class="grid grid--3">` con seis `<article class="card">` en este orden y con título y párrafo copiados textualmente de "Tarjeta 1" a "Tarjeta 6" de la sección principal en `assets/informacion-serviglass-texto.txt`: Vidrios a la Medida y Alta Resistencia (ícono Lucide `ruler`), Transformación y Acabados de Lujo (`gem`), Cumplimiento y Entregas Oportunas (`truck`), Garantía de Calidad (`shield-check`), Asesoría Técnica y Solución Inmediata (`headset`), Respaldo y Cobertura Regional (`map-pin`); cada ícono como SVG inline 24×24 `stroke="currentColor" stroke-width="2" fill="none" aria-hidden="true"` dentro de `<div class="card__icono">`
- [X] T022 [US3] Completar `#servicios` en `index.html`: `<div class="banner">` con `<h2 id="servicios-titulo" tabindex="-1">Soluciones Integrales en Vidrio: Desde la Importación hasta la Instalación</h2>` y el subtítulo "Abastecemos al mercado mayorista… acabados de lujo." textual de "NUESTROS SERVICIOS → 1. BANNER PRINCIPAL"
- [X] T023 [US3] Añadir en `#servicios` de `index.html` `<div class="servicios grid grid--3">` con seis `<article class="card servicio">` en el orden de "2. TARJETAS DE SERVICIOS": Distribución Mayorista e Importación Directa (`package`), Vidrios de Seguridad y Alta Especificación (`shield`), Procesamiento y Acabados de Precisión (`settings`), Divisiones de Baño y Sistemas Arquitectónicos (`shower-head`), Espejería de Lujo y Vidrios Especiales (`sparkles`), Asesoría Técnica y Optimización de Materiales (`handshake`); cada una con `.card__icono`, `<h3>`, `<p>` descripción textual y `<ul class="lista-check servicio__lista">` con exactamente 4 `<li>` copiados de los "Puntos Clave" (sin el carácter ✓, que lo pone el CSS)
- [X] T024 [P] [US3] Añadir a `styles.css`: `.valores` (margen `--esp-6`), `.servicio__lista` (lista sin viñetas, `padding-left` 1.5rem, `li::before` "✓" en `--verde-600`), `.servicio h3` con `--t-h3`, `.hero__acciones` (flex con `--esp-3` de separación, apilado en móvil), `.hero img` con `aspect-ratio` del archivo para evitar saltos
- [X] T025 [US3] Verificar `quickstart.md` §4.3: títulos y orden, 4 puntos por servicio, ningún texto en inglés; comprobar fidelidad con `grep -c "medidas exactas, materiales de máxima resistencia" index.html` (esperado 1) y dos frases más elegidas al azar de la fuente

**Checkpoint**: Inicio y Servicios muestran la oferta real; el sitio ya es presentable al cliente (MVP recomendado: US1 + US2 + US3).

---

## Phase 6: User Story 4 - Sobre nosotros: empresa, indicadores, equipo y planta (Priority: P4)

**Goal**: Texto institucional, cuatro indicadores (dos con cifra, dos solo título), equipo con fotos reales y galería de la planta.

**Independent Test**: `#nosotros` muestra título y tres párrafos, cuatro tarjetas de indicador del mismo estilo sin cifras inventadas, cuatro personas con foto, cargo y biografía, cinco fotos de planta con carga diferida (quickstart §4.4).

### Implementation for User Story 4

- [X] T026 [US4] Completar en `index.html` el bloque `<div class="nosotros">` de `#nosotros`: `<h2 id="nosotros-titulo" tabindex="-1">La Fortaleza de un Gran Distribuidor</h2>` y los tres párrafos textuales de "SECCIÓN PRINCIPAL: QUIÉNES SOMOS" (Párrafo 1, 2 y 3) en `assets/informacion-serviglass-texto.txt`
- [X] T027 [US4] Añadir en `index.html` `<ul class="indicadores grid grid--4" aria-label="Indicadores">` con cuatro `<li class="indicador">` en este orden según `data-model.md` §7: (1) `<span class="indicador__cifra">12 años</span><span class="indicador__titulo">Años de Experiencia</span>`; (2) `class="indicador indicador--sin-cifra"` con `<span class="indicador__icono">` (Lucide `weight`) y título "Toneladas / Metros Distribuidos al Año"; (3) cifra "+100", título "Empresas y Constructores Activos"; (4) `indicador--sin-cifra` con ícono `layers` y título "Milímetros de Espesor en Inventario". Restricción textual de `data-model.md`: "nunca se muestra 'N/A', '—' ni un número inventado"
- [X] T028 [US4] Añadir en `index.html` `<section class="equipo" aria-labelledby="equipo-titulo">` con `<h2 id="equipo-titulo" class="seccion__titulo">Nuestro equipo</h2>` y `<div class="grid grid--4">` con cuatro `<article class="card miembro">`: `<picture>` (`images/equipo/<slug>.webp` + `.jpg`, `loading="lazy"`, `width`/`height` reales, `alt` "Foto de <nombre>, <cargo>"), `<h3>`, `<p class="miembro__cargo">`, `<p class="miembro__bio">` con nombre, cargo y biografía textuales de "SECCIÓN DEL EQUIPO": Mario Domínguez (CEO y Fundador, `mario-dominguez`), Tatiana Lenis (Líder Administrativa y de Recursos Humanos, `tatiana-lenis`), Julio Sánchez (Líder de Bodega y Almacenamiento, `julio-sanchez`), Laura Ávila (Asesora Comercial, `laura-avila`). Sin íconos de redes por persona
- [X] T029 [US4] Añadir en `index.html` `<section class="galeria franja" aria-labelledby="galeria-titulo">` con `<h2 id="galeria-titulo" class="seccion__titulo">Nuestra planta</h2>` y `<div class="grid grid--3">` con cinco `<figure>` que contienen `<picture>` (`images/planta/planta-0N.webp` + `.jpg`, `loading="lazy"`, `width`/`height` reales) y los `alt` exactos de `data-model.md` §9 (planta-01 "Bodega de Serviglass Girardot con láminas de vidrio almacenadas en caballetes y puente grúa", planta-02 "Vista general de la planta con mesas de corte y láminas de vidrio", planta-03 "Láminas de vidrio de distintos tonos almacenadas en caballetes", planta-04 "Operarios procesando vidrio en la máquina de pulido", planta-05 "Cajas de vidrio embaladas sobre camión para despacho")
- [X] T030 [P] [US4] Añadir a `styles.css`: `.indicador` (tarjeta centrada, borde `--borde`, radio 16 px), `.indicador__cifra` (`--t-cifra`, peso 700, `--azul-900`), `.indicador__icono` (mismo alto que la cifra, SVG 36 px en `--verde-500` dentro de círculo `--azul-100`), `.indicador__titulo` (`--texto-sec`), `.indicadores` 2 columnas < 1024 / 4 desde 1024; `.miembro picture img` (relación 3:4, radio 12 px, borde 1 px `--borde` para el caso límite de fondo blanco), `.miembro__cargo` (`--verde-700`, peso 600), `.miembro__bio` (`--t-small`, `--texto-sec`); `.galeria figure img` (radio 12 px, `aspect-ratio` 4/3 con `object-fit: cover`)
- [X] T031 [US4] Verificar `quickstart.md` §4.4: título y párrafos, cuatro indicadores sin "N/A" ni guiones, cuatro miembros con foto real, galería con carga diferida (Network en DevTools)

**Checkpoint**: Sobre nosotros completo.

---

## Phase 7: User Story 5 - Datos de contacto reales (Priority: P5)

**Goal**: Dirección, teléfono, horario, cuatro correos, tres redes y mapa real; sin formulario.

**Independent Test**: Los 10 enlaces de la tabla de `quickstart.md` §4.6 abren el destino correcto; no existe `<form>`; el horario muestra las tres líneas.

### Implementation for User Story 5

- [X] T032 [US5] Completar `.contacto__datos` en `#contacto` de `index.html` según `contracts/ui-contract.md` §4 y `data-model.md` §12: `<h2 id="contacto-titulo" tabindex="-1">Contacto</h2>`; lista `<ul class="contacto__lista">` con ítems (ícono Lucide `aria-hidden` + texto): dirección (`map-pin`) "Cra. 9 No. 14-30, Girardot – Cundinamarca"; teléfono (`phone`) `<a href="tel:+573203816643">320 381 6643</a>`; el botón `.btn--wa` de T017; horario (`clock`) como `<ul class="horario">` con tres `<li>`: "Lunes a viernes: 8:00 a. m. a 12:00 p. m. y 2:00 p. m. a 5:30 p. m.", "Sábados: 8:15 a. m. a 2:00 p. m.", "Domingos y festivos: no hay servicio"; correos (`mail`) como `<dl class="correos">` con cuatro pares `<dt>`/`<dd>`: Gerencia → `mailto:gerencia@serviglassgirardot.com`, Área Comercial → `mailto:jefacomercial@serviglassgirardot.com`, Subgerencia → `mailto:subgerencia@serviglassgirardot.com`, Administración y Contabilidad → `mailto:asistenteadmonycont@serviglassgirardot.com`; `<ul class="redes">` con tres enlaces `target="_blank" rel="noopener"` y `aria-label` ("Instagram de Serviglass Girardot", etc.) a `https://www.instagram.com/serviglassgirardotsas/`, `https://www.facebook.com/search/top?q=Serviglass%20Girardot%20S.A.S.` (provisional) y `https://www.tiktok.com/@serviglass.girardot`, con SVG inline de Simple Icons y el texto del usuario visible (@serviglassgirardotsas, Serviglass Girardot S.A.S., @serviglass.girardot)
- [X] T033 [US5] Añadir en `#contacto` de `index.html` `<div class="contacto__mapa">` con `<h3>Encuéntranos</h3>`, `<div class="mapa"><iframe src="https://www.google.com/maps?q=Cra.+9+%2314-30,+Girardot,+Cundinamarca&output=embed" title="Ubicación de Serviglass Girardot en Google Maps" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>` y `<a class="btn btn--secundario" href="https://www.google.com/maps/search/?api=1&query=Cra.+9+%2314-30,+Girardot,+Cundinamarca" target="_blank" rel="noopener">Abrir en Google Maps</a>`
- [X] T034 [US5] Confirmar que `index.html` no contiene `<form`, `<input`, `<textarea` ni `type="submit"` (`grep -n "<form\|<input\|<textarea" index.html` → cero líneas), que `contacto.php` no existe (T010) y que `styles.css` no conserva reglas `.form-group`, `.contact-form` ni `button[type="submit"]`
- [X] T035 [P] [US5] Añadir a `styles.css`: `.contacto` (grid 1 columna < 768 / 2 columnas ≥ 768 con `--esp-5`), `.contacto__lista li` (flex con ícono 24 px en `--azul-600` y texto), `.horario li` (píldoras con fondo `--azul-100`, `--t-small`), `.correos dt` (`--texto-sec`, `--t-small`) y `dd a` (`--azul-600`), `.redes` (fila de botones circulares 44 px con borde `--borde`, SVG 22 px `--azul-900`, hover `--azul-100`), `.mapa` (`aspect-ratio:16/9; min-height:320px; border-radius:12px; overflow:hidden; border:1px solid var(--borde)`) con `iframe{width:100%;height:100%;border:0}`
- [X] T036 [US5] Verificar `quickstart.md` §4.6: tabla de 10 enlaces, mapa centrado en Girardot, ausencia de formulario, tres líneas de horario

**Checkpoint**: Contacto completo y sin dependencias de servidor.

---

## Phase 8: User Story 6 - Prueba social: aliados y experiencias de éxito (Priority: P6)

**Goal**: Franja con los cuatro logos de aliados y bloque con los cuatro testimonios en Inicio.

**Independent Test**: En `#inicio`, tras las tarjetas de valor, aparecen cuatro logos a la misma altura sin deformación y cuatro citas con su empresa (quickstart §4.7).

### Implementation for User Story 6

- [X] T037 [US6] Añadir en `index.html`, dentro de `#inicio` después de `.valores`, `<section class="aliados franja" aria-labelledby="aliados-titulo">` con `<h2 id="aliados-titulo" class="seccion__titulo">Aliados comerciales</h2>` y `<ul class="aliados__lista">` con cuatro `<li class="aliados__logo">` que contienen `<picture>` (`images/aliados/<slug>.webp` + `.jpg`, `loading="lazy"`, `width`/`height` reales) con `alt` igual al nombre: `jm-construcciones` "Vidrios y Aluminios JM Construcciones", `fc-fabian-cano` "Vidrios y Aluminios FC (Fabián Cano)", `techos-y-aluminios` "Techos y Aluminios", `vg-ingenieria` "Ingeniería, Construcciones & Creaciones VG"
- [X] T038 [US6] Añadir en `index.html`, después de `.aliados`, `<section class="testimonios" aria-labelledby="testimonios-titulo">` con `<h2 id="testimonios-titulo" class="seccion__titulo">Experiencias de éxito</h2>` y `<div class="grid grid--2">` con cuatro `<figure class="card testimonio"><blockquote><p>…cita textual…</p></blockquote><figcaption><cite>…empresa…</cite></figcaption></figure>` en el orden de "Experiencias de Éxito (COMENTARIOS)": Vidrios y Aluminios JM Construcciones, Vidrios y Aluminios FC, Techos y Aluminios, Ingeniería, Construcciones & Creaciones VG (las citas 1 y 3 son idénticas en la fuente y se publican tal cual)
- [X] T039 [P] [US6] Añadir a `styles.css`: `.aliados__lista` (flex, `flex-wrap`, centrado, `--esp-4` de separación), `.aliados__logo` (caja blanca 72 px de alto y 160 px de ancho máximo, padding 8 px, borde `--borde`, radio 12 px) con `img{height:100%;width:auto;max-width:100%;object-fit:contain}`; `.testimonio blockquote` (sin margen, texto `--texto`, comilla decorativa "“" en `--verde-500` de 2.5rem), `.testimonio cite` (`--texto-muted`, `--t-small`, sin cursiva, peso 600)
- [X] T040 [US6] Verificar `quickstart.md` §4.7: cuatro logos alineados y sin deformación (comparar proporciones con `assets/aliados/`), cuatro citas con autor

**Checkpoint**: Inicio completo con prueba social.

---

## Phase 9: User Story 7 - Crédito del desarrollador con la marca ATRIO (Priority: P7)

**Goal**: Pie de página con enlaces, redes, aviso de derechos de Serviglass y el crédito "Desarrollado por ATRIO" según la guía de marca (variante sobre blanco).

**Independent Test**: El pie muestra el símbolo y el nombre ATRIO con tipografía y colores de la guía, sin menciones a Glossy Touch ni TemplateMo; con Google Fonts bloqueado sigue legible (quickstart §4.8).

### Implementation for User Story 7

- [X] T041 [US7] Completar `<footer class="site-footer">` en `index.html` según `contracts/ui-contract.md` §6: `footer__top` con `.footer__brand` (`<img src="images/logo-serviglass.jpg" alt="" width="561" height="374">` a 48 px de alto + "Serviglass Girardot S.A.S." + "Distribuidora de vidrios"), `<nav aria-label="Pie de página">` con enlaces a `#inicio`, `#nosotros`, `#servicios`, `#contacto`, y `<ul class="footer__redes">` con Instagram, Facebook, TikTok y WhatsApp (mismas URLs y atributos que en T032/T016); `footer__bottom` con `<p class="footer__copy">© 2026 Serviglass Girardot S.A.S. Todos los derechos reservados.</p>` y `<p class="footer__credit">Desarrollado por <svg class="atrio-simbolo" …contenido de images/atrio/atrio-simbolo-pie-sobre-blanco.svg inline, width="22" height="22" aria-hidden="true"…></svg> <strong class="atrio-wordmark"><span>AT</span>RIO</strong></p>`
- [X] T042 [P] [US7] Añadir a `styles.css` la capa 6 (pie) según `contracts/design-tokens.md`: `.site-footer` (borde superior `--borde`, fondo blanco, padding `--esp-5`), `.footer__top` (grid 1 columna < 768 / 3 columnas ≥ 768), `.footer__brand` (logo 48 px + nombre en `--azul-900`), `nav[aria-label="Pie de página"] a` (`--texto-sec`, hover `--azul-600`), `.footer__redes` (misma apariencia que `.redes`), `.footer__bottom` (flex `space-between` ≥ 768 / apilado y centrado < 768, borde superior `--borde`, `--t-small`), `.footer__copy` (`--texto-muted`), `.footer__credit` (`--atrio-texto`, 13 px, flex con `gap: 10px`), `.atrio-simbolo` (`margin-inline: 6px` como espacio libre ≈ ancho de la T), `.atrio-wordmark` (`font-family: var(--fuente-atrio); font-weight: 700; letter-spacing: 2px; color: var(--atrio-noche)`) y `.atrio-wordmark span{color: var(--atrio-acento-claro)}`
- [X] T043 [US7] Verificar `quickstart.md` §4.8: texto y colores del crédito, calados blancos del símbolo al 300 %, pie legible con `fonts.googleapis.com` bloqueado, y `Select-String -Path index.html,styles.css,scripts.js -Pattern "Glossy|TemplateMo|glossytouch|Design Street|John Anderson|templatemo"` → 0 resultados

**Checkpoint**: Las siete historias están implementadas.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Responsive, accesibilidad, rendimiento y cierre de la validación.

- [X] T044 Pasada responsive en `styles.css` según `quickstart.md` §4.5: en 360, 768, 1024 y 1440 px, `document.documentElement.scrollWidth === window.innerWidth`; cuadrículas 1/2/3 columnas; menú en dos filas en 360 px; hero apilado en móvil; corregir cualquier desbordamiento (imágenes, iframe, tablas de correos)
- [X] T045 Pasada de accesibilidad en `index.html`: todos los `<img>` con `alt` en español (decorativos con `alt=""`), todos los SVG decorativos con `aria-hidden="true"`, enlaces solo-ícono con `aria-label`, orden de encabezados h1 → h2 → h3 sin saltos, `:focus-visible` visible en menú, botones y botón flotante; Lighthouse móvil Accesibilidad ≥ 95
- [X] T046 Rendimiento: confirmar `loading="lazy"` en todas las imágenes salvo logo y hero, `width`/`height` en todas, peso de `images/` < 1 MB (`du -sh images`), Lighthouse móvil Rendimiento ≥ 90 y Buenas prácticas ≥ 90; guardar el informe en `specs/001-serviglass-site-refresh/checklists/lighthouse-2026-10-06.html` (ajustar la fecha)
- [X] T047 Ejecutar `npx -y html-validate index.html` y `node tools/contrast-check.mjs` y corregir hallazgos hasta que ambos terminen sin errores
- [X] T048 Fidelidad de contenido: para cada bloque de `data-model.md` §2 a §12, buscar en `index.html` una frase completa de la fuente (`assets/informacion-serviglass-texto.txt`) y anotar cualquier diferencia; solo se admiten las correcciones ortotipográficas de `research.md` R15
- [X] T049 [P] Actualizar `specs/001-serviglass-site-refresh/checklists/requirements.md` con el resultado de la validación (quickstart §6) y la lista de pendientes para el cliente: versión vectorial del logo nuevo, URL de la página de Facebook, confirmación de los testimonios duplicados, cifras de los indicadores si desean publicarlas

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias; T002, T003, T005 y T006 en paralelo; T004 depende de T001 y T002.
- **Foundational (Phase 2)**: depende de T004 y T005 (imágenes y SVG listos); T007, T008 y T009 pueden hacerse en paralelo (archivos distintos); T010 después de T007; T011 al final. BLOQUEA todas las historias.
- **User Stories (Phase 3 a 9)**: todas dependen de Phase 2. Como comparten `index.html` y `styles.css`, el orden recomendado es el de prioridad (US1 → US7). Dentro de cada historia, la tarea de CSS marcada [P] puede hacerse en paralelo con la de HTML porque los nombres de clase están fijados en `contracts/ui-contract.md` §3.
- **Polish (Phase 10)**: depende de todas las historias que se quieran entregar.

### User Story Dependencies

- **US1 (P1)**: solo Phase 2. Define la apariencia que las demás heredan.
- **US2 (P2)**: solo Phase 2. T017 crea el `.contacto__datos` mínimo que US5 completa.
- **US3 (P3)**: Phase 2; usa `.card`, `.grid` y `.lista-check` de US1 (T012). Si se hace antes de US1, los estilos quedan pendientes pero el contenido es verificable.
- **US4 (P4)**: Phase 2; usa `.card`, `.grid`, `.franja` de US1.
- **US5 (P5)**: Phase 2; integra el botón de WhatsApp de US2 (T017).
- **US6 (P6)**: Phase 2 y US3 (se inserta después de `.valores` en `#inicio`).
- **US7 (P7)**: Phase 2 y las URLs de redes definidas en US5 (T032); puede hacerse antes copiando las URLs del contrato §4.

### Within Each User Story

- Contenido HTML antes de la verificación; CSS en paralelo con HTML cuando está marcado [P].
- Cada historia termina con su tarea de verificación (quickstart) antes de pasar a la siguiente.

### Parallel Opportunities

- Phase 1: T002 ∥ T003 ∥ T005 ∥ T006 (tras T001 para T004).
- Phase 2: T007 ∥ T008 ∥ T009.
- Dentro de las historias: T018 ∥ T016–T017; T024 ∥ T020–T023; T030 ∥ T026–T029; T035 ∥ T032–T034; T039 ∥ T037–T038; T042 ∥ T041.
- Phase 10: T049 ∥ T044–T048.
- Dos personas: una en `index.html` (contenido) y otra en `styles.css` (estilos) por historia; nunca dos personas en el mismo archivo a la vez.

---

## Parallel Example: User Story 3

```bash
# Contenido y estilos en paralelo (archivos distintos, clases fijadas por el contrato):
Task: "T020–T023: hero, tarjetas de valor, banner y tarjetas de servicio en index.html"
Task: "T024: .valores, .servicio__lista, .hero__acciones en styles.css"
# Luego, en serie:
Task: "T025: verificación quickstart §4.3"
```

---

## Implementation Strategy

### MVP First

1. Phase 1 (Setup) y Phase 2 (Foundational).
2. US1 (identidad visual) → validar con quickstart §4.1.
3. US2 (WhatsApp) → validar con §4.2.
4. US3 (Inicio y Servicios) → validar con §4.3.
5. **STOP and VALIDATE**: con US1 a US3 el sitio ya es presentable al cliente (marca, oferta y canal de contacto). Mostrar y recoger comentarios.

### Incremental Delivery

1. US4 (Sobre nosotros) → §4.4.
2. US5 (Contacto) → §4.6.
3. US6 (Aliados y testimonios) → §4.7.
4. US7 (Crédito ATRIO) → §4.8.
5. Phase 10 (Polish) → quickstart completo y Lighthouse; actualizar el checklist.

### Parallel Team Strategy

Con dos personas: una toma `index.html` y otra `styles.css` dentro de cada historia (las clases están en el contrato); ambas convergen en la tarea de verificación de la historia. No conviene trabajar dos historias a la vez en el mismo archivo.

---

## Notes

- [P] tasks = archivos distintos, sin dependencias pendientes.
- Las etiquetas [US#] trazan cada tarea a la historia de `spec.md`.
- Los textos se copian de `assets/informacion-serviglass-texto.txt`; está prohibido reescribirlos (FR-072).
- Un solo número de WhatsApp en todo el sitio: `573203816643`; una sola URL de chat (`contracts/ui-contract.md` §4).
- Detenerse en cualquier checkpoint para validar la historia con `quickstart.md`.
- Commits sugeridos por fase o por historia; el proyecto aún no es repositorio git (ejecutar `git init` si se desea historial).
