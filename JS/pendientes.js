(function () {
  if (!estaLogueado()) {
    window.location.replace('./index.html');
    return;
  }

  var pendientesRecetas = [];
  var seleccionada = null;
  var lista = document.getElementById('pendientesLista');
  var detalle = document.getElementById('pendientesDetalle');

  async function cargar() {
    var sesion = obtenerSesion();
    if (!sesion) return;
    var ids = await obtenerPendientes(sesion.userId);
    if (!ids || ids.length === 0) {
      lista.innerHTML = '';
      detalle.innerHTML = '<p class="pendientes-detalle-vacio">Aún no tenés recetas pendientes.</p>';
      return;
    }
    var todas = await obtenerRecetas();
    pendientesRecetas = todas.filter(function (r) { return ids.indexOf(r.id) !== -1; });
    if (pendientesRecetas.length > 0) seleccionada = pendientesRecetas[0].id;
    renderizar();
  }

  function renderizar() {
    if (pendientesRecetas.length === 0) {
      lista.innerHTML = '';
      detalle.innerHTML = '<p class="pendientes-detalle-vacio">Aún no tenés recetas pendientes.</p>';
      return;
    }
    lista.innerHTML = pendientesRecetas.map(function (r) {
      return '<div class="pendientes-lista-item' + (r.id === seleccionada ? ' seleccionado' : '') + '" data-id="' + r.id + '">' +
        '<div class="pendientes-lista-item-tipo">' + r.tipo + '</div>' +
        '<div class="pendientes-lista-item-nombre-row">' +
          '<span class="pendientes-lista-item-nombre">' + r.titulo + '</span>' +
          '<a class="pend-abrir-btn" href="receta.html?id=' + r.id + '" title="Abrir receta">🔗</a>' +
          '<button class="pend-remove-btn" data-id="' + r.id + '" title="Quitar de pendientes">🗑️</button>' +
        '</div>' +
        '<div class="pendientes-lista-item-meta">' +
          '<span>🕐 ' + r.tiempo + '</span>' +
          '<span>📊 ' + r.dificultad + '</span>' +
          '<span>👥 ' + (r.personas > 0 ? r.personas : '—') + ' pers.</span>' +
        '</div>' +
      '</div>';
    }).join('');
    mostrarDetalle(seleccionada);
  }

  function mostrarDetalle(id) {
    var r = pendientesRecetas.find(function (r) { return r.id === id; });
    if (!r) {
      detalle.innerHTML = '<p class="pendientes-detalle-vacio">Seleccioná una receta de la lista</p>';
      return;
    }
    detalle.innerHTML =
      crearTarjeta(r).replace('class="tarjeta"', 'class="tarjeta visible"') +
      '<div style="padding:0.75rem 1rem 1rem;text-align:center;">' +
        '<a class="BotonP" href="receta.html?id=' + r.id + '" style="display:inline-block;">🔗 Abrir receta</a>' +
      '</div>';
  }

  document.addEventListener('click', async function (e) {
    var btn = e.target.closest('.pend-remove-btn');
    if (btn) {
      e.preventDefault();
      var id = btn.dataset.id;
      var sesion = obtenerSesion();
      if (!sesion) return;
      await quitarPendiente(sesion.userId, id);
      pendientesRecetas = pendientesRecetas.filter(function (r) { return r.id !== id; });
      if (seleccionada === id) {
        seleccionada = pendientesRecetas.length > 0 ? pendientesRecetas[0].id : null;
      }
      renderizar();
      return;
    }
    var item = e.target.closest('.pendientes-lista-item');
    if (item) {
      e.preventDefault();
      seleccionada = item.dataset.id;
      renderizar();
      return;
    }
  });

  cargar();
})();
