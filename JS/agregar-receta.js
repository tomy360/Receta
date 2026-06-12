let contadorSecciones = 0;
let editandoId = null;

function init() {
  const params = new URLSearchParams(window.location.search);
  editandoId = params.get('id');

  if (editandoId) {
    const todas = obtenerRecetas();
    const receta = todas.find(r => r.id === editandoId);
    if (receta) {
      document.querySelector('.form-header h1').textContent = 'Editar Receta';
      document.querySelector('.form-header p').textContent = 'Modifica los datos de tu receta.';
      document.querySelector('.btn-guardar').innerHTML = '✏️ Actualizar Receta';
      cargarReceta(receta);
      return;
    }
  }

  agregarSeccion('Principal');
}

function cargarReceta(r) {
  document.getElementById('campoTitulo').value = r.titulo;
  document.getElementById('campoDescripcion').value = r.descripcion;
  document.getElementById('campoTipo').value = r.tipo;
  document.getElementById('campoDificultad').value = r.dificultad;
  document.getElementById('campoTiempo').value = r.tiempo;
  document.getElementById('campoPorciones').value = r.porciones || '';
  document.getElementById('campoImagen').value = r.imagen || '';
  document.getElementById('campoVideo').value = r.videoUrl || '';
  document.getElementById('campoAutor').value = r.autor || '';

  r.preparaciones.forEach(prep => {
    const ingTexto = prep.ingredientes.join('\n');
    const pasosTexto = prep.pasos.join('\n');
    agregarSeccion(prep.nombre, ingTexto, pasosTexto);
  });
}

document.getElementById('btnAgregarSeccion').addEventListener('click', function () {
  agregarSeccion('', '', '');
});

document.getElementById('formReceta').addEventListener('submit', function (e) {
  e.preventDefault();
  enviarFormulario();
});

function agregarSeccion(nombre, ingredientesTexto, pasosTexto) {
  const contenedor = document.getElementById('seccionesContainer');
  const index = contadorSecciones++;

  const div = document.createElement('div');
  div.className = 'prep-seccion-card';
  div.dataset.index = index;

  let btnEliminarHtml = '';
  if (contadorSecciones > 1 || editandoId) {
    btnEliminarHtml = `<button type="button" class="btn-eliminar-seccion" title="Eliminar esta sección">🗑️</button>`;
  }

  div.innerHTML = `
    <div class="prep-seccion-header">
      <div style="flex:1;margin-right:2rem;">
        <label style="display:block;font-size:0.875rem;font-weight:500;color:#374151;margin-bottom:0.25rem;">Nombre de la sección</label>
        <input type="text" class="seccion-nombre" value="${nombre || ''}" placeholder="Ej: La Masa, La Salsa... (déjalo en blanco si es simple)" style="width:100%;padding:0.5rem 1rem;border:1px solid #e5e7eb;border-radius:0.75rem;font-size:0.875rem;outline:none;background:#fff;">
      </div>
      ${btnEliminarHtml}
    </div>
    <div class="prep-columnas">
      <div>
        <label>Ingredientes</label>
        <p class="ayuda">Escribe un ingrediente por línea.</p>
        <textarea class="seccion-ingredientes" placeholder="Ej:&#10;500g harina&#10;1 pizca de sal&#10;Agua tibia">${ingredientesTexto || ''}</textarea>
      </div>
      <div>
        <label>Pasos de Preparación</label>
        <p class="ayuda">Escribe un paso por línea.</p>
        <textarea class="seccion-pasos" placeholder="Ej:&#10;Mezclar los ingredientes.&#10;Amasar por 10 minutos.&#10;Dejar reposar.">${pasosTexto || ''}</textarea>
      </div>
    </div>
  `;

  const btnEliminar = div.querySelector('.btn-eliminar-seccion');
  if (btnEliminar) {
    btnEliminar.addEventListener('click', function () {
      div.remove();
    });
  }

  contenedor.appendChild(div);
}

function enviarFormulario() {
  const titulo = document.getElementById('campoTitulo').value.trim();
  const descripcion = document.getElementById('campoDescripcion').value.trim();
  const tipo = document.getElementById('campoTipo').value;
  const dificultad = document.getElementById('campoDificultad').value;
  const tiempo = document.getElementById('campoTiempo').value.trim();
  const porciones = parseInt(document.getElementById('campoPorciones').value) || 1;

  let imagen = document.getElementById('campoImagen').value.trim();

  // Si está vacío usa una imagen por defecto
  if (!imagen) {
    imagen = './Imagenes/Recetas/sin-imagen.jpg';
  }
  // Si no es una URL, asume que está en Imagenes/Recetas
  else if (
    !imagen.startsWith('http://') &&
    !imagen.startsWith('https://') &&
    !imagen.startsWith('./') &&
    !imagen.startsWith('../')
  ) {
    imagen = './Imagenes/Recetas/' + imagen;
  }

  const videoUrl = document.getElementById('campoVideo').value.trim();
  const autor = document.getElementById('campoAutor').value.trim();

  const errorTitulo = document.getElementById('errorTitulo');
  const errorTiempo = document.getElementById('errorTiempo');

  errorTitulo.textContent = '';
  errorTiempo.textContent = '';

  let valido = true;

  if (!titulo) {
    errorTitulo.textContent = 'El nombre es obligatorio';
    valido = false;
  }

  if (!tiempo) {
    errorTiempo.textContent = 'Especifica el tiempo';
    valido = false;
  }

  if (!valido) return;

  const secciones = document.querySelectorAll('.prep-seccion-card');
  const preparaciones = [];

  secciones.forEach(sec => {
    const nombre = sec.querySelector('.seccion-nombre').value.trim();
    const ingTexto = sec.querySelector('.seccion-ingredientes').value;
    const pasosTexto = sec.querySelector('.seccion-pasos').value;

    const ingredientes = ingTexto
      .split('\n')
      .map(i => i.trim())
      .filter(i => i.length > 0);

    const pasos = pasosTexto
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    preparaciones.push({
      nombre: nombre || 'Principal',
      ingredientes: ingredientes.length ? ingredientes : ['Sin ingredientes'],
      pasos: pasos.length ? pasos : ['Sin pasos']
    });
  });

  if (editandoId) {
    const todas = obtenerRecetas();
    const existente = todas.find(r => r.id === editandoId);

    if (existente) {
      actualizarReceta({
        ...existente,
        titulo,
        descripcion,
        tipo,
        dificultad,
        tiempo,
        porciones,
        imagen,
        videoUrl,
        autor,
        preparaciones
      });
    }
  } else {
    guardarReceta({
      id: Date.now().toString(),
      titulo,
      descripcion,
      tipo,
      dificultad,
      tiempo,
      porciones,
      imagen,
      videoUrl,
      autor,
      puntuacion: 0,
      favorito: false,
      resenas: [],
      notasPersonales: [],
      preparaciones
    });
  }

  window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', init);
