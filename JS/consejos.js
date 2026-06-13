var TABLA_TIPS = 'tips';
var editandoTipId = null;

async function peticionTips(url, opts) {
  var res = await fetch(url, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    ...opts
  });
  if (!res.ok) {
    var texto = await res.text();
    throw new Error('Supabase error ' + res.status + ': ' + texto);
  }
  if (opts && opts.method === 'DELETE') return null;
  return res.json();
}

async function obtenerTips() {
  try {
    return await peticionTips(SUPABASE_URL + '/rest/v1/' + TABLA_TIPS + '?select=*&order=created_at.asc');
  } catch (e) {
    return [];
  }
}

async function guardarTip(tip) {
  await peticionTips(SUPABASE_URL + '/rest/v1/' + TABLA_TIPS, {
    method: 'POST',
    body: JSON.stringify(tip)
  });
}

async function actualizarTip(tip) {
  await peticionTips(SUPABASE_URL + '/rest/v1/' + TABLA_TIPS + '?id=eq.' + encodeURIComponent(tip.id), {
    method: 'PATCH',
    body: JSON.stringify({ titulo: tip.titulo, contenido: tip.contenido, autor: tip.autor })
  });
}

async function eliminarTip(id) {
  await peticionTips(SUPABASE_URL + '/rest/v1/' + TABLA_TIPS + '?id=eq.' + encodeURIComponent(id), {
    method: 'DELETE'
  });
}

async function initConsejos() {
  var tips = await obtenerTips();
  renderizarConsejos(tips);

  var nombreGuardado = localStorage.getItem('recetario-nombre-usuario') || '';
  var nombreInput = document.getElementById('campoNombreConsejo');
  if (nombreInput) nombreInput.value = nombreGuardado;

  document.getElementById('btnGuardarConsejo').addEventListener('click', async function () {
    var titulo = document.getElementById('campoTituloConsejo').value.trim();
    var contenido = document.getElementById('campoContenidoConsejo').value.trim();
    if (!titulo || !contenido) return;

    var nombreInput = document.getElementById('campoNombreConsejo');
    var nombre = (nombreInput ? nombreInput.value.trim() : '') || '';
    if (nombre) localStorage.setItem('recetario-nombre-usuario', nombre);

    if (editandoTipId) {
      await actualizarTip({ id: editandoTipId, titulo: titulo, contenido: contenido, autor: nombre || 'Anónimo' });
      editandoTipId = null;
      document.getElementById('btnCancelarConsejo').classList.add('oculto');
    } else {
      await guardarTip({
        id: Date.now().toString(),
        titulo: titulo,
        contenido: contenido,
        autor: nombre || 'Anónimo'
      });
    }

    document.getElementById('campoTituloConsejo').value = '';
    document.getElementById('campoNombreConsejo').value = nombre;
    document.getElementById('campoContenidoConsejo').value = '';
    document.getElementById('btnGuardarConsejo').textContent = '💾 Guardar consejo';

    var tips = await obtenerTips();
    renderizarConsejos(tips);
  });

  document.getElementById('btnCancelarConsejo').addEventListener('click', function () {
    editandoTipId = null;
    document.getElementById('campoTituloConsejo').value = '';
    document.getElementById('campoContenidoConsejo').value = '';
    document.getElementById('btnGuardarConsejo').textContent = '💾 Guardar consejo';
    document.getElementById('btnCancelarConsejo').classList.add('oculto');
  });
}

function renderizarConsejos(tips) {
  var grid = document.getElementById('consejosGrid');
  var sin = document.getElementById('sinConsejos');

  if (!tips.length) {
    grid.innerHTML = '';
    sin.classList.remove('oculto');
    return;
  }

  sin.classList.add('oculto');
  grid.innerHTML = tips.map(function (t) {
    var fecha = '';
    if (t.created_at) {
      fecha = new Date(t.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    var autor = t.autor ? t.autor + ' · ' : '';
    return '<div class="consejo-card">' +
      '<h3>' + t.titulo + '</h3>' +
      '<p>' + t.contenido + '</p>' +
      '<div class="consejo-meta">' +
        '<span>' + autor + fecha + '</span>' +
        '<div class="consejo-acciones">' +
          '<button class="btn-accion" onclick="editarTip(\'' + t.id + '\')">✏️</button>' +
          '<button class="btn-eliminar-tip" onclick="eliminarTipClick(\'' + t.id + '\')">🗑️</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

async function editarTip(id) {
  var tips = await obtenerTips();
  var tip = tips.find(function (t) { return t.id === id; });
  if (!tip) return;

  editandoTipId = tip.id;
  document.getElementById('campoTituloConsejo').value = tip.titulo;
  document.getElementById('campoContenidoConsejo').value = tip.contenido;
  document.getElementById('btnGuardarConsejo').textContent = '✏️ Actualizar consejo';
  document.getElementById('btnCancelarConsejo').classList.remove('oculto');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function eliminarTipClick(id) {
  if (!confirm('¿Eliminar este consejo?')) return;
  await eliminarTip(id);
  var tips = await obtenerTips();
  renderizarConsejos(tips);
}

document.addEventListener('DOMContentLoaded', initConsejos);
