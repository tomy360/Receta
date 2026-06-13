let receta = null;
let porcionesEscala = 1;
var cocinaPaso = 0;
var cocinaPasos = [];
var cuerpoScrollTop = 0;
var cocinaTouchX = 0;
let tabActivo = 'ingredientes';
let nuevaNota = '';
let nuevaResena = '';
let nuevaPuntuacion = 5;
let mostrarFormResena = false;
let editandoNotaId = null;
let editandoResenaId = null;
let editPuntuacion = 5;

function generarVideoHtml(url) {
  if (!url) return '';

  // Video local o archivo directo (.mp4, .webm, .ogg, .mov)
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url) || url.startsWith('./') || url.startsWith('../')) {
    return `
      <div class="detalle-video">
        <video src="${url}" controls style="width:100%;border-radius:0.75rem;"></video>
      </div>`;
  }

  // YouTube: embed directo
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (ytMatch) {
    const videoId = ytMatch[1];
    return `
      <div class="detalle-video">
        <iframe
          src="https://www.youtube.com/embed/${videoId}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          style="width:100%;aspect-ratio:16/9;border-radius:0.75rem;">
        </iframe>
      </div>`;
  }

  // Detectar red social
  let icono = '🔗';
  let nombre = 'Ver video';
  let color = '#6b7280';
  let colorBtn = '#4b5563';

  if (url.includes('instagram.com')) {
    icono = '📸';
    nombre = 'Ver en Instagram';
    color = '#e1306c';
    colorBtn = '#c13584';
  } else if (url.includes('tiktok.com')) {
    icono = '🎵';
    nombre = 'Ver en TikTok';
    color = '#010101';
    colorBtn = '#fe2c55';
  } else if (url.includes('facebook.com') || url.includes('fb.watch')) {
    icono = '📘';
    nombre = 'Ver en Facebook';
    color = '#1877f2';
    colorBtn = '#0d6efd';
  } else if (url.includes('x.com') || url.includes('twitter.com')) {
    icono = '🐦';
    nombre = 'Ver en X / Twitter';
    color = '#000000';
    colorBtn = '#333';
  }

  return `
    <div class="detalle-video-externo" style="
      display:flex;align-items:center;gap:1rem;
      background:var(--fondo-tarjeta, #f9fafb);
      border:2px solid ${color}33;
      border-radius:0.75rem;
      padding:1rem 1.25rem;
      margin:1rem 0;">
      <span style="font-size:2rem;">${icono}</span>
      <div style="flex:1;">
        <p style="margin:0;font-size:0.875rem;color:var(--texto-suave,#6b7280);">Video de la receta</p>
        <p style="margin:0.2rem 0 0;font-size:0.8rem;color:var(--texto-suave,#9ca3af);word-break:break-all;">${url.length > 50 ? url.slice(0, 50) + '…' : url}</p>
      </div>
      <a href="${url}" target="_blank" rel="noopener noreferrer"
        style="
          display:inline-flex;align-items:center;gap:0.4rem;
          background:${colorBtn};color:#fff;
          padding:0.5rem 1rem;border-radius:0.5rem;
          font-size:0.875rem;font-weight:600;
          text-decoration:none;white-space:nowrap;">
        ${nombre} ↗
      </a>
    </div>`;
}

async function init() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) {
    document.getElementById('detalleContenido').innerHTML = '<p style="text-align:center;padding:3rem;color:#6b7280;">Receta no encontrada.</p>';
    return;
  }

  try {
    var todas = await obtenerRecetas();
    receta = todas.find(function (r) { return r.id === id; });
  } catch (e) {
    document.getElementById('detalleContenido').innerHTML = '<p style="text-align:center;padding:3rem;color:#6b7280;">Error al cargar la receta.</p>';
    return;
  }

  if (!receta) {
    document.getElementById('detalleContenido').innerHTML = '<p style="text-align:center;padding:3rem;color:#6b7280;">Receta no encontrada.</p>';
    return;
  }

  renderizarDetalle();
  configurarTabs();
  configurarNotas();
  configurarResenas();
}

function renderizarDetalle() {
  const contenedor = document.getElementById('detalleContenido');
  const r = receta;

  const estrellasLlenas = '★'.repeat(Math.round(r.puntuacion));
  const estrellasVacias = '☆'.repeat(5 - Math.round(r.puntuacion));

  let videoHtml = '';
  if (r.videoUrl) {
    videoHtml = generarVideoHtml(r.videoUrl);
  }

  contenedor.innerHTML = `
    <div class="detalle-volver">
      <a href="index.html">
        <span class="flecha">←</span> Volver
      </a>
    </div>

    <div class="detalle-acciones">
      <a href="agregar.html?id=${r.id}" class="btn-accion btn-editar">✏️ Editar receta</a>
      <button class="btn-accion ${r.favorito ? 'btn-fav-activo' : 'btn-fav'}" id="btnFavDetalle" onclick="toggleFavoritoDetalle()">${r.favorito ? '❤️' : '🤍'} Favorito</button>
      <button class="btn-accion btn-principal" id="btnModoCocina" onclick="abrirModoCocina(receta)">👨‍🍳 Modo Cocina</button>
      <button class="btn-accion" id="btnCompartir" onclick="compartirReceta()">📤 Compartir</button>
      <button class="btn-accion btn-eliminar" onclick="eliminarRecetaActual()">🗑️ Eliminar receta</button>
    </div>

    <div class="detalle-grid">
      <div class="detalle-col-izq">
        <div class="detalle-imagen">
          <div class="aspecto">
            <img src="${r.imagen}" alt="${r.titulo}">
            <span class="detalle-tipo-badge">${r.tipo}</span>
          </div>
        </div>
        <div class="detalle-meta">
          <div class="detalle-meta-item">
            <div class="detalle-meta-icono tiempo">🕐</div>
            <span class="detalle-meta-valor">${r.tiempo}</span>
            <span class="detalle-meta-label">Tiempo</span>
          </div>
          <div class="detalle-meta-divisor"></div>
          <div class="detalle-meta-item">
            <div class="detalle-meta-icono dificultad">📊</div>
            <span class="detalle-meta-valor">${r.dificultad}</span>
            <span class="detalle-meta-label">Dificultad</span>
          </div>
          <div class="detalle-meta-divisor"></div>
          <div class="detalle-meta-item">
            <div class="detalle-meta-icono puntuacion">★</div>
            <span class="detalle-meta-valor">${r.puntuacion}</span>
            <span class="detalle-meta-label">Puntaje</span>
          </div>
          <div class="detalle-meta-divisor"></div>
          <div class="detalle-meta-item">
            <div class="detalle-meta-icono dificultad">✍️</div>
            <span class="detalle-meta-valor">${r.autor || 'Anónimo'}</span>
            <span class="detalle-meta-label">Autor</span>
          </div>
          <div class="detalle-meta-divisor"></div>
          <div class="detalle-meta-item" id="porcionesControl">
            <div class="detalle-meta-icono dificultad">👥</div>
            <div class="porciones-control">
              <button class="porciones-btn" onclick="cambiarPorciones(-1)">−</button>
              <span class="detalle-meta-valor" id="porcionesValor">${r.porciones || '—'}</span>
              <button class="porciones-btn" onclick="cambiarPorciones(1)">+</button>
            </div>
            <span class="detalle-meta-label">Porciones</span>
          </div>
        </div>
      </div>

      <div class="detalle-info">
        <h1>${r.titulo}</h1>
        <p class="detalle-descripcion">${r.descripcion}</p>
        ${videoHtml}

        <div class="tabs">
          <div class="tabs-header">
            <button class="tab-btn activo" data-tab="ingredientes">✅ Ingredientes</button>
            <button class="tab-btn" data-tab="notas">📝 Notas</button>
            <button class="tab-btn" data-tab="resenas">💬 Opiniones</button>
          </div>
          <div class="tab-contenido" id="tabContenido"></div>
        </div>
      </div>
    </div>
  `;

  renderizarTab('ingredientes');
}

function configurarTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('activo'));
      this.classList.add('activo');
      renderizarTab(this.dataset.tab);
    });
  });
}

function renderizarTab(tab) {
  tabActivo = tab;
  const contenedor = document.getElementById('tabContenido');
  if (!contenedor) return;

  if (tab === 'ingredientes') renderizarIngredientes(contenedor);
  else if (tab === 'notas') renderizarNotas(contenedor);
  else if (tab === 'resenas') renderizarResenas(contenedor);
}

function escalarIngrediente(ing, factor) {
  if (factor === 1) return ing;
  return ing.replace(/(^\d+)(?:\s*\/\s*(\d+))?/, function (match, entero, denominador) {
    var num = parseInt(entero, 10);
    if (denominador) num = num / parseInt(denominador, 10);
    var escalado = num * factor;
    if (Number.isInteger(escalado)) return escalado.toString();
    var fraccion = '';
    var enteroParte = Math.floor(escalado);
    var resto = escalado - enteroParte;
    if (resto >= 0.6) { enteroParte += 1; resto = 0; }
    else if (resto >= 0.1) {
      if (Math.abs(resto - 0.25) < 0.1) fraccion = '¼';
      else if (Math.abs(resto - 0.33) < 0.1) fraccion = '⅓';
      else if (Math.abs(resto - 0.5) < 0.1) fraccion = '½';
      else if (Math.abs(resto - 0.66) < 0.1) fraccion = '⅔';
      else if (Math.abs(resto - 0.75) < 0.1) fraccion = '¾';
      else fraccion = '' + Math.round(resto * 100) / 100;
    }
    if (enteroParte > 0 && fraccion) return enteroParte + ' ' + fraccion;
    if (enteroParte > 0) return enteroParte.toString();
    if (fraccion) return fraccion;
    return escalado.toFixed(1);
  });
}

function cambiarPorciones(delta) {
  var base = parseInt(receta.porciones, 10);
  if (!base) return;
  var actual = parseInt(document.getElementById('porcionesValor').textContent, 10);
  if (!actual) actual = base;
  var nueva = actual + delta;
  if (nueva < 1) nueva = 1;
  porcionesEscala = nueva / base;
  document.getElementById('porcionesValor').textContent = nueva;
  renderizarTab(tabActivo);
}

function renderizarIngredientes(contenedor) {
  const r = receta;
  let html = '<div style="display:flex;flex-direction:column;gap:2.5rem;">';

  r.preparaciones.forEach(prep => {
    html += `<div class="prep-seccion">`;
    if (prep.nombre && prep.nombre !== 'Principal') {
      html += `<h2 class="prep-titulo">${prep.nombre}</h2>`;
    }
    html += `<div class="prep-grid">
      <div>
        <h3 class="prep-subtitulo">📋 Ingredientes</h3>
        <ul class="lista-ingredientes">`;
    prep.ingredientes.forEach(ing => {
      html += `<li><span class="punto"></span>${escalarIngrediente(ing, porcionesEscala)}</li>`;
    });
    html += `</ul></div><div>
        <h3 class="prep-subtitulo">👨‍🍳 Preparación</h3>
        <div class="lista-pasos">`;
    prep.pasos.forEach((paso, idx) => {
      html += `<div class="paso-item">
        <div class="paso-numero">${idx + 1}</div>
        <p class="paso-texto">${paso}</p>
      </div>`;
    });
    html += `</div></div></div></div>`;
  });

  html += '</div>';
  contenedor.innerHTML = html;
}

function renderizarNotas(contenedor) {
  const r = receta;
  let html = `
    <div class="notas-form">
      <h4>Añadir una nota personal</h4>
      <div class="notas-input-grupo">
        <input type="text" id="inputNota" placeholder="Ej: Usé leche de almendras en vez de vaca...">
        <button class="BotonP" id="btnGuardarNota" style="padding:0.5rem 1rem;font-size:0.875rem;">💾 Guardar</button>
      </div>
    </div>
    <div class="notas-lista" id="notasLista">
  `;

  if (!r.notasPersonales || r.notasPersonales.length === 0) {
    html += `<p class="nota-vacia">No tienes notas personales para esta receta todavía.</p>`;
  } else {
    r.notasPersonales.forEach(nota => {
      if (editandoNotaId === nota.id) {
        html += `
          <div class="nota-item">
            <div class="nota-editar-input">
              <input type="text" id="editNotaInput" value="${nota.texto}">
              <div style="display:flex;gap:0.5rem;margin-top:0.5rem;">
                <button class="BotonP" id="btnSaveEditNota" data-id="${nota.id}" style="padding:0.375rem 0.875rem;font-size:0.813rem;">💾 Guardar</button>
                <button class="btn-cancelar" id="btnCancelEditNota" style="padding:0.375rem 0.875rem;font-size:0.813rem;">Cancelar</button>
              </div>
            </div>
          </div>
        `;
      } else {
        html += `
          <div class="nota-item">
            <p>${nota.texto}</p>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:0.25rem;">
              <span class="fecha">${nota.fecha}</span>
              <div class="nota-acciones">
                <button class="nota-btn nota-btn-editar" data-id="${nota.id}" title="Editar nota">✏️</button>
                <button class="nota-btn nota-btn-eliminar" data-id="${nota.id}" title="Eliminar nota">🗑️</button>
              </div>
            </div>
          </div>
        `;
      }
    });
  }

  html += '</div>';
  contenedor.innerHTML = html;
  configurarNotasInput();
  configurarNotasAcciones();
}

function configurarNotas() {
  // delegado
}

function configurarNotasInput() {
  const input = document.getElementById('inputNota');
  const btn = document.getElementById('btnGuardarNota');
  if (!input || !btn) return;

    const guardar = async function () {
      const texto = input.value.trim();
      if (!texto) return;

      const nota = {
        id: Date.now().toString(),
        texto: texto,
        fecha: new Date().toISOString().split('T')[0]
      };

      const actualizada = JSON.parse(JSON.stringify(receta));
      actualizada.notasPersonales.push(nota);

      receta = actualizada;
      await actualizarReceta(actualizada);
      input.value = '';

      const contenedor = document.getElementById('tabContenido');
      renderizarNotas(contenedor);
    };

    btn.addEventListener('click', guardar);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); guardar(); }
    });
}

function configurarNotasAcciones() {
  const container = document.getElementById('tabContenido');

  container.querySelectorAll('.nota-btn-editar').forEach(btn => {
    btn.addEventListener('click', function () {
      editandoNotaId = this.dataset.id;
      renderizarNotas(container);
    });
  });

  container.querySelectorAll('.nota-btn-eliminar').forEach(btn => {
    btn.addEventListener('click', function () {
      eliminarNota(this.dataset.id);
    });
  });

  const btnSave = document.getElementById('btnSaveEditNota');
  if (btnSave) {
    btnSave.addEventListener('click', function () {
      guardarEditarNota(this.dataset.id);
    });
  }

  const btnCancel = document.getElementById('btnCancelEditNota');
  if (btnCancel) {
    btnCancel.addEventListener('click', function () {
      editandoNotaId = null;
      renderizarNotas(container);
    });
  }

  const editInput = document.getElementById('editNotaInput');
  if (editInput) {
    editInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        const btn = document.getElementById('btnSaveEditNota');
        if (btn) guardarEditarNota(btn.dataset.id);
      }
    });
    editInput.focus();
  }
}

async function eliminarNota(id) {
  if (!confirm('¿Eliminar esta nota personal?')) return;
  const actualizada = JSON.parse(JSON.stringify(receta));
  actualizada.notasPersonales = actualizada.notasPersonales.filter(function (n) { return n.id !== id; });
  receta = actualizada;
  await actualizarReceta(actualizada);
  const contenedor = document.getElementById('tabContenido');
  renderizarNotas(contenedor);
}

async function guardarEditarNota(id) {
  const input = document.getElementById('editNotaInput');
  if (!input || !input.value.trim()) return;
  const actualizada = JSON.parse(JSON.stringify(receta));
  const nota = actualizada.notasPersonales.find(function (n) { return n.id === id; });
  if (nota) {
    nota.texto = input.value.trim();
    nota.fecha = new Date().toISOString().split('T')[0];
  }
  receta = actualizada;
  await actualizarReceta(actualizada);
  editandoNotaId = null;
  const contenedor = document.getElementById('tabContenido');
  renderizarNotas(contenedor);
}

function renderizarResenas(contenedor) {
  const r = receta;
  let html = '';

  if (!r.resenas || r.resenas.length === 0) {
    html += `<p class="resena-vacia">No hay opiniones publicadas todavía.</p>`;
  } else {
    r.resenas.forEach(res => {
      if (editandoResenaId === res.id) {
        let estrellasEdit = '';
        for (let i = 1; i <= 5; i++) {
          const activa = i <= editPuntuacion ? ' activa' : '';
          estrellasEdit += `<span class="estrella${activa}" data-val="${i}">★</span>`;
        }
        html += `
          <div class="resena-item">
            <div class="resena-form" style="margin-top:0;">
              <h4>Editar opinión</h4>
              <div class="resena-puntuacion">
                <span>Puntuación:</span>
                <div class="estrellas-input" id="editEstrellasInput">
                  ${estrellasEdit}
                </div>
              </div>
              <textarea id="editResenaTexto" placeholder="¿Qué te pareció la receta?" style="margin-bottom:1rem;">${res.comentario}</textarea>
              <div class="resena-acciones">
                <button class="btn-cancelar" id="btnCancelEditResena">Cancelar</button>
                <button class="btn-publicar" id="btnSaveEditResena" data-id="${res.id}">Guardar cambios</button>
              </div>
            </div>
          </div>
        `;
      } else {
        let estrellas = '';
        for (let i = 0; i < 5; i++) {
          estrellas += `<span class="resena-estrella${i < res.puntuacion ? ' llena' : ''}">★</span>`;
        }
        const esPropia = res.usuario === 'Tú';
        html += `
          <div class="resena-item">
            <div class="resena-header">
              <div class="resena-usuario">
                <div class="resena-avatar">${res.usuario.charAt(0)}</div>
                <div>
                  <h4 class="resena-nombre">${res.usuario}</h4>
                  <div class="resena-estrellas">${estrellas}</div>
                </div>
              </div>
              <div style="display:flex;align-items:center;gap:0.5rem;">
                <span class="resena-fecha">${res.fecha}</span>
                ${esPropia ? `<button class="resena-btn resena-btn-editar" data-id="${res.id}" title="Editar opinión">✏️</button>` : ''}
                <button class="resena-btn resena-btn-eliminar" data-id="${res.id}" title="Eliminar opinión">🗑️</button>
              </div>
            </div>
            <p class="resena-comentario">${res.comentario}</p>
          </div>
        `;
      }
    });
  }

  html += `<div id="resenaFormContainer">`;
  if (!mostrarFormResena) {
    html += `<button class="btn-resena" id="btnMostrarResena">Dejar una opinión</button>`;
  } else {
    html += `
      <div class="resena-form">
        <h4>Tu opinión</h4>
        <div class="resena-puntuacion">
          <span>Puntuación:</span>
          <div class="estrellas-input" id="estrellasInput">
            <span class="estrella" data-val="1">★</span>
            <span class="estrella" data-val="2">★</span>
            <span class="estrella" data-val="3">★</span>
            <span class="estrella" data-val="4">★</span>
            <span class="estrella" data-val="5">★</span>
          </div>
        </div>
        <textarea id="textoResena" placeholder="¿Qué te pareció la receta?" style="margin-bottom:1rem;"></textarea>
        <div class="resena-acciones">
          <button class="btn-cancelar" id="btnCancelarResena">Cancelar</button>
          <button class="btn-publicar" id="btnPublicarResena">Publicar</button>
        </div>
      </div>
    `;
  }
  html += `</div>`;

  contenedor.innerHTML = html;
  configurarResenasInteractivo();
  configurarResenasAcciones();
}

function configurarResenas() {
  // delegado
}

function configurarResenasInteractivo() {
  const btnMostrar = document.getElementById('btnMostrarResena');
  if (btnMostrar) {
    btnMostrar.addEventListener('click', function () {
      mostrarFormResena = true;
      const contenedor = document.getElementById('tabContenido');
      renderizarResenas(contenedor);
    });
  }

  const btnCancelar = document.getElementById('btnCancelarResena');
  if (btnCancelar) {
    btnCancelar.addEventListener('click', function () {
      mostrarFormResena = false;
      const contenedor = document.getElementById('tabContenido');
      renderizarResenas(contenedor);
    });
  }

  const estrellasInput = document.getElementById('estrellasInput');
  if (estrellasInput) {
    estrellasInput.querySelectorAll('.estrella').forEach(el => {
      el.addEventListener('click', function () {
        nuevaPuntuacion = parseInt(this.dataset.val);
        estrellasInput.querySelectorAll('.estrella').forEach(s => {
          s.classList.toggle('activa', parseInt(s.dataset.val) <= nuevaPuntuacion);
        });
      });
      if (parseInt(el.dataset.val) <= nuevaPuntuacion) {
        el.classList.add('activa');
      }
    });
  }

  const btnPublicar = document.getElementById('btnPublicarResena');
  if (btnPublicar) {
    btnPublicar.addEventListener('click', async function () {
      const texto = document.getElementById('textoResena');
      if (!texto || !texto.value.trim()) return;

      const resena = {
        id: Date.now().toString(),
        usuario: 'Tú',
        puntuacion: nuevaPuntuacion,
        comentario: texto.value.trim(),
        fecha: new Date().toISOString().split('T')[0]
      };

      const actualizada = JSON.parse(JSON.stringify(receta));
      const nuevasResenas = (actualizada.resenas || []).concat([resena]);
      var avg = nuevasResenas.reduce(function (ac, r) { return ac + r.puntuacion; }, 0) / nuevasResenas.length;

      actualizada.resenas = nuevasResenas;
      actualizada.puntuacion = Number(avg.toFixed(1));

      receta = actualizada;
      await actualizarReceta(actualizada);
      mostrarFormResena = false;
      nuevaPuntuacion = 5;

      const contenedor = document.getElementById('tabContenido');
      renderizarResenas(contenedor);
      var meta = document.querySelector('.detalle-meta-item:last-child .detalle-meta-valor');
      if (meta) meta.textContent = actualizada.puntuacion;
    });
  }
}

function configurarResenasAcciones() {
  const container = document.getElementById('tabContenido');

  container.querySelectorAll('.resena-btn-editar').forEach(btn => {
    btn.addEventListener('click', function () {
      const id = this.dataset.id;
      const resena = receta.resenas.find(r => r.id === id);
      if (resena) editPuntuacion = resena.puntuacion;
      editandoResenaId = id;
      renderizarResenas(container);
    });
  });

  container.querySelectorAll('.resena-btn-eliminar').forEach(btn => {
    btn.addEventListener('click', function () {
      eliminarResena(this.dataset.id);
    });
  });

  const editStars = document.getElementById('editEstrellasInput');
  if (editStars) {
    editStars.querySelectorAll('.estrella').forEach(el => {
      el.addEventListener('click', function () {
        editPuntuacion = parseInt(this.dataset.val);
        editStars.querySelectorAll('.estrella').forEach(s => {
          s.classList.toggle('activa', parseInt(s.dataset.val) <= editPuntuacion);
        });
      });
      if (parseInt(el.dataset.val) <= editPuntuacion) {
        el.classList.add('activa');
      }
    });
  }

  const btnSaveResena = document.getElementById('btnSaveEditResena');
  if (btnSaveResena) {
    btnSaveResena.addEventListener('click', function () {
      guardarEditarResena(this.dataset.id);
    });
  }

  const btnCancelResena = document.getElementById('btnCancelEditResena');
  if (btnCancelResena) {
    btnCancelResena.addEventListener('click', function () {
      editandoResenaId = null;
      editPuntuacion = 5;
      renderizarResenas(container);
    });
  }
}

async function eliminarResena(id) {
  if (!confirm('¿Eliminar esta opinión?')) return;
  const actualizada = JSON.parse(JSON.stringify(receta));
  const nuevasResenas = actualizada.resenas.filter(function (r) { return r.id !== id; });
  var avg = nuevasResenas.length > 0
    ? nuevasResenas.reduce(function (ac, r) { return ac + r.puntuacion; }, 0) / nuevasResenas.length
    : 0;
  actualizada.resenas = nuevasResenas;
  actualizada.puntuacion = nuevasResenas.length > 0 ? Number(avg.toFixed(1)) : 0;
  receta = actualizada;
  await actualizarReceta(actualizada);
  editandoResenaId = null;
  const contenedor = document.getElementById('tabContenido');
  renderizarResenas(contenedor);
  var meta = document.querySelector('.detalle-meta-item:last-child .detalle-meta-valor');
  if (meta) meta.textContent = actualizada.puntuacion;
}

async function guardarEditarResena(id) {
  const texto = document.getElementById('editResenaTexto');
  if (!texto || !texto.value.trim()) return;
  const actualizada = JSON.parse(JSON.stringify(receta));
  const resena = actualizada.resenas.find(function (r) { return r.id === id; });
  if (resena) {
    resena.puntuacion = editPuntuacion;
    resena.comentario = texto.value.trim();
    resena.fecha = new Date().toISOString().split('T')[0];
  }
  var avg = actualizada.resenas.reduce(function (ac, r) { return ac + r.puntuacion; }, 0) / actualizada.resenas.length;
  actualizada.puntuacion = Number(avg.toFixed(1));
  receta = actualizada;
  await actualizarReceta(actualizada);
  editandoResenaId = null;
  editPuntuacion = 5;
  const contenedor = document.getElementById('tabContenido');
  renderizarResenas(contenedor);
  var meta = document.querySelector('.detalle-meta-item:last-child .detalle-meta-valor');
  if (meta) meta.textContent = actualizada.puntuacion;
}

function compartirReceta() {
  var url = window.location.href;
  var titulo = receta.titulo;
  var texto = titulo + ' — ' + receta.descripcion + '\n\n' + url;
  if (navigator.share) {
    navigator.share({ title: titulo, text: texto, url: url }).catch(function () {});
  } else {
    navigator.clipboard.writeText(url).then(function () {
      var btn = document.getElementById('btnCompartir');
      if (btn) { btn.textContent = '✅ Enlace copiado'; setTimeout(function () { btn.textContent = '📤 Compartir'; }, 2000); }
    }).catch(function () {});
  }
}

function abrirModoCocina(r) {
  if (!r || !r.preparaciones || !r.preparaciones.length) return;
  cocinaPasos = [];
  r.preparaciones.forEach(function (p, idx) {
    var texto = (p.pasos && p.pasos.length) ? p.pasos.map(function (s, i) { return (i + 1) + '. ' + s; }).join('\n') : '';
    var ingredientes = (p.ingredientes || []).map(function (ing) { return escalarIngrediente(ing, porcionesEscala); });
    cocinaPasos.push({ titulo: p.nombre || 'Preparación ' + (idx + 1), texto: texto, ingredientes: ingredientes });
  });
  if (r.notasExtra) cocinaPasos.push({ titulo: 'Notas finales', texto: r.notasExtra, ingredientes: [] });
  if (!cocinaPasos.length) return;
  cocinaPaso = 0;
  var overlay = document.getElementById('cocinaOverlay');
  var cerrar = document.getElementById('cocinaCerrar');
  var prev = document.getElementById('cocinaPrev');
  var next = document.getElementById('cocinaNext');
  if (overlay) overlay.classList.remove('oculto');
  cuerpoScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.top = '-' + cuerpoScrollTop + 'px';
  document.body.style.width = '100%';
  renderizarCocinaPaso();
  if (cerrar) cerrar.onclick = cerrarModoCocina;
  if (prev) prev.onclick = function () { if (cocinaPaso > 0) { cocinaPaso--; renderizarCocinaPaso(); } };
  if (next) next.onclick = function () { if (cocinaPaso < cocinaPasos.length - 1) { cocinaPaso++; renderizarCocinaPaso(); } else { cerrarModoCocina(); } };
  document.addEventListener('keydown', cocinaKeyHandler);
  if (overlay) {
    overlay.addEventListener('touchstart', cocinaTouchStart, { passive: true });
    overlay.addEventListener('touchend', cocinaTouchEnd, { passive: true });
  }
}

function cerrarModoCocina() {
  var overlay = document.getElementById('cocinaOverlay');
  if (overlay) overlay.classList.add('oculto');
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  window.scrollTo(0, cuerpoScrollTop);
  document.removeEventListener('keydown', cocinaKeyHandler);
  var overlay = document.getElementById('cocinaOverlay');
  if (overlay) {
    overlay.removeEventListener('touchstart', cocinaTouchStart);
    overlay.removeEventListener('touchend', cocinaTouchEnd);
  }
}

function cocinaKeyHandler(e) {
  if (e.key === 'Escape') { cerrarModoCocina(); }
  if (e.key === 'ArrowLeft') { var p = document.getElementById('cocinaPrev'); if (p) p.click(); }
  if (e.key === 'ArrowRight') { var n = document.getElementById('cocinaNext'); if (n) n.click(); }
}

function cocinaTouchStart(e) {
  cocinaTouchX = e.touches[0].clientX;
}

function cocinaTouchEnd(e) {
  var dx = e.changedTouches[0].clientX - cocinaTouchX;
  if (Math.abs(dx) > 60) {
    if (dx < 0) { var n = document.getElementById('cocinaNext'); if (n) n.click(); }
    else { var p = document.getElementById('cocinaPrev'); if (p) p.click(); }
  }
}

function renderizarCocinaPaso() {
  var paso = cocinaPasos[cocinaPaso];
  if (!paso) return;
  document.getElementById('cocinaTitulo').textContent = paso.titulo;
  document.getElementById('cocinaPasoNum').textContent = (cocinaPaso + 1) + ' / ' + cocinaPasos.length;
  var prep = document.getElementById('cocinaPreparacion');
  prep.innerHTML = paso.texto.split('\n').map(function (l) { return l.trim() ? '<p>' + l.trim() + '</p>' : ''; }).join('');
  var ing = document.getElementById('cocinaIngredientes');
  if (paso.ingredientes && paso.ingredientes.length) {
    ing.innerHTML = '<h4>🧂 Ingredientes</h4><ul>' + paso.ingredientes.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>';
    ing.style.display = '';
  } else {
    ing.style.display = 'none';
  }
  var prev = document.getElementById('cocinaPrev');
  var next = document.getElementById('cocinaNext');
  if (prev) prev.style.visibility = cocinaPaso <= 0 ? 'hidden' : '';
  if (next) next.textContent = cocinaPaso >= cocinaPasos.length - 1 ? '✅ Finalizar' : 'Siguiente ▶';
  var progreso = document.getElementById('cocinaProgreso');
  if (progreso) progreso.style.width = ((cocinaPaso + 1) / cocinaPasos.length * 100) + '%';
}

async function toggleFavoritoDetalle() {
  var r = receta;
  r.favorito = !r.favorito;
  await actualizarReceta(r);
  var btn = document.getElementById('btnFavDetalle');
  if (btn) {
    btn.innerHTML = r.favorito ? '❤️ Favorito' : '🤍 Favorito';
    btn.className = 'btn-accion ' + (r.favorito ? 'btn-fav-activo' : 'btn-fav');
  }
}

async function eliminarRecetaActual() {
  if (!receta) return;
  if (!confirm('¿Estás seguro de eliminar "' + receta.titulo + '"? Esta acción no se puede deshacer.')) return;

  await eliminarReceta(receta.id);
  window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', init);