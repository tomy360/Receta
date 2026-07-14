(function () {
  if (!estaLogueado()) {
    window.location.replace('./index.html');
    return;
  }

  var pendientesRecetas = [];
  var grid = document.getElementById('pendientesGrid');
  var sinPend = document.getElementById('sinPendientes');

  async function cargar() {
    var sesion = obtenerSesion();
    if (!sesion) return;
    var ids = await obtenerPendientes(sesion.userId);
    if (!ids || ids.length === 0) {
      grid.innerHTML = '';
      sinPend.classList.remove('oculto');
      return;
    }
    sinPend.classList.add('oculto');
    var todas = await obtenerRecetas();
    pendientesRecetas = todas.filter(function (r) { return ids.indexOf(r.id) !== -1; });
    renderizar();
  }

  function renderizar() {
    if (pendientesRecetas.length === 0) {
      grid.innerHTML = '';
      sinPend.classList.remove('oculto');
      return;
    }
    grid.innerHTML = pendientesRecetas.map(function (r) {
      var estrellas = '★'.repeat(Math.round(r.puntuacion));
      var estrellaVacia = '☆'.repeat(5 - Math.round(r.puntuacion));
      return '<div class="tarjeta visible" data-pend-id="' + r.id + '">' +
        '<button class="pend-remove-btn" data-id="' + r.id + '" title="Quitar de pendientes">🗑️</button>' +
        '<a href="receta.html?id=' + r.id + '">' +
          '<div class="tarjeta-imagen" style="background-image:url(\'' + r.imagen + '\')">' +
            '<span class="tarjeta-tipo">' + r.tipo + '</span>' +
          '</div>' +
          '<div class="tarjeta-info">' +
            '<div class="tarjeta-puntuacion">' +
              '<span class="estrella">' + estrellas + estrellaVacia + '</span>' +
              '<span>' + r.puntuacion + '</span>' +
              '<span class="resenas-count">(' + r.resenas.length + ' reseñas)</span>' +
            '</div>' +
            '<h3 class="tarjeta-titulo">' + r.titulo + '</h3>' +
            '<p class="tarjeta-descripcion">' + r.descripcion + '</p>' +
            '<div class="tarjeta-autor">✍️ ' + (r.autor || 'Anónimo') + '</div>' +
            (r.categorias || r.dieta ? '<div class="tarjeta-meta">' +
              (r.categorias ? '<div class="tarjeta-categorias">' + r.categorias.split(',').map(function(c) { return '<span class="mini-categoria">' + c.trim() + '</span>'; }).join('') + '</div>' : '') +
              (r.dieta ? '<span class="tarjeta-dieta">🥗 ' + r.dieta + '</span>' : '') +
            '</div>' : '') +
            '<div class="tarjeta-footer">' +
              '<span><span class="icono">🕐</span> ' + r.tiempo + '</span>' +
              '<span><span class="icono">📊</span> ' + r.dificultad + '</span>' +
              '<span><span class="icono">👥</span> ' + (r.personas > 0 ? r.personas : '—') + ' pers.</span>' +
            '</div>' +
          '</div>' +
        '</a>' +
      '</div>';
    }).join('');
  }

  document.addEventListener('click', async function (e) {
    var btn = e.target.closest('.pend-remove-btn');
    if (!btn) return;
    e.preventDefault();
    var id = btn.dataset.id;
    var sesion = obtenerSesion();
    if (!sesion) return;
    await quitarPendiente(sesion.userId, id);
    pendientesRecetas = pendientesRecetas.filter(function (r) { return r.id !== id; });
    renderizar();
  });

  cargar();
})();
