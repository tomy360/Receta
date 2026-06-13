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
