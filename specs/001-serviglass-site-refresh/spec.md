# Feature Specification: Renovación visual y de contenido del sitio Serviglass Girardot

**Feature Branch**: `001-serviglass-site-refresh`

**Created**: 2026-10-06

**Status**: Draft

**Input**: User description: "Se realizarán ajustes al sitio web basados en el archivo *Información Serviglass* (Descargas), incluyendo: (1) Lineamientos de diseño: fondo blanco y limpio para aportar luminosidad, amplitud y pulcritud alineado a la estética del vidrio; paleta de colores corporativos del logo de Serviglass (verde y azul) para botones, títulos, íconos y elementos interactivos. (2) Integración de WhatsApp directo: botón/ícono flotante (esquina inferior o sección de contacto) enlazado al número corporativo +57 320 381 6643."

> **Nota de idioma**: los encabezados de sección conservan la estructura en inglés de la plantilla Spec Kit (los comandos posteriores dependen de ellos). El contenido está en español, el idioma del cliente y del sitio.

> **Material de referencia**: todo el contenido textual y gráfico proviene del documento del cliente, copiado en [assets/Informacion-Serviglass.docx](assets/Informacion-Serviglass.docx). El texto extraído está en [assets/informacion-serviglass-texto.txt](assets/informacion-serviglass-texto.txt) y las imágenes en [assets/](assets/) (logo nuevo, fotos del equipo, fotos de la planta, logos de aliados y capturas del sitio actual).

> **Marca del desarrollador**: el crédito del pie de página usa la identidad ATRIO, el estudio de software de Andrés Triviño. La guía de marca, el logo en vector y el patrón de pie de página están en [assets/atrio/](assets/atrio/); el resumen está en [assets/atrio/README.md](assets/atrio/README.md).

## Contexto actual

El sitio actual es una plantilla genérica ("Glossy Touch" de TemplateMo) con fondo degradado oscuro (negro, azul marino y violeta), textos de relleno en inglés (equipo ficticio, servicios de diseño web, correo `hello@glossytouch.com`, dirección "123 Design Street") y un formulario que simula el envío. Solo el logo y el nombre en el encabezado corresponden a Serviglass. El pie de página dice "© 2025 Glossy Touch. All rights reserved. Crafted with modern web technologies. Provided by TemplateMo". Consta de cuatro secciones navegables: Inicio, Sobre nosotros, Servicios y Contacto.

## Clarifications

### Session 2026-10-06

- Q: ¿Qué debe hacer el formulario de contacto al enviarse? → A: Se elimina el formulario. Los canales de contacto del sitio son WhatsApp, teléfono, correos y redes sociales.
- Q: ¿Cuál es el horario de atención? → A: Lunes a viernes de 8:00 a. m. a 12:00 p. m. y de 2:00 p. m. a 5:30 p. m.; sábados de 8:15 a. m. a 2:00 p. m.; domingos y festivos no hay servicio.
- Q: ¿Qué cifra lleva el indicador "Toneladas / Metros Distribuidos al Año"? → A: Ninguna. "Toneladas / Metros Distribuidos al Año" y "Milímetros de Espesor en Inventario" son títulos destacados, no mediciones; se muestran sin cifra.

### Session 2026-10-06 (tras la publicación)

- Q: ¿Las secciones deben verse como `#inicio`, `#contacto` en la URL? → A: No. Se usan rutas limpias `/`, `/nosotros`, `/servicios`, `/contacto` (las mismas que tendrá la futura aplicación Laravel); los enlaces antiguos con `#seccion` se corrigen a la ruta limpia.
- Q: ¿El logo de "Vidrios y Aluminios FC (Fabián Cano)" se publica completo? → A: No. Se recorta la franja inferior con el número de WhatsApp del aliado; el original queda intacto en `assets/aliados/`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Identidad visual limpia y corporativa (Priority: P1)

Un visitante (ferretero, constructor, arquitecto o cliente residencial de Girardot y la región) entra al sitio y percibe una página luminosa, con fondo blanco predominante y los colores verde y azul del logo de Serviglass en títulos, botones, íconos y elementos interactivos. La estética transmite la limpieza y transparencia del vidrio y refuerza la marca.

**Why this priority**: Es el primer lineamiento explícito del cliente. El fondo oscuro y violeta actual contradice la identidad de la empresa y la estética del vidrio; mientras no cambie, ningún otro ajuste se percibe como "el sitio de Serviglass".

**Independent Test**: Abrir cada una de las cuatro secciones en escritorio y móvil y verificar que el fondo es blanco, que ningún degradado oscuro o violeta permanece, que títulos, botones, íconos y enlaces activos usan verde o azul corporativo, y que el logo nuevo aparece en el encabezado.

**Acceptance Scenarios**:

1. **Given** cualquier sección del sitio, **When** el visitante la abre, **Then** el fondo de página es blanco (o casi blanco) y las tarjetas se distinguen por bordes y sombras suaves, no por fondos oscuros.
2. **Given** un título, botón, ícono o enlace de navegación activo, **When** se observa su color, **Then** corresponde al verde o al azul del logo nuevo de Serviglass.
3. **Given** cualquier bloque de texto sobre fondo blanco, **When** se mide el contraste, **Then** cumple al menos la relación 4.5:1 (texto normal) o 3:1 (texto grande).
4. **Given** el encabezado del sitio, **When** se carga la página, **Then** muestra el logo nuevo "Serviglass Girardot S.A.S. – Distribuidora de Vidrios" y el ícono de pestaña del navegador usa el mismo emblema.

---

### User Story 2 - Contacto inmediato por WhatsApp (Priority: P2)

Un visitante que quiere cotizar o preguntar por un vidrio toca el botón flotante de WhatsApp, visible en todo momento, y se abre una conversación directa con el número corporativo +57 320 381 6643, sin tener que copiar el número ni llenar formularios.

**Why this priority**: Es el segundo lineamiento explícito del cliente y el canal de conversión principal para su público (compradores mayoristas y de obra que resuelven por chat). Entrega valor inmediato con un cambio pequeño e independiente.

**Independent Test**: Desde cada sección, en móvil y en escritorio, tocar el botón flotante y comprobar que se abre WhatsApp (app o WhatsApp Web) con el chat al número +57 320 381 6643. Repetir con el enlace de WhatsApp de la sección Contacto.

**Acceptance Scenarios**:

1. **Given** cualquier sección y cualquier posición de desplazamiento, **When** el visitante mira la pantalla, **Then** ve un botón flotante con el ícono reconocible de WhatsApp en la esquina inferior derecha.
2. **Given** un visitante en un teléfono con WhatsApp instalado, **When** toca el botón, **Then** se abre la app con un chat nuevo al número +57 320 381 6643 y un mensaje inicial sugerido.
3. **Given** un visitante en escritorio sin la app instalada, **When** hace clic en el botón, **Then** se abre WhatsApp Web en una pestaña nueva con el chat al mismo número y el sitio permanece abierto.
4. **Given** la sección Contacto, **When** el visitante la revisa, **Then** encuentra además un enlace o botón de WhatsApp con el mismo número junto a los demás datos de contacto.
5. **Given** una pantalla de teléfono con la sección Contacto visible, **When** el visitante llega a los datos de contacto o al pie de página, **Then** el botón flotante no cubre ningún enlace ni texto.

---

### User Story 3 - Inicio y Servicios con la propuesta de valor real (Priority: P3)

Un visitante llega al Inicio y entiende en segundos qué hace Serviglass: distribución mayorista de vidrio de alta especificación, transformación y acabados, cumplimiento y respaldo regional. En Servicios encuentra las seis líneas de servicio con sus puntos clave, redactadas como las entregó el cliente.

**Why this priority**: Sustituye el contenido de relleno en inglés (diseño UI/UX, apps móviles, ciberseguridad) que hoy confunde al visitante y desacredita a la empresa. Es el contenido con mayor impacto comercial.

**Independent Test**: Comparar cada título, párrafo y punto de lista de Inicio y Servicios con el documento fuente; no debe quedar ningún texto de la plantilla.

**Acceptance Scenarios**:

1. **Given** la sección Inicio, **When** se carga, **Then** muestra el título "Vidrio de Alta Precisión para Obras que Exigen lo Mejor", el párrafo introductorio del documento y una imagen real de la empresa.
2. **Given** la sección Inicio, **When** el visitante se desplaza, **Then** ve seis tarjetas de valor (Vidrios a la Medida y Alta Resistencia; Transformación y Acabados de Lujo; Cumplimiento y Entregas Oportunas; Garantía de Calidad; Asesoría Técnica y Solución Inmediata; Respaldo y Cobertura Regional), cada una con su texto del documento y el ícono recomendado (regla/escuadra o edificio, diamante, reloj o camión, escudo, audífonos o apretón de manos, pin de mapa).
3. **Given** la sección Servicios, **When** se carga, **Then** muestra el banner "Soluciones Integrales en Vidrio: Desde la Importación hasta la Instalación" con su subtítulo y seis tarjetas de servicio, cada una con ícono, título, descripción y sus cuatro puntos clave del documento.
4. **Given** cualquier texto de Inicio o Servicios, **When** se compara con el documento fuente, **Then** coincide palabra por palabra (salvo correcciones ortotipográficas evidentes, como espacios o puntos duplicados).

---

### User Story 4 - Sobre nosotros: empresa, indicadores, equipo y planta (Priority: P4)

Un cliente potencial que evalúa a Serviglass como proveedor lee quiénes son, ve indicadores de trayectoria, conoce a las cuatro personas del equipo con foto, cargo y biografía, y ve fotos reales de la bodega y la planta de transformación.

**Why this priority**: Construye confianza en un comprador B2B, pero es menos urgente que la propuesta de valor y el canal de contacto.

**Independent Test**: Revisar la sección Sobre nosotros y verificar título y tres párrafos, cuatro indicadores, cuatro miembros del equipo con su foto real y la galería de fotos de la empresa; no debe quedar ningún miembro ficticio ni cifra de la plantilla.

**Acceptance Scenarios**:

1. **Given** la sección Sobre nosotros, **When** se carga, **Then** muestra el título "La Fortaleza de un Gran Distribuidor" y los tres párrafos del documento.
2. **Given** el bloque de indicadores, **When** se observa, **Then** muestra cuatro tarjetas con el mismo estilo: dos con cifra y título ("12 años – Años de Experiencia" y "+100 – Empresas y Constructores Activos") y dos solo con título destacado ("Toneladas / Metros Distribuidos al Año" y "Milímetros de Espesor en Inventario"), sin ninguna cifra inventada ni marcador vacío.
3. **Given** el bloque del equipo, **When** se observa, **Then** muestra exactamente a Mario Domínguez (CEO y Fundador), Tatiana Lenis (Líder Administrativa y de Recursos Humanos), Julio Sánchez (Líder de Bodega y Almacenamiento) y Laura Ávila (Asesora Comercial), cada uno con su foto real, cargo y biografía del documento.
4. **Given** la galería de la empresa, **When** se observa, **Then** muestra las cinco fotos de bodega y planta entregadas por el cliente, con texto alternativo descriptivo.

---

### User Story 5 - Datos de contacto reales (Priority: P5)

Un visitante que prefiere llamar, escribir un correo, visitar la sede o seguir a la empresa en redes encuentra en Contacto la dirección, el teléfono, los cuatro correos por área, las tres redes sociales y un mapa de la ubicación, todos funcionales con un toque.

**Why this priority**: Los datos de contacto actuales son ficticios y en inglés; sin esta corrección se pierden clientes que no usan WhatsApp. Es prioritario pero su alcance es menor que el de las secciones anteriores.

**Independent Test**: En la sección Contacto, tocar cada enlace (teléfono, cuatro correos, tres redes, WhatsApp, mapa) y comprobar que abre el destino correcto.

**Acceptance Scenarios**:

1. **Given** la sección Contacto, **When** se carga, **Then** muestra la dirección "Cra. 9 No. 14-30, Girardot – Cundinamarca", el teléfono "320 381 6643" y los correos de Gerencia, Área Comercial, Subgerencia y Administración y Contabilidad con su etiqueta de área.
2. **Given** el teléfono o un correo, **When** el visitante lo toca en un teléfono, **Then** se abre la app de llamadas o de correo con el dato ya cargado.
3. **Given** los íconos de Instagram, Facebook y TikTok, **When** el visitante los toca, **Then** se abre el perfil correspondiente (@serviglassgirardotsas, Serviglass Girardot S.A.S., @serviglass.girardot) en una pestaña nueva.
4. **Given** el bloque "Encuéntranos", **When** se carga, **Then** muestra un mapa real centrado en la dirección de la sede (o un enlace para abrirla en la app de mapas) en lugar del marcador de posición actual.
5. **Given** la sección Contacto, **When** se observa, **Then** no existe ningún formulario; los únicos canales ofrecidos son WhatsApp, teléfono, correos y redes sociales.
6. **Given** la sección Contacto, **When** se carga, **Then** muestra el horario de atención: lunes a viernes de 8:00 a. m. a 12:00 p. m. y de 2:00 p. m. a 5:30 p. m., sábados de 8:15 a. m. a 2:00 p. m., y la nota "Domingos y festivos no hay servicio".

---

### User Story 6 - Prueba social: aliados y experiencias de éxito (Priority: P6)

Un visitante indeciso ve los logos de cuatro empresas aliadas y lee cuatro testimonios de clientes, lo que refuerza la decisión de contactar a Serviglass.

**Why this priority**: Aporta credibilidad, pero es contenido complementario que no bloquea el uso del sitio.

**Independent Test**: Verificar que existen una franja de logos de aliados con las cuatro imágenes entregadas y un bloque de testimonios con las cuatro citas y sus autores.

**Acceptance Scenarios**:

1. **Given** la sección Inicio, **When** el visitante se desplaza después de las tarjetas de valor, **Then** ve un bloque "Aliados comerciales" con los logos de Vidrios y Aluminios JM Construcciones, Vidrios y Aluminios FC (Fabián Cano), Techos y Aluminios e Ingeniería, Construcciones & Creaciones VG, presentados con la misma altura y sin deformación.
2. **Given** el bloque "Experiencias de éxito", **When** se observa, **Then** muestra las cuatro citas del documento, cada una atribuida a su empresa.

---

### User Story 7 - Crédito del desarrollador con la marca ATRIO (Priority: P7)

Un visitante que llega al final de cualquier sección ve, en lugar del crédito de la plantilla ("Glossy Touch", "Provided by TemplateMo"), el crédito "Desarrollado por ATRIO" con el símbolo y el nombre de ATRIO según su guía de marca, junto al aviso de derechos de Serviglass.

**Why this priority**: Lo pidió expresamente el desarrollador del sitio (Andrés Triviño, fundador de ATRIO) para sustituir la información de la plantilla por su propio concepto de marca. Es un cambio pequeño, acotado al pie de página, que no bloquea el resto.

**Independent Test**: Abrir el pie de página en escritorio y móvil, en las cuatro secciones, y comprobar que muestra el símbolo de ATRIO, el nombre "ATRIO" con la tipografía y colores de la guía y el texto "Desarrollado por", y que no queda ninguna mención a Glossy Touch ni a TemplateMo.

**Acceptance Scenarios**:

1. **Given** el pie de página de cualquier sección, **When** se observa, **Then** muestra el texto "Desarrollado por" seguido del símbolo de ATRIO (placa octogonal con las iniciales A y T en degradado Oro, Cobre, Ciruela e Índigo) y el nombre "ATRIO" en Chakra Petch con "AT" en acento y "RIO" en Noche, tal como define la guía para fondos blancos.
2. **Given** el pie de página, **When** se observa, **Then** muestra el aviso "© 2026 Serviglass Girardot S.A.S. Todos los derechos reservados." y no aparece "Glossy Touch", "TemplateMo" ni "Crafted with modern web technologies".
3. **Given** el símbolo de ATRIO en el pie de página, **When** se mide su entorno, **Then** tiene a su alrededor un espacio libre al menos igual al ancho de la T del símbolo y no tiene ningún degradado detrás de texto.
4. **Given** un teléfono de 360 px de ancho, **When** se ve el pie de página, **Then** el crédito de ATRIO y el aviso de derechos se apilan sin cortarse ni solaparse con el botón flotante de WhatsApp.

---

### Edge Cases

- **Escritorio sin WhatsApp instalado**: el botón debe abrir WhatsApp Web en una pestaña nueva; el sitio no debe quedar en blanco ni mostrar error.
- **Pantallas pequeñas (360 px de ancho)**: el botón flotante no debe cubrir los enlaces de contacto, los enlaces del pie de página ni el último elemento de cada sección; las cuadrículas de seis tarjetas se apilan en una columna sin desplazamiento horizontal.
- **Fotos del equipo con fondo blanco sobre página blanca**: cada foto necesita un marco, fondo o sombra sutil para no "flotar" sin límites.
- **Logos de aliados con proporciones distintas** (cuadrados y apaisados): deben verse alineados a la misma altura, sin recortes ni deformación.
- **Imagen que no carga**: debe existir texto alternativo descriptivo y el diseño no debe romperse.
- **Indicadores sin cifra**: los dos indicadores que son solo título no deben mostrar un número inventado ni un marcador como "N/A"; llevan un ícono en el lugar de la cifra para alinearse visualmente con los dos que sí la tienen.
- **Testimonios duplicados**: el documento fuente trae la misma cita para "Vidrios y Aluminios JM Construcciones" y "Techos y Aluminios"; se publican tal como se entregaron y se avisa al cliente para que confirme o corrija.
- **Animaciones**: los efectos decorativos de la plantilla (formas flotantes oscuras, paralaje con el mouse, ondas al hacer clic) no funcionan sobre fondo blanco y pueden distraer; deben eliminarse o reducirse a transiciones sutiles que no afecten la legibilidad.
- **Visitantes con preferencia de movimiento reducido**: ninguna animación esencial para leer o navegar.
- **Crédito ATRIO sobre fondo blanco**: el símbolo tiene calados del color del fondo; sobre el pie de página blanco debe usarse la versión con calados blancos (sin el punto de luz), no la versión para fondo Noche, o las iniciales se verían en color equivocado.
- **Tipografía Chakra Petch no disponible**: si la fuente de ATRIO no carga, el nombre "ATRIO" debe seguir legible en una fuente de respaldo sin romper la alineación del pie de página.

## Requirements *(mandatory)*

### Functional Requirements

**Identidad visual**

- **FR-001**: Todas las secciones del sitio DEBEN usar fondo blanco (o casi blanco) predominante, eliminando el degradado oscuro y violeta actual y las formas flotantes de fondo.
- **FR-002**: Títulos, botones, íconos, enlaces, estado activo de la navegación y demás elementos interactivos DEBEN usar la paleta corporativa derivada del logo nuevo: verde y azul de Serviglass. Los valores exactos se tomarán del archivo del logo nuevo durante la planeación; como referencia visual, el logo contiene un verde brillante (aprox. `#43B02A`), un azul (aprox. `#1E6FD0`) y un azul marino usado en el texto "GIRARDOT S.A.S." (aprox. `#1B3A6B`).
- **FR-003**: El texto de lectura DEBE ser oscuro sobre fondo claro y cumplir un contraste mínimo de 4.5:1 (texto normal) y 3:1 (texto grande e íconos informativos).
- **FR-004**: El logo nuevo ("Serviglass Girardot S.A.S. – Distribuidora de Vidrios", archivo `assets/logo-nuevo-serviglass.jpeg`) DEBE reemplazar al logo actual en el encabezado y DEBE usarse como ícono de pestaña del navegador.
- **FR-005**: Las tarjetas y paneles DEBEN conservar una estética de "vidrio" limpia (bordes finos, sombras suaves, ligera translucidez opcional) coherente con el fondo blanco; los efectos que solo funcionan sobre fondo oscuro (sombras de texto blancas, brillos blancos) DEBEN eliminarse.
- **FR-006**: Toda la interfaz DEBE estar en español: textos, navegación, textos alternativos de imágenes, título de la pestaña e idioma declarado de la página.
- **FR-007**: El título de la pestaña y la descripción de la página DEBEN identificar a la empresa y su actividad (por ejemplo "Serviglass Girardot S.A.S. | Distribuidora de vidrios en Girardot").

**WhatsApp directo**

- **FR-010**: El sitio DEBE mostrar un botón flotante de WhatsApp, fijo en la esquina inferior derecha, visible en las cuatro secciones y en cualquier posición de desplazamiento.
- **FR-011**: El botón DEBE abrir una conversación directa con el número +57 320 381 6643 (app en móvil, WhatsApp Web en escritorio) en una pestaña nueva, con un mensaje inicial sugerido (por ejemplo "Hola Serviglass Girardot, quiero información sobre vidrios").
- **FR-012**: La sección Contacto DEBE incluir un enlace o botón de WhatsApp adicional con el mismo número.
- **FR-013**: El botón flotante DEBE usar el ícono reconocible de WhatsApp, tener un nombre accesible (por ejemplo "Escríbenos por WhatsApp") y no cubrir los enlaces de contacto ni los del pie de página en pantallas de teléfono.

**Inicio**

- **FR-020**: La sección Inicio DEBE mostrar el título principal, el párrafo introductorio y una imagen real de la empresa (una de las fotos de planta entregadas) en lugar de la imagen genérica actual.
- **FR-021**: La sección Inicio DEBE mostrar las seis tarjetas de valor del documento, cada una con su título, su párrafo y un ícono acorde a la recomendación del cliente (regla/escuadra o edificio; diamante o herramienta de pulido; reloj de verificación o camión; escudo; audífonos de soporte o apretón de manos; pin de ubicación).
- **FR-022**: La sección Inicio DEBE incluir al menos un llamado a la acción principal que lleve a WhatsApp y uno secundario que lleve a Servicios.
- **FR-023**: La sección Inicio DEBE incluir, después de las tarjetas de valor, el bloque "Aliados comerciales" con los cuatro logos entregados y el bloque "Experiencias de éxito" con los cuatro testimonios y su autor.

**Sobre nosotros**

- **FR-030**: La sección DEBE mostrar el título "La Fortaleza de un Gran Distribuidor" y los tres párrafos del documento.
- **FR-031**: La sección DEBE mostrar cuatro indicadores en tarjetas del mismo estilo, en este orden: "12 años / Años de Experiencia" (con cifra); "Toneladas / Metros Distribuidos al Año" (solo título, con ícono en lugar de cifra); "+100 / Empresas y Constructores Activos" (con cifra); "Milímetros de Espesor en Inventario" (solo título, con ícono en lugar de cifra). Los dos indicadores sin cifra NO DEBEN mostrar números inventados ni marcadores vacíos.
- **FR-032**: La sección DEBE mostrar exactamente los cuatro miembros del equipo con su foto real (archivos en `assets/equipo/`), nombre, cargo y biografía del documento; los seis miembros ficticios de la plantilla y sus íconos de redes DEBEN eliminarse.
- **FR-033**: La sección DEBE incluir una galería "Nuestra planta" (o nombre equivalente) con las cinco fotos de bodega y planta entregadas (archivos en `assets/empresa/`).

**Servicios**

- **FR-040**: La sección DEBE mostrar el banner con el título "Soluciones Integrales en Vidrio: Desde la Importación hasta la Instalación" y su subtítulo.
- **FR-041**: La sección DEBE mostrar las seis tarjetas de servicio del documento (Distribución Mayorista e Importación Directa; Vidrios de Seguridad y Alta Especificación; Procesamiento y Acabados de Precisión; Divisiones de Baño y Sistemas Arquitectónicos; Espejería de Lujo y Vidrios Especiales; Asesoría Técnica y Optimización de Materiales), cada una con ícono, descripción y sus cuatro puntos clave en forma de lista con marca de verificación.

**Contacto**

- **FR-050**: La sección DEBE mostrar la dirección "Cra. 9 No. 14-30, Girardot – Cundinamarca", el teléfono "320 381 6643" (con enlace de llamada) y los cuatro correos con su etiqueta de área: Gerencia (gerencia@serviglassgirardot.com), Área Comercial (jefacomercial@serviglassgirardot.com), Subgerencia (subgerencia@serviglassgirardot.com) y Administración y Contabilidad (asistenteadmonycont@serviglassgirardot.com), cada uno con enlace de correo.
- **FR-051**: La sección DEBE mostrar enlaces a Instagram (@serviglassgirardotsas), Facebook (Serviglass Girardot S.A.S.) y TikTok (@serviglass.girardot) con íconos reconocibles, que abren en pestaña nueva.
- **FR-052**: El bloque "Encuéntranos" DEBE mostrar un mapa real centrado en la dirección de la sede, con un enlace para abrir la ubicación en la app de mapas del visitante; el marcador de posición actual DEBE eliminarse.
- **FR-053**: El formulario de contacto de la plantilla y su página de envío DEBEN eliminarse; la sección Contacto NO DEBE ofrecer ningún formulario. Los canales de contacto del sitio son WhatsApp, teléfono, correos y redes sociales.
- **FR-054**: La sección DEBE mostrar el horario de atención: lunes a viernes de 8:00 a. m. a 12:00 p. m. y de 2:00 p. m. a 5:30 p. m.; sábados de 8:15 a. m. a 2:00 p. m.; domingos y festivos no hay servicio.

**Pie de página y navegación**

- **FR-060**: El pie de página DEBE mostrar "© 2026 Serviglass Girardot S.A.S. Todos los derechos reservados.", enlaces a las cuatro secciones y los íconos de redes sociales; la línea actual "© 2025 Glossy Touch. All rights reserved. Crafted with modern web technologies. Provided by TemplateMo" y los enlaces de relleno sin destino (Privacy Policy, Terms of Service, XML Sitemap) DEBEN eliminarse.
- **FR-063**: El pie de página DEBE incluir el crédito del desarrollador siguiendo el patrón "Pie de página dentro de tus aplicaciones" de la guía de marca ATRIO (ver `assets/atrio/README.md`): el texto "Desarrollado por", el símbolo de ATRIO en su versión para fondo blanco (`assets/atrio/svg/atrio-simbolo-pie-sobre-blanco.svg`) y el nombre "ATRIO" en la tipografía Chakra Petch con "AT" en el acento para fondos claros y "RIO" en Noche. El símbolo DEBE conservar un espacio libre igual al ancho de su T y NUNCA llevar degradado detrás de texto.
- **FR-064**: El crédito de ATRIO DEBE verse en las cuatro secciones (el pie de página es único), en escritorio y en teléfono, y ser discreto frente a la marca Serviglass: menor tamaño que el logo de Serviglass y sin competir con los colores corporativos verde y azul en el resto de la página.
- **FR-061**: La navegación DEBE conservar las cuatro secciones actuales (Inicio, Sobre nosotros, Servicios, Contacto) y seguir funcionando en teléfono y escritorio.
- **FR-062**: El sitio DEBE verse y usarse correctamente en anchos de pantalla desde 360 px hasta 1440 px sin desplazamiento horizontal.

**Contenido y activos**

- **FR-070**: Ningún texto, nombre, cifra, correo, dirección o imagen de relleno de la plantilla DEBE permanecer visible en el sitio.
- **FR-071**: Todas las imágenes (logo, fotos del equipo, fotos de planta, logos de aliados, imagen de Inicio) DEBEN tener texto alternativo descriptivo en español y un peso optimizado para web.
- **FR-072**: Los textos publicados DEBEN coincidir con el documento fuente; solo se admiten correcciones ortotipográficas evidentes (espacios dobles, puntos duplicados, mayúsculas).

### Key Entities *(include if feature involves data)*

- **Tarjeta de valor**: título, párrafo e ícono; seis en Inicio.
- **Servicio**: ícono, título, descripción y cuatro puntos clave; seis en Servicios.
- **Indicador**: título, cifra opcional e ícono; cuatro en Sobre nosotros, dos con cifra y dos solo con título.
- **Miembro del equipo**: foto, nombre, cargo y biografía; cuatro personas.
- **Foto de la empresa**: imagen y texto alternativo; cinco fotos de bodega y planta.
- **Aliado comercial**: nombre y logo; cuatro empresas.
- **Testimonio**: cita y empresa autora; cuatro testimonios.
- **Datos de contacto**: dirección, teléfono, número de WhatsApp, cuatro correos con área, tres redes sociales y horario de atención (lunes a viernes en dos jornadas, sábados en una, sin servicio domingos y festivos).
- **Crédito del desarrollador (ATRIO)**: texto "Desarrollado por", símbolo, nombre con tipografía y colores de la guía; una sola instancia en el pie de página.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Desde cualquiera de las cuatro secciones y cualquier posición de desplazamiento, un visitante llega a un chat de WhatsApp con el número +57 320 381 6643 con un solo toque o clic, tanto en teléfono como en escritorio.
- **SC-002**: El 100 % de los textos visibles proviene del documento *Información Serviglass*; una revisión de las cuatro secciones no encuentra ningún texto, nombre, cifra o dato de contacto de la plantilla ("Glossy Touch", "John Anderson", "hello@glossytouch.com", "123 Design Street", etc.) ni textos en inglés.
- **SC-003**: Las cuatro secciones tienen fondo blanco y el 100 % de los bloques de texto cumple el contraste mínimo 4.5:1 (texto normal) o 3:1 (texto grande).
- **SC-004**: Todos los botones, títulos, íconos y enlaces activos usan verde o azul corporativo; no queda ningún degradado violeta o fondo oscuro de la plantilla.
- **SC-005**: El sitio se muestra sin desplazamiento horizontal en anchos de 360, 768, 1024 y 1440 px, y el botón flotante nunca cubre los enlaces de contacto ni los del pie de página.
- **SC-006**: Los 15 activos gráficos entregados (1 logo, 4 fotos del equipo, 5 fotos de planta, 4 logos de aliados, 1 imagen de Inicio tomada de las fotos de planta) se muestran en el sitio con texto alternativo, y la página carga en menos de 3 segundos en una conexión móvil 4G típica.
- **SC-007**: Los 9 enlaces de contacto (1 teléfono, 4 correos, 3 redes sociales, 1 WhatsApp de la sección Contacto) y el mapa abren el destino correcto en una verificación manual.
- **SC-008**: Serviglass puede revisar el sitio y aprobarlo en una sola ronda sin encontrar textos faltantes, marcadores de posición ni contenido de la plantilla.
- **SC-009**: El pie de página muestra el crédito "Desarrollado por ATRIO" con símbolo y nombre conforme a la guía de marca en el 100 % de las secciones y anchos de pantalla verificados, y una búsqueda de "Glossy Touch" o "TemplateMo" en el sitio publicado no devuelve ningún resultado visible.

## Assumptions

- **Estructura**: el sitio sigue siendo una sola página con cuatro secciones navegables (Inicio, Sobre nosotros, Servicios, Contacto); no se crean páginas nuevas ni se cambia el esquema de navegación.
- **Fuente de verdad del contenido**: el documento *Información Serviglass* (copiado en `assets/`) manda sobre cualquier texto existente; los textos se publican tal cual, con correcciones ortotipográficas mínimas.
- **Paleta**: los colores se toman del logo nuevo (no del logo actual del sitio, que tiene tonos distintos); los valores exactos se muestrean del archivo durante la planeación.
- **Llamados a la acción de Inicio**: el documento no los define; se asume "Cotiza por WhatsApp" (principal) y "Conoce nuestros servicios" (secundario).
- **Imagen de Inicio**: se usa una de las cinco fotos de planta entregadas; las cinco se muestran en la galería de Sobre nosotros.
- **Ubicación de aliados y testimonios**: el documento no indica dónde van; se asume en Inicio, después de las tarjetas de valor, para reforzar la propuesta de valor con prueba social.
- **Indicadores sin cifra**: por indicación del desarrollador, "Toneladas / Metros Distribuidos al Año" y "Milímetros de Espesor en Inventario" son títulos destacados, no mediciones; se publican sin cifra. Si el cliente entrega cifras más adelante (por ejemplo el rango "2 a 19 mm" de espesores que sí aparece en el documento), se añaden sin cambiar el diseño.
- **Testimonios**: la primera y la tercera cita son idénticas en el documento fuente; se publican tal como se entregaron y se notifica al cliente para que confirme o corrija.
- **Equipo**: el documento no trae contactos individuales; se eliminan los íconos de redes por persona.
- **Redes sociales**: los enlaces de Instagram y TikTok se derivan de los usuarios indicados; la dirección exacta de la página de Facebook no está en el documento y se solicitará al cliente (mientras tanto el enlace lleva a la búsqueda del nombre de la página).
- **Mapa**: se incrusta un mapa público centrado en "Cra. 9 No. 14-30, Girardot, Cundinamarca" con enlace para abrir en la app de mapas.
- **Número de WhatsApp**: el "3203816643" del documento y el "+57 320 381 6643" de la solicitud son el mismo número; se usa el formato internacional.
- **Animaciones**: se eliminan las formas flotantes, el paralaje con el mouse y la onda al hacer clic; se conservan transiciones sutiles al pasar el cursor.
- **Crédito del desarrollador**: por instrucción expresa del desarrollador, la línea de crédito de la plantilla se sustituye por el concepto de marca ATRIO. Se usa el patrón de pie de página de la guía ATRIO con la variante para fondo blanco. Como el sitio pertenece a Serviglass, el aviso de derechos se asigna a Serviglass Girardot S.A.S. (la guía ATRIO usa "© 2026 ATRIO" para los sistemas propios de ATRIO); si el desarrollador prefiere el aviso de ATRIO, se cambia solo ese texto. El crédito no lleva enlace porque la guía no define sitio web de ATRIO; se añadirá cuando exista.
- **Licencia de la plantilla**: el sitio se construyó sobre la plantilla gratuita "Glossy Touch" (TemplateMo 592), cuya licencia pide conservar el enlace de crédito salvo que se adquiera la licencia de retiro. Retirarlo es decisión del desarrollador; esta especificación la registra para que quede consciente.
- **Tipografía de ATRIO**: Chakra Petch es gratuita en Google Fonts; se asume que puede cargarse en el sitio solo para el nombre "ATRIO" del pie de página, sin cambiar la tipografía del resto del sitio.
- **Alojamiento**: no se conoce el servidor donde se publicará el sitio. Al eliminarse el formulario, el sitio no necesita envío de correo desde el servidor y puede publicarse como sitio estático en cualquier alojamiento.
