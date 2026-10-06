# Quickstart: servir, validar y probar el sitio

**Feature**: `001-serviglass-site-refresh` · **Date**: 2026-10-06

Guía de validación de extremo a extremo. Las reglas de marcado y enlaces están en [contracts/ui-contract.md](contracts/ui-contract.md); los colores en [contracts/design-tokens.md](contracts/design-tokens.md); el contenido esperado en [data-model.md](data-model.md).

## Prerrequisitos

- Windows 11 con Node.js 24 (instalado vía nvm4w) y npm 11. No se necesita Python.
- Google Chrome o Edge (para Lighthouse y la emulación de dispositivos).
- Un teléfono con WhatsApp para la prueba real del botón (opcional; en escritorio se verifica WhatsApp Web).

## 1. Preparar imágenes (una sola vez, o cuando cambien los activos)

```powershell
cd tools
npm install
node optimize-images.mjs
cd ..
```

Resultado esperado: `images/` contiene `logo-serviglass.jpg`, `favicon-32.png`, `favicon-192.png`, `apple-touch-icon.png`, `og-image.jpg`, `equipo/` (4 × jpg+webp), `planta/` (5 × jpg+webp), `aliados/` (4 × jpg+webp). El script imprime una tabla con el peso de cada salida; la suma de `images/` debe quedar por debajo de 1 MB.

## 2. Servir el sitio localmente

```powershell
npx -y serve -s -l 8080 .
```

Abrir `http://localhost:8080/`. La opción `-s` hace que `/nosotros`, `/servicios` y `/contacto` devuelvan `index.html`, igual que el `.htaccess` en el hosting. Alternativa sin servidor: abrir `index.html` directamente; en ese caso la navegación usa `#seccion` porque el archivo no admite rutas.

## 3. Validaciones automáticas

```powershell
npx -y html-validate index.html
node tools/contrast-check.mjs
```

Esperado: `html-validate` sin errores; `contrast-check` imprime la tabla de pares con PASS en todos y termina con código 0.

Verificación en navegador headless (cubre los pasos 4.5, 5 y las comprobaciones de imágenes, desbordamiento, botón flotante y navegación de las secciones 4.1 a 4.8; deja capturas de cada sección en `tools/shots/`):

```powershell
cd tools
npm install
node verify-site.mjs
cd ..
```

Esperado: "Todo en orden" y código de salida 0. Usa Chrome o Edge instalados (o la ruta en la variable `CHROME_PATH`).

Lighthouse (Chrome DevTools → Lighthouse → Móvil → Rendimiento + Accesibilidad + Buenas prácticas + SEO): Accesibilidad ≥ 95, Rendimiento ≥ 90, Buenas prácticas ≥ 90, SEO ≥ 90. Guardar el informe HTML en `specs/001-serviglass-site-refresh/checklists/lighthouse-<fecha>.html` (opcional).

Búsqueda de restos de plantilla (debe devolver 0 líneas):

```powershell
Select-String -Path index.html,styles.css,scripts.js -Pattern "Glossy|TemplateMo|glossytouch|Design Street|John Anderson|templatemo" 
```

## 4. Pruebas manuales por historia de usuario

Ejecutar en escritorio (1440 px) y en la emulación móvil de DevTools (360 × 740, "Moto G Power" o similar). Repetir el paso 4.5 también en 768 y 1024 px.

### 4.1 US1 · Identidad visual (P1)

1. Abrir `#inicio`, `#nosotros`, `#servicios`, `#contacto`: el fondo de página es blanco en todas; no hay degradado oscuro ni formas flotantes.
2. Títulos en azul marino; botón "Cotiza por WhatsApp" verde con texto blanco; enlace activo del menú resaltado en azul.
3. El encabezado muestra el logo nuevo ("Serviglass Girardot S.A.S. – Distribuidora de vidrios") y la pestaña del navegador muestra el emblema como favicon.
4. DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce": al pasar el mouse por tarjetas no hay transiciones.

### 4.2 US2 · WhatsApp (P2)

1. En cada sección, con y sin desplazamiento, el botón flotante verde está en la esquina inferior derecha.
2. Clic en el botón (escritorio): se abre una pestaña nueva en `web.whatsapp.com` o `wa.me` con el número +57 320 381 6643 y el mensaje "Hola Serviglass Girardot, quiero información sobre vidrios." prellenado; la pestaña del sitio sigue abierta.
3. En un teléfono real: tocar el botón abre la app de WhatsApp con el chat al número.
4. En `#contacto` hay un botón "Escríbenos por WhatsApp" con el mismo destino.
5. Móvil 360 px: desplazarse hasta el final de `#contacto`; el botón flotante no cubre ningún enlace de contacto ni del pie (el pie tiene espacio inferior).
6. Teclado: con Tab se alcanza el botón flotante, muestra anillo de foco y Enter lo activa.

### 4.3 US3 · Inicio y Servicios (P3)

1. `#inicio`: título "Vidrio de Alta Precisión para Obras que Exigen lo Mejor", párrafo del documento, foto de la planta, dos CTA.
2. Seis tarjetas de valor con ícono SVG y los títulos en el orden de `data-model.md` §3; comparar un párrafo al azar con `assets/informacion-serviglass-texto.txt`.
3. `#servicios`: banner "Soluciones Integrales en Vidrio: Desde la Importación hasta la Instalación" y seis tarjetas, cada una con exactamente cuatro puntos con marca de verificación verde.
4. Ningún texto en inglés en ambas secciones.

### 4.4 US4 · Sobre nosotros (P4)

1. Título "La Fortaleza de un Gran Distribuidor" y tres párrafos.
2. Cuatro indicadores con el mismo estilo: "12 años / Años de Experiencia", "Toneladas / Metros Distribuidos al Año" (ícono, sin cifra), "+100 / Empresas y Constructores Activos", "Milímetros de Espesor en Inventario" (ícono, sin cifra). No aparece "N/A" ni guiones.
3. Equipo: Mario Domínguez, Tatiana Lenis, Julio Sánchez y Laura Ávila con su foto real, cargo y biografía; sin íconos de redes.
4. Galería con cinco fotos de la planta; DevTools → Network muestra que se cargan solo al llegar a la sección (`loading="lazy"`).

### 4.5 Responsive (SC-005)

En 360, 768, 1024 y 1440 px: sin barra de desplazamiento horizontal (`document.documentElement.scrollWidth === window.innerWidth` en la consola); cuadrículas de 1 / 2 / 3 columnas según `design-tokens.md` §4; menú legible en dos filas en 360 px.

### 4.6 US5 · Contacto (P5)

Verificar los 10 enlaces (tabla en `ui-contract.md` §4):

| # | Elemento | Resultado esperado |
|---|----------|--------------------|
| 1 | Teléfono 320 381 6643 | abre marcador (móvil) / protocolo `tel:` |
| 2 | Escríbenos por WhatsApp | chat con +57 320 381 6643 |
| 3–6 | Gerencia, Área Comercial, Subgerencia, Administración y Contabilidad | cliente de correo con la dirección correcta |
| 7 | Instagram | perfil @serviglassgirardotsas en pestaña nueva |
| 8 | Facebook | página/búsqueda "Serviglass Girardot S.A.S." en pestaña nueva |
| 9 | TikTok | perfil @serviglass.girardot en pestaña nueva |
| 10 | Abrir en Google Maps | mapa centrado en Cra. 9 No. 14-30, Girardot |

Además: el mapa incrustado muestra Girardot; no existe formulario; el horario muestra las tres líneas (lunes a viernes dos jornadas, sábados, domingos y festivos sin servicio).

### 4.7 US6 · Aliados y testimonios (P6)

1. En `#inicio`, tras las tarjetas de valor: franja "Aliados comerciales" con cuatro logos a la misma altura, sin deformación (comparar proporción con los originales en `assets/aliados/`).
2. Bloque "Experiencias de éxito" con cuatro citas y sus empresas.

### 4.8 US7 · Crédito ATRIO (P7)

1. Pie de página: "© 2026 Serviglass Girardot S.A.S. Todos los derechos reservados." y "Desarrollado por" + símbolo ATRIO + "ATRIO" (AT en cobre, RIO en Noche, tipografía Chakra Petch).
2. DevTools → Network → bloquear `fonts.googleapis.com` y recargar: "ATRIO" sigue legible en negrita con la fuente de respaldo y el pie no se desalinea.
3. Zoom 300 % sobre el símbolo: los calados del monograma son blancos (versión para fondo blanco) y hay espacio libre alrededor.
4. Búsqueda del paso 3 (restos de plantilla) devuelve 0 resultados.

## 5. Navegación por rutas (contrato §2)

1. Abrir `http://localhost:8080/servicios`: carga directamente en Servicios con "Servicios" resaltado en el menú y el título de la pestaña "Servicios | Serviglass Girardot S.A.S.".
2. Clic en "Contacto": la URL pasa a `/contacto` sin recargar; botón atrás del navegador: vuelve a `/servicios`.
3. Clic en "Conoce nuestros servicios" en el hero: va a `/servicios` y el foco queda en su título (visible con Tab).
4. Abrir `http://localhost:8080/#servicios` (enlace antiguo): muestra Servicios y la URL se corrige a `/servicios`.

## 6. Criterios de salida

- Pasos 3 a 5 sin fallos.
- `images/` < 1 MB y sin archivos de la plantilla (`welcome.png`, `pexels-*`, `rain-*`, `templatemo-*`).
- `contacto.php` no existe.
- Checklist `checklists/requirements.md` sigue en verde y se añade el informe de Lighthouse si se generó.
