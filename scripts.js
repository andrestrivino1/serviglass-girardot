// Serviglass Girardot — navegación entre secciones con hash.
// Contrato: specs/001-serviglass-site-refresh/contracts/ui-contract.md §2
(function () {
  'use strict';

  var SECTION_IDS = ['inicio', 'nosotros', 'servicios', 'contacto'];
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('nav[aria-label="Principal"] a[href^="#"]')
  );

  function idFromHash(hash) {
    var id = (hash || '').replace(/^#/, '');
    return SECTION_IDS.indexOf(id) !== -1 ? id : null;
  }

  function showSection(id, options) {
    var focus = !options || options.focus !== false;

    SECTION_IDS.forEach(function (key) {
      var el = document.getElementById(key);
      if (el) el.classList.toggle('is-active', key === id);
    });

    navLinks.forEach(function (link) {
      if (link.getAttribute('href') === '#' + id) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    var heading = document.getElementById(id + '-titulo');
    if (focus && heading) heading.focus({ preventScroll: true });
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }

  // Enlaces internos a secciones (menú, CTA, pie): sin salto nativo, con hash en la URL.
  document.addEventListener('click', function (event) {
    var link = event.target.closest ? event.target.closest('a[href^="#"]') : null;
    if (!link) return;
    var id = idFromHash(link.getAttribute('href'));
    if (!id) return;
    event.preventDefault();
    if (idFromHash(window.location.hash) !== id) {
      window.history.pushState(null, '', '#' + id);
    }
    showSection(id);
  });

  // Botones atrás/adelante y cambios manuales del hash.
  window.addEventListener('hashchange', function () {
    showSection(idFromHash(window.location.hash) || 'inicio');
  });

  // Carga inicial: hash válido → esa sección; vacío o inválido → inicio sin tocar la URL.
  showSection(idFromHash(window.location.hash) || 'inicio', { focus: false });
})();
