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
