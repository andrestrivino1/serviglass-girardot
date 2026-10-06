# Data Model: contenido del sitio Serviglass Girardot

**Feature**: `001-serviglass-site-refresh` · **Date**: 2026-10-06

El sitio es estático: no hay base de datos ni API. El "modelo de datos" es el inventario de contenido que se escribe directamente en `index.html`. Cada entidad indica sus campos, reglas de validación (derivadas de los FR del spec) y la fuente de verdad. Fuente principal: `assets/informacion-serviglass-texto.txt` (texto extraído del Word del cliente); aclaraciones: `spec.md` → Clarifications.

## Entidades

### 1. Sección (navegación)

| Campo | Valor |
|-------|-------|
| `id` | `inicio` · `nosotros` · `servicios` · `contacto` |
| `etiqueta de menú` | Inicio · Sobre nosotros · Servicios · Contacto |
| `encabezado` | `h1` en Inicio; `h2` en las demás, con `tabindex="-1"` para recibir el foco |

**Estado**: exactamente una sección activa. Transiciones: clic en el menú, clic en un CTA o enlace del pie, cambio de `location.hash`, carga inicial (hash válido → esa sección; vacío o inválido → `inicio`).

### 2. Hero (Inicio)

| Campo | Contenido | Fuente |
|-------|-----------|--------|
| título (h1) | Vidrio de Alta Precisión para Obras que Exigen lo Mejor | "1. SECCIÓN PRINCIPAL" |
| párrafo | Desde la distribución mayorista… sin importar el tamaño de tu proyecto. | ídem (se elimina el " ." final) |
| CTA primario | "Cotiza por WhatsApp" → enlace WhatsApp | Assumptions |
| CTA secundario | "Conoce nuestros servicios" → `#servicios` | Assumptions |
| imagen | `images/planta/planta-04.jpg` (+ WebP), alt "Operarios de Serviglass Girardot procesando vidrio en la máquina de pulido" | R8 |

### 3. Tarjeta de valor (×6, Inicio)

| Campo | Regla |
|-------|-------|
| `icono` | SVG inline según R5 |
| `titulo` | texto exacto del documento |
| `parrafo` | texto exacto del documento |

Orden y títulos: Vidrios a la Medida y Alta Resistencia · Transformación y Acabados de Lujo · Cumplimiento y Entregas Oportunas · Garantía de Calidad · Asesoría Técnica y Solución Inmediata · Respaldo y Cobertura Regional. Fuente: "Tarjeta 1" a "Tarjeta 6" de la sección principal.

### 4. Aliado comercial (×4, Inicio)

| Campo | Regla |
|-------|-------|
| `nombre` | se usa como `alt` del logo |
| `logo` | `images/aliados/<slug>.jpg` + WebP, alto 160 px, mostrado a 72 px con `object-fit: contain` |

| slug | nombre |
|------|--------|
| `jm-construcciones` | Vidrios y Aluminios JM Construcciones |
| `fc-fabian-cano` | Vidrios y Aluminios FC (Fabián Cano) |
| `techos-y-aluminios` | Techos y Aluminios |
| `vg-ingenieria` | Ingeniería, Construcciones & Creaciones VG |

Fuente: "ALIADOS COMERCIALES (LOGOS)" y archivos en `assets/aliados/`.

### 5. Testimonio (×4, Inicio)

| Campo | Regla |
|-------|-------|
| `cita` | texto exacto; `<blockquote>` |
| `autor` | nombre de la empresa; `<cite>` |

Orden: Vidrios y Aluminios JM Construcciones · Vidrios y Aluminios FC · Techos y Aluminios · Ingeniería, Construcciones & Creaciones VG. Nota: las citas 1 y 3 son idénticas en la fuente; se publican tal cual (Assumptions). Fuente: "Experiencias de Éxito (COMENTARIOS)".

### 6. Quiénes somos (Sobre nosotros)

| Campo | Contenido | Fuente |
|-------|-----------|--------|
| título (h2) | La Fortaleza de un Gran Distribuidor | "SECCIÓN PRINCIPAL: QUIÉNES SOMOS" |
| párrafos | 3, texto exacto | ídem |

### 7. Indicador (×4, Sobre nosotros)

| Campo | Regla |
|-------|-------|
| `titulo` | texto exacto |
| `cifra` | opcional; solo si la fuente la trae |
| `icono` | obligatorio cuando no hay cifra (ocupa su lugar) |

| orden | cifra | título | icono |
|-------|-------|--------|-------|
| 1 | 12 años | Años de Experiencia | — |
| 2 | — | Toneladas / Metros Distribuidos al Año | `weight` |
| 3 | +100 | Empresas y Constructores Activos | — |
| 4 | — | Milímetros de Espesor en Inventario | `layers` |

**Validación**: nunca se muestra "N/A", "—" ni un número inventado (FR-031). Fuente: "SECCIÓN DE INDICADORES" + Clarifications.

### 8. Miembro del equipo (×4, Sobre nosotros)

| Campo | Regla |
|-------|-------|
| `foto` | `images/equipo/<slug>.jpg` + WebP, 480 px de ancho, 3:4, marco con borde `--borde` (caso límite fondo blanco) |
| `nombre` | h3 |
| `cargo` | texto exacto |
| `biografia` | texto exacto |

| slug | nombre | cargo |
|------|--------|-------|
| `mario-dominguez` | Mario Domínguez | CEO y Fundador |
| `tatiana-lenis` | Tatiana Lenis | Líder Administrativa y de Recursos Humanos |
| `julio-sanchez` | Julio Sánchez | Líder de Bodega y Almacenamiento |
| `laura-avila` | Laura Ávila | Asesora Comercial |

Sin íconos de redes por persona (Assumptions). Fuente: "SECCIÓN DEL EQUIPO" y `assets/equipo/`.

### 9. Foto de la planta (×5, Sobre nosotros)

| archivo | alt propuesto |
|---------|---------------|
| `planta-01` | Bodega de Serviglass Girardot con láminas de vidrio almacenadas en caballetes y puente grúa |
| `planta-02` | Vista general de la planta con mesas de corte y láminas de vidrio |
| `planta-03` | Láminas de vidrio de distintos tonos almacenadas en caballetes |
| `planta-04` | Operarios procesando vidrio en la máquina de pulido |
| `planta-05` | Cajas de vidrio embaladas sobre camión para despacho |

Regla: `loading="lazy"`, `width`/`height` declarados, cuadrícula de 3 columnas (2 en tableta, 1 en móvil). Fuente: "FOTOS DE LA EMPRESA" y `assets/empresa/`.

### 10. Banner de servicios (Servicios)

| Campo | Contenido |
|-------|-----------|
| título (h2) | Soluciones Integrales en Vidrio: Desde la Importación hasta la Instalación |
| subtítulo | Abastecemos al mercado mayorista… acabados de lujo. |

Fuente: "NUESTROS SERVICIOS → 1. BANNER PRINCIPAL".

### 11. Servicio (×6, Servicios)

| Campo | Regla |
|-------|-------|
| `icono` | SVG inline según R5 (el documento sugiere 📦 🛡️ ⚙️ 🚿 ✨ 🤝) |
| `titulo` | texto exacto |
| `descripcion` | texto exacto |
| `puntos` | exactamente 4, `<ul>` con marca de verificación en `--verde-600` |

Orden: Distribución Mayorista e Importación Directa · Vidrios de Seguridad y Alta Especificación · Procesamiento y Acabados de Precisión · Divisiones de Baño y Sistemas Arquitectónicos · Espejería de Lujo y Vidrios Especiales · Asesoría Técnica y Optimización de Materiales. Fuente: "2. TARJETAS DE SERVICIOS".

### 12. Datos de contacto (Contacto y pie)

| Campo | Valor | Presentación |
|-------|-------|--------------|
| dirección | Cra. 9 No. 14-30, Girardot – Cundinamarca | texto + mapa |
| teléfono | 320 381 6643 | `tel:+573203816643` |
| WhatsApp | +57 320 381 6643 | `https://wa.me/573203816643?text=…` |
| horario | Lunes a viernes: 8:00 a. m. a 12:00 p. m. y 2:00 p. m. a 5:30 p. m. · Sábados: 8:15 a. m. a 2:00 p. m. · Domingos y festivos: no hay servicio | lista de 3 líneas |
| correo Gerencia | gerencia@serviglassgirardot.com | `mailto:` |
| correo Área Comercial | jefacomercial@serviglassgirardot.com | `mailto:` |
| correo Subgerencia | subgerencia@serviglassgirardot.com | `mailto:` |
| correo Administración y Contabilidad | asistenteadmonycont@serviglassgirardot.com | `mailto:` |
| Instagram | @serviglassgirardotsas | `https://www.instagram.com/serviglassgirardotsas/` |
| Facebook | Serviglass Girardot S.A.S. | `https://www.facebook.com/search/top?q=Serviglass%20Girardot%20S.A.S.` hasta recibir la URL de la página |
| TikTok | @serviglass.girardot | `https://www.tiktok.com/@serviglass.girardot` |

Fuente: bloque de contacto del documento + Clarifications (horario). Validación: 10 enlaces (1 tel, 1 WhatsApp, 4 mailto, 3 redes, 1 mapa) deben abrir el destino correcto (SC-007).

### 13. Crédito del desarrollador (pie)

| Campo | Valor |
|-------|-------|
| etiqueta | Desarrollado por |
| símbolo | `images/atrio/atrio-simbolo-pie-sobre-blanco.svg` (inline), 22 px, espacio libre = ancho de la T |
| wordmark | "AT" `#9A5F2C` + "RIO" `#1E1726`, Chakra Petch 700, `letter-spacing: 2px` |
| aviso de derechos del sitio | © 2026 Serviglass Girardot S.A.S. Todos los derechos reservados. |

Fuente: `assets/atrio/README.md`.

### 14. Metadatos de página

| Campo | Valor |
|-------|-------|
| `lang` | es |
| `title` | Serviglass Girardot S.A.S. \| Distribuidora de vidrios en Girardot |
| `description` | Distribución mayorista de vidrio de alta especificación, transformación y acabados en Girardot y la región. Medidas exactas, materiales resistentes y entregas oportunas. |
| `og:image` | `images/og-image.jpg` (1200×630) |
| `theme-color` | `#041B58` |
| favicons | `favicon-32.png`, `favicon-192.png`, `apple-touch-icon.png` |

## Relaciones

- Sección 1:N Tarjeta de valor, Aliado, Testimonio (Inicio); Indicador, Miembro, Foto (Sobre nosotros); Servicio (Servicios); Datos de contacto (Contacto).
- Datos de contacto se reutilizan en el pie (redes) y en el botón flotante (WhatsApp): un solo valor de número y una sola función de enlace en el marcado (sin duplicar el texto del mensaje).
- Crédito del desarrollador: una instancia, solo en el pie.

## Reglas globales de validación

1. Ningún texto, nombre, cifra o dato de la plantilla permanece (FR-070): búsqueda de "Glossy", "TemplateMo", "glossytouch", "Design Street", "John Anderson", "Lorem" debe devolver cero resultados en `index.html`.
2. Todo `<img>` tiene `alt` en español y `width`/`height` (FR-071).
3. Textos iguales a la fuente salvo ortotipografía (FR-072).
4. Un único número de WhatsApp en todo el sitio: `573203816643`.
