# Specification Quality Checklist: Renovación visual y de contenido del sitio Serviglass Girardot

**Purpose**: Validate specification completeness and quality before proceeding to planning
**Created**: 2026-10-06
**Feature**: [spec.md](../spec.md)

## Content Quality

- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

## Requirement Completeness

- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Success criteria are technology-agnostic (no implementation details)
- [x] All acceptance scenarios are defined
- [x] Edge cases are identified
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

## Feature Readiness

- [x] All functional requirements have clear acceptance criteria
- [x] User scenarios cover primary flows
- [x] Feature meets measurable outcomes defined in Success Criteria
- [x] No implementation details leak into specification

## Notes

- Items marked incomplete require spec updates before `/speckit-clarify` or `/speckit-plan`
- Sesión de aclaraciones 2026-10-06: se resolvieron el formulario de contacto (se elimina), el horario de atención (FR-054) y los indicadores sin cifra (FR-031: son títulos destacados, no mediciones). Ver sección Clarifications del spec.
- No quedan marcadores [NEEDS CLARIFICATION]. La especificación está lista para `/speckit-plan`.

## Resultado de la validación de la implementación (2026-10-06)

Ejecutada según `quickstart.md` con Chrome headless (`tools/verify-site.mjs`), `html-validate`, `tools/contrast-check.mjs` y Lighthouse.

| Verificación | Resultado |
|--------------|-----------|
| `html-validate index.html` | 0 errores |
| `tools/contrast-check.mjs` | 19/19 pares cumplen WCAG AA |
| Lighthouse móvil (informe: `lighthouse-2026-10-06.html`) | Rendimiento 100 · Accesibilidad 100 · Buenas prácticas 100 · SEO 100 · LCP 1,6 s · CLS 0 · 178 KiB en la carga inicial |
| Desbordamiento horizontal en 360 / 768 / 1024 / 1440 px | ninguno en las cuatro secciones |
| Imágenes | 31 archivos, 960 KB en total; todas con `alt`, `width` y `height`; carga diferida salvo logo y hero |
| Botón flotante de WhatsApp | visible en todas las secciones; no solapa enlaces ni el crédito del pie al final de la página |
| Navegación por hash | `#servicios` abre Servicios; botón atrás vuelve; foco en el título; primer Tab = "Saltar al contenido" |
| Restos de plantilla (Glossy, TemplateMo, etc.) | 0 coincidencias en HTML, CSS y JS |
| Formulario de contacto y `contacto.php` | eliminados |
| Fidelidad de textos (`assets/informacion-serviglass-texto.txt`) | 81/81 bloques presentes; solo cambia el formato de dirección y teléfono definido en FR-050 |
| Crédito ATRIO con Google Fonts bloqueado | legible en negrita con la fuente de respaldo; maquetación intacta |

## Pendientes para el cliente (no bloquean la publicación)

- Versión vectorial o en alta resolución del logo nuevo (el actual es un JPEG de 561×374 px; sirve para encabezado y favicon).
- URL exacta de la página de Facebook (hoy el enlace lleva a la búsqueda "Serviglass Girardot S.A.S.").
- Confirmar los testimonios: las citas de "Vidrios y Aluminios JM Construcciones" y "Techos y Aluminios" son idénticas en el documento.
- Cifras para los indicadores "Toneladas / Metros Distribuidos al Año" y "Milímetros de Espesor en Inventario", si desean publicarlas (hoy se muestran como títulos con ícono).
- Dominio de publicación: convertir `og:image` a URL absoluta y, si se desea, añadir `canonical` y datos estructurados `LocalBusiness`.
- Los valores aproximados de color en FR-002 son referencia visual, no una decisión de implementación; los valores definitivos se muestrean del logo nuevo en la planeación.
- Dos puntos para confirmar, documentados en Assumptions (no bloquean): testimonios duplicados en el documento fuente (cliente) y titular del aviso de derechos junto al crédito ATRIO (desarrollador).
- El crédito del desarrollador (User Story 7, FR-063, FR-064, SC-009) se basa en la guía de marca ATRIO copiada en `assets/atrio/`; los nombres de archivo citados en FR-063 identifican el activo, no una decisión de implementación.
