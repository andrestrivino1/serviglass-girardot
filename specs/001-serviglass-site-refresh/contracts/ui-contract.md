# UI Contract: estructura, navegación y enlaces del sitio

**Feature**: `001-serviglass-site-refresh` · **Date**: 2026-10-06

Este contrato fija los identificadores, comportamientos y enlaces que el marcado, el CSS, el JavaScript y la guía de validación comparten. Cambiarlo exige actualizar `quickstart.md`.

## 1. Esqueleto de `index.html`

```text
<a class="skip-link" href="#main">Saltar al contenido</a>
<header class="site-header">
  <a class="brand" href="#inicio"> <img logo> <span>Serviglass Girardot</span> </a>
  <nav aria-label="Principal">
    <a href="/" aria-current="page">Inicio</a>
    <a href="/nosotros">Sobre nosotros</a>
    <a href="/servicios">Servicios</a>
    <a href="/contacto">Contacto</a>
  </nav>
</header>
<main id="main">
  <section id="inicio"    class="section is-active" aria-labelledby="inicio-titulo">…</section>
  <section id="nosotros"  class="section"           aria-labelledby="nosotros-titulo">…</section>
  <section id="servicios" class="section"           aria-labelledby="servicios-titulo">…</section>
  <section id="contacto"  class="section"           aria-labelledby="contacto-titulo">…</section>
</main>
<footer class="site-footer">…</footer>
<a class="whatsapp-float" href="…wa.me…" target="_blank" rel="noopener" aria-label="Escríbenos por WhatsApp">…</a>
```

Reglas:
- Solo una `section.section` lleva `is-active`; las demás tienen `display: none` por CSS. Sin JavaScript, el CSS muestra `#inicio` y los enlaces del menú siguen funcionando como anclas (degradación aceptable).
- El `<footer>` es único y está fuera de `<main>`; no se mueve con JavaScript.
- El botón flotante es el último elemento del `<body>`.

## 2. Navegación por rutas limpias (`scripts.js` + `.htaccess`)

| Ruta | Sección | Título de la pestaña |
|------|---------|----------------------|
| `/` (también `/inicio`) | `#inicio` | Serviglass Girardot S.A.S. \| Distribuidora de vidrios en Girardot |
| `/nosotros` | `#nosotros` | Sobre nosotros \| Serviglass Girardot S.A.S. |
| `/servicios` | `#servicios` | Servicios \| Serviglass Girardot S.A.S. |
| `/contacto` | `#contacto` | Contacto \| Serviglass Girardot S.A.S. |

Estas rutas son las que recibirá `routes/web.php` al migrar a Laravel (módulo `Site`).

| Evento | Comportamiento |
|--------|----------------|
| Servidor | `.htaccess` entrega `index.html` para `/inicio`, `/nosotros`, `/servicios` y `/contacto` (solo si no existe un archivo o carpeta con ese nombre). En local, `npx serve -s` o `tools/verify-site.mjs` hacen lo mismo. |
| Carga | Si la URL trae `#seccion` (enlace antiguo), se activa esa sección y la URL se corrige con `history.replaceState` a la ruta limpia; si no, se lee `location.pathname`; ruta desconocida → Inicio. |
| Clic en enlace interno (`a[href]` del mismo origen cuya ruta o hash corresponde a una sección) | Prevenir la navegación, `history.pushState` a la ruta limpia, `showSection(id)`, desplazar al inicio. |
| `popstate` / `hashchange` | Mostrar la sección que indique la URL (botones atrás/adelante). |
| `showSection(id)` | Quitar `is-active` de todas, ponerla en la sección destino; `aria-current="page"` solo en el enlace del menú correspondiente; actualizar `document.title`; mover el foco al encabezado de la sección (`tabindex="-1"`). |
| Sin servidor (`file://`) | No se pueden cambiar rutas: el script cae al modo `#seccion` automáticamente. |

No hay otras interacciones JavaScript (sin paralaje, ondas, formularios ni carruseles).

## 3. Identificadores y clases de secciones

| Sección | Bloques (en orden) y clases |
|---------|-----------------------------|
| `#inicio` | `.hero` (texto + `<picture>`), `.valores` (`.card` ×6), `.aliados` (`.aliados__logo` ×4), `.testimonios` (`.testimonio` ×4) |
| `#nosotros` | `.nosotros` (texto + `.indicadores` con `.indicador` ×4, dos con `.indicador--sin-cifra`), `.equipo` (`.miembro` ×4), `.galeria` (`<figure>` ×5) |
| `#servicios` | `.banner`, `.servicios` (`.servicio` ×6 con `.servicio__lista`) |
| `#contacto` | `.contacto` (`.contacto__datos` + `.contacto__mapa`) |

## 4. Enlaces externos

| Enlace | URL | Atributos |
|--------|-----|-----------|
| WhatsApp (flotante, hero, contacto) | `https://wa.me/573203816643?text=Hola%20Serviglass%20Girardot%2C%20quiero%20informaci%C3%B3n%20sobre%20vidrios.` | `target="_blank" rel="noopener"` |
| Teléfono | `tel:+573203816643` | — |
| Correos | `mailto:gerencia@serviglassgirardot.com` · `mailto:jefacomercial@serviglassgirardot.com` · `mailto:subgerencia@serviglassgirardot.com` · `mailto:asistenteadmonycont@serviglassgirardot.com` | — |
| Instagram | `https://www.instagram.com/serviglassgirardotsas/` | `target="_blank" rel="noopener"` |
| Facebook | `https://www.facebook.com/search/top?q=Serviglass%20Girardot%20S.A.S.` (provisional hasta recibir la URL de la página) | `target="_blank" rel="noopener"` |
| TikTok | `https://www.tiktok.com/@serviglass.girardot` | `target="_blank" rel="noopener"` |
| Mapa incrustado | `https://www.google.com/maps?q=Cra.+9+%2314-30,+Girardot,+Cundinamarca&output=embed` | `<iframe loading="lazy" title="Ubicación de Serviglass Girardot en Google Maps" referrerpolicy="no-referrer-when-downgrade" allowfullscreen>` |
| Abrir en Google Maps | `https://www.google.com/maps/search/?api=1&query=Cra.+9+%2314-30,+Girardot,+Cundinamarca` | `target="_blank" rel="noopener"` |
| Google Fonts (solo "ATRIO") | `https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@700&text=ATRIO&display=swap` | `<link rel="preconnect">` a `fonts.googleapis.com` y `fonts.gstatic.com` |

## 5. Botón flotante de WhatsApp

- Tamaño 56×56 px (48 px mínimo táctil), `position: fixed; right: 16px; bottom: calc(16px + env(safe-area-inset-bottom)); z-index: 1000`.
- Fondo `--wa` (`#128C7E`), ícono blanco de 28 px, sombra `--sombra-2`; hover/focus `--wa-hover` (`#075E54`) y anillo de foco visible.
- A partir de 768 px muestra el texto "WhatsApp" a la derecha del ícono (píldora).
- El `<footer>` tiene `padding-bottom: 88px` por debajo de 768 px para que el botón no cubra sus enlaces.

## 6. Pie de página

```text
<footer class="site-footer">
  <div class="footer__top">
    <div class="footer__brand"> logo pequeño + "Serviglass Girardot S.A.S." + "Distribuidora de vidrios" </div>
    <nav aria-label="Pie de página"> Inicio · Sobre nosotros · Servicios · Contacto </nav>
    <ul class="footer__redes"> Instagram · Facebook · TikTok · WhatsApp </ul>
  </div>
  <div class="footer__bottom">
    <p class="footer__copy">© 2026 Serviglass Girardot S.A.S. Todos los derechos reservados.</p>
    <p class="footer__credit">Desarrollado por <svg …ATRIO símbolo…> <strong class="atrio-wordmark"><span>AT</span>RIO</strong></p>
  </div>
</footer>
```

- `footer__bottom` en fila (espacio entre) desde 768 px; apilado y centrado por debajo.
- Prohibido: "Glossy Touch", "TemplateMo", "Crafted with…", enlaces sin destino.

## 7. Metadatos en `<head>`

```text
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Serviglass Girardot S.A.S. | Distribuidora de vidrios en Girardot</title>
<meta name="description" content="…≤ 160 caracteres (data-model.md §14)…">
<meta name="theme-color" content="#041B58">
<link rel="icon" type="image/png" sizes="32x32" href="images/favicon-32.png">
<link rel="icon" type="image/png" sizes="192x192" href="images/favicon-192.png">
<link rel="apple-touch-icon" href="images/apple-touch-icon.png">
<link rel="canonical" href="https://serviglassgirardot.com/">
<meta property="og:type" content="website">
<meta property="og:url" content="https://serviglassgirardot.com/">
<meta property="og:title" content="Serviglass Girardot S.A.S. | Distribuidora de vidrios en Girardot">
<meta property="og:description" content="…igual que description…">
<meta property="og:image" content="https://serviglassgirardot.com/images/og-image.jpg">
<meta property="og:image:width" content="1200"> <meta property="og:image:height" content="630">
<meta property="og:locale" content="es_CO">
<link rel="preload" as="image" type="image/webp" href="images/planta/planta-04.webp">
<link rel="stylesheet" href="styles.css">
```

La hoja de Google Fonts (solo "ATRIO") va al **final del `<body>`**, antes de `scripts.js`, para no bloquear el render del contenido:

```text
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@700&amp;text=ATRIO&amp;display=swap">
```

El dominio de publicación es `serviglassgirardot.com` (hosting cPanel de GoDaddy), por eso `canonical`, `og:url` y `og:image` son absolutas.

## 8. Imágenes

| Patrón | Regla |
|--------|-------|
| Fotos (equipo, planta, hero) | `<picture><source type="image/webp" srcset="…webp"><img src="…jpg" alt="…" width height loading="lazy"></picture>`; el hero sin `loading="lazy"` (`fetchpriority="high"`). |
| Logos de aliados | mismo patrón, dentro de `.aliados__logo` de 72 px de alto, `object-fit: contain`. |
| Logo de Serviglass | `<img src="images/logo-serviglass.jpg" alt="Serviglass Girardot S.A.S. – Distribuidora de vidrios" width="561" height="374">` mostrado a 72 px de alto (56 px en móvil). |
| Íconos | SVG inline, `aria-hidden="true"` si acompañan texto. |

## 9. Herramientas (`tools/`)

| Script | Entrada | Salida | Comando |
|--------|---------|--------|---------|
| `optimize-images.mjs` | `specs/001-serviglass-site-refresh/assets/{logo-nuevo-serviglass.jpeg, equipo/, empresa/, aliados/}` | `images/{logo-serviglass.jpg, favicon-*.png, apple-touch-icon.png, og-image.jpg, equipo/, planta/, aliados/}` | `cd tools && npm install && node optimize-images.mjs` |
| `contrast-check.mjs` | tabla de pares en el propio script (espejo de `design-tokens.md`) | informe en consola; código de salida 1 si algún par falla | `node tools/contrast-check.mjs` |

Ambos son idempotentes y no tocan `specs/`.
