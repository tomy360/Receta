var precargaCache = {};
var precargaCargando = {};

function precargar(clave, fn) {
  if (precargaCache[clave]) return Promise.resolve(precargaCache[clave]);
  if (precargaCargando[clave]) return precargaCargando[clave];
  precargaCargando[clave] = fn().then(function (d) {
    precargaCache[clave] = d;
    delete precargaCargando[clave];
    return d;
  }).catch(function (e) {
    delete precargaCargando[clave];
    throw e;
  });
  return precargaCargando[clave];
}

function mostrarSkeletons(contenedor, cantidad) {
  if (!contenedor) return;
  cantidad = cantidad || 3;
  var html = '';
  for (var i = 0; i < cantidad; i++) {
    html += '<div class="skeleton-tarjeta"><div class="skeleton-tarjeta-imagen"></div><div class="skeleton-tarjeta-titulo"></div><div class="skeleton-tarjeta-desc"></div><div class="skeleton-tarjeta-desc" style="width:80%"></div></div>';
  }
  contenedor.innerHTML = html;
}

document.addEventListener('click', function (e) {
  if (e.target.closest('button, input, select, textarea, [role="button"]')) return;
  var link = e.target.closest('a');
  if (!link) return;
  var href = link.getAttribute('href');
  if (!href || href.startsWith('http') || href.startsWith('//') || href.indexOf('#') !== -1 || href.indexOf('javascript:') === 0) return;
  e.preventDefault();
  document.documentElement.style.opacity = '0.85';
  setTimeout(function () { window.location.href = href; }, 150);
});

window.addEventListener('pageshow', function (event) {
  if (event.persisted) {
    document.documentElement.style.opacity = '0';
    setTimeout(function () {
      document.documentElement.style.opacity = '1';
      document.documentElement.style.transition = 'opacity 0.3s ease-in-out';
    }, 50);
  }
});

function scrollSuave(el) {
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function debounce(fn, espera) {
  var t;
  return function () {
    var ctx = this, args = arguments;
    clearTimeout(t);
    t = setTimeout(function () { fn.apply(ctx, args); }, espera || 300);
  };
}
