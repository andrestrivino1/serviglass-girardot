// Serviglass Girardot — navegación entre secciones con rutas limpias: /, /nosotros, /servicios, /contacto.
// El servidor debe devolver index.html para esas rutas (.htaccess en Apache; `npx serve -s` en local).
// Si no se puede cambiar la ruta (por ejemplo al abrir el archivo directamente), se usa #seccion.
// Contrato: specs/001-serviglass-site-refresh/contracts/ui-contract.md §2
(function () {
  'use strict';

  var SECTION_IDS = ['inicio', 'nosotros', 'servicios', 'contacto'];
  var RUTAS = { '/': 'inicio', '/inicio': 'inicio', '/nosotros': 'nosotros', '/servicios': 'servicios', '/contacto': 'contacto' };
  var TITULOS = {
    inicio: 'Serviglass Girardot S.A.S. | Distribuidora de vidrios en Girardot',
    nosotros: 'Sobre nosotros | Serviglass Girardot S.A.S.',
    servicios: 'Servicios | Serviglass Girardot S.A.S.',
    contacto: 'Contacto | Serviglass Girardot S.A.S.'
  };
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('nav[aria-label="Principal"] a[href]'));
  var usarHash = window.location.protocol === 'file:';

  function normalizarRuta(pathname) {
    var p = pathname.replace(/\/index\.html$/, '/').replace(/\/+$/, '');
    return p === '' ? '/' : p;
  }

  function idDesdeRuta(pathname) {
    return RUTAS[normalizarRuta(pathname)] || null;
  }

  function idDesdeHash(hash) {
    var id = (hash || '').replace(/^#/, '');
    return SECTION_IDS.indexOf(id) !== -1 ? id : null;
  }

  function idDesdeEnlace(href) {
    if (/^#/.test(href)) return idDesdeHash(href);
    var url;
    try { url = new URL(href, window.location.href); } catch (e) { return null; }
    if (url.origin !== window.location.origin) return null;
    return idDesdeRuta(url.pathname);
  }

  function rutaDe(id) {
    return id === 'inicio' ? '/' : '/' + id;
  }

  function idActual() {
    // Un #seccion (enlace antiguo) tiene prioridad sobre la ruta "/" para no perder el destino.
    return idDesdeHash(window.location.hash) || (usarHash ? null : idDesdeRuta(window.location.pathname)) || 'inicio';
  }

  function showSection(id, options) {
    var focus = !options || options.focus !== false;

    SECTION_IDS.forEach(function (key) {
      var el = document.getElementById(key);
      if (el) el.classList.toggle('is-active', key === id);
    });

    navLinks.forEach(function (link) {
      if (idDesdeEnlace(link.getAttribute('href')) === id) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    document.title = TITULOS[id] || TITULOS.inicio;

    var heading = document.getElementById(id + '-titulo');
    if (focus && heading) heading.focus({ preventScroll: true });
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }

  function irA(id) {
    if (usarHash) {
      if (idDesdeHash(window.location.hash) !== id) {
        window.location.hash = '#' + id; // dispara hashchange → showSection
      } else {
        showSection(id);
      }
      return;
    }
    if (idDesdeRuta(window.location.pathname) !== id || window.location.hash) {
      try {
        window.history.pushState(null, '', rutaDe(id));
      } catch (e) {
        usarHash = true;
        window.location.hash = '#' + id;
        return;
      }
    }
    showSection(id);
  }

  // Enlaces internos a secciones (menú, CTA, pie): sin recarga, con la ruta en la URL.
  document.addEventListener('click', function (event) {
    var link = event.target.closest ? event.target.closest('a[href]') : null;
    if (!link || link.target === '_blank') return;
    var id = idDesdeEnlace(link.getAttribute('href'));
    if (!id) return;
    event.preventDefault();
    irA(id);
  });

  // Botones atrás/adelante y cambios manuales de ruta o hash.
  window.addEventListener('popstate', function () { showSection(idActual()); });
  window.addEventListener('hashchange', function () { showSection(idActual()); });

  // Carga inicial. Un enlace antiguo con #seccion se corrige a la ruta limpia sin recargar.
  var inicial = idActual();
  if (!usarHash && idDesdeHash(window.location.hash)) {
    try { window.history.replaceState(null, '', rutaDe(inicial)); } catch (e) { /* se mantiene el hash */ }
  }
  showSection(inicial, { focus: false });
})();

// Carruseles (hero de Inicio y galería de la planta).
// Avance automático cada 5 s; se detiene al pasar el mouse, al enfocar un control, con el botón de pausa,
// cuando la pestaña o la sección no están visibles y siempre que el usuario prefiera movimiento reducido.
(function () {
  'use strict';

  var INTERVALO = 5000;
  var reducir = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  Array.prototype.forEach.call(document.querySelectorAll('[data-carrusel]'), function (root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll('.carrusel__slide'));
    var puntos = Array.prototype.slice.call(root.querySelectorAll('.carrusel__punto'));
    var botonPausa = root.querySelector('[data-pausa]');
    var actual = 0;
    var timer = null;
    var pausadoPorUsuario = reducir;
    var pausadoTemporal = false;

    function mostrar(i) {
      actual = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) {
        var activa = k === actual;
        s.classList.toggle('is-active', activa);
        if (activa) { s.removeAttribute('aria-hidden'); s.removeAttribute('inert'); }
        else { s.setAttribute('aria-hidden', 'true'); s.setAttribute('inert', ''); }
      });
      puntos.forEach(function (p, k) {
        if (k === actual) p.setAttribute('aria-current', 'true');
        else p.removeAttribute('aria-current');
      });
    }

    function visible() {
      return !document.hidden && root.getClientRects().length > 0;
    }

    function detener() {
      if (timer) { window.clearInterval(timer); timer = null; }
    }

    function iniciar() {
      detener();
      if (pausadoPorUsuario || pausadoTemporal) return;
      timer = window.setInterval(function () {
        if (visible()) mostrar(actual + 1);
      }, INTERVALO);
    }

    function actualizarBotonPausa() {
      root.classList.toggle('is-paused', pausadoPorUsuario);
      if (botonPausa) {
        botonPausa.setAttribute('aria-label', pausadoPorUsuario ? 'Reanudar el carrusel' : 'Pausar el carrusel');
      }
    }

    root.querySelector('.carrusel__btn--prev').addEventListener('click', function () { mostrar(actual - 1); iniciar(); });
    root.querySelector('.carrusel__btn--next').addEventListener('click', function () { mostrar(actual + 1); iniciar(); });
    puntos.forEach(function (p, k) { p.addEventListener('click', function () { mostrar(k); iniciar(); }); });
    if (botonPausa) {
      botonPausa.addEventListener('click', function () {
        pausadoPorUsuario = !pausadoPorUsuario;
        actualizarBotonPausa();
        iniciar();
      });
    }

    root.addEventListener('mouseenter', function () { pausadoTemporal = true; detener(); });
    root.addEventListener('mouseleave', function () { pausadoTemporal = false; iniciar(); });
    root.addEventListener('focusin', function () { pausadoTemporal = true; detener(); });
    root.addEventListener('focusout', function () { pausadoTemporal = false; iniciar(); });
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { mostrar(actual - 1); iniciar(); }
      else if (e.key === 'ArrowRight') { mostrar(actual + 1); iniciar(); }
    });

    // Deslizamiento táctil
    var inicioX = null;
    root.addEventListener('touchstart', function (e) { inicioX = e.touches[0].clientX; }, { passive: true });
    root.addEventListener('touchend', function (e) {
      if (inicioX === null) return;
      var dx = e.changedTouches[0].clientX - inicioX;
      inicioX = null;
      if (Math.abs(dx) > 40) { mostrar(actual + (dx < 0 ? 1 : -1)); iniciar(); }
    }, { passive: true });

    mostrar(0);
    actualizarBotonPausa();
    iniciar();
  });
})();
