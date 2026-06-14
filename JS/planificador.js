var DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
var SLOTS = [
  { comida: 'Desayuno',    fija: true  },
  { comida: 'Snack',       fija: false },
  { comida: 'Almuerzo',    fija: true  },
  { comida: 'Snack 2',     fija: false },
  { comida: 'Media tarde', fija: true  },
  { comida: 'Cena',        fija: true  },
  { comida: 'Postre',      fija: false },
];
var CLAVE_PLAN = 'recetario-plan-semanal';

function obtenerUserId() {
  var sesion = obtenerSesion();
  return sesion ? sesion.userId : null;
}

async function obtenerPlan() {
  var userId = obtenerUserId();
  if (!userId) return {};
  try {
    var res = await fetch(SUPABASE_URL + '/rest/v1/' + TABLA_PLAN + '?select=plan_data&id=eq.' + encodeURIComponent(userId), {
      headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + SUPABASE_ANON_KEY }
    });
    if (!res.ok) return {};
    var data = await res.json();
    return (data && data[0]) ? data[0].plan_data : {};
  } catch (e) {
    return {};
  }
}

async function guardarPlan(plan) {
  var userId = obtenerUserId();
  if (!userId) return;
  try {
    await fetch(SUPABASE_URL + '/rest/v1/' + TABLA_PLAN + '?id=eq.' + encodeURIComponent(userId), {
      method: 'PATCH',
      headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan_data: plan, updated_at: new Date().toISOString() })
    });
  } catch (e) {
    try {
      await fetch(SUPABASE_URL + '/rest/v1/' + TABLA_PLAN, {
        method: 'POST',
        headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + SUPABASE_ANON_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
        body: JSON.stringify({ id: userId, plan_data: plan, updated_at: new Date().toISOString() })
      });
    } catch (e2) {}
  }
}

async function planificarReceta(dia, comida, nombreReceta, idReceta) {
  var plan = await obtenerPlan();
  if (!plan[dia]) plan[dia] = {};
  plan[dia][comida] = { nombre: nombreReceta, id: idReceta };
  await guardarPlan(plan);
  renderizarPlan();
}

async function eliminarSlot(dia, comida) {
  var plan = await obtenerPlan();
  if (plan[dia]) {
    delete plan[dia][comida];
    var soloColapsado = Object.keys(plan[dia]).every(function (k) { return k === 'colapsado'; });
    if (soloColapsado) delete plan[dia];
  }
  await guardarPlan(plan);
  renderizarPlan();
}

async function toggleOpcionales(dia) {
  var plan = await obtenerPlan();
  if (!plan[dia]) plan[dia] = {};
  plan[dia].colapsado = !plan[dia].colapsado;
  await guardarPlan(plan);
  renderizarPlan();
}

async function limpiarPlan() {
  if (!confirm('¿Limpiar toda la planificación semanal?')) return;
  await guardarPlan({});
  renderizarPlan();
}

function renderSlotLleno(dia, comida, item, estrella) {
  return '<div class="plan-slot plan-slot-lleno">' +
    '<span class="plan-slot-comida">' + comida + (estrella ? '*' : '') + '</span>' +
    '<a class="plan-slot-nombre" href="receta.html?id=' + item.id + '">' + item.nombre + '</a>' +
    '<button class="plan-slot-eliminar" onclick="eliminarSlot(\'' + dia + '\',\'' + comida + '\')" title="Quitar">✕</button>' +
    '</div>';
}

function renderSlotVacio(dia, comida, estrella) {
  return '<div class="plan-slot plan-slot-vacio" onclick="abrirSelector(\'' + dia + '\',\'' + comida + '\')">' +
    '<span class="plan-slot-comida">' + comida + (estrella ? '*' : '') + '</span>' +
    '<span class="plan-slot-agregar">+ Agregar</span>' +
    '</div>';
}

async function renderizarPlan() {
  var grid = document.getElementById('planificadorGrid');
  if (!grid) return;
  var plan = await obtenerPlan();
  var html = '<div class="plan-dias">';
  DIAS.forEach(function (dia) {
    var info = plan[dia] || {};
    var colapsado = info.colapsado === true;
    html += '<div class="plan-dia">' +
      '<div class="plan-dia-header">' +
      '<span>' + dia + '</span>' +
      '<button class="plan-toggle-btn" onclick="toggleOpcionales(\'' + dia + '\')" title="' + (colapsado ? 'Mostrar opcionales' : 'Ocultar opcionales') + '">' + (colapsado ? '[+]' : '[−]') + '</button>' +
      '</div>';
    SLOTS.forEach(function (s) {
      if (s.fija) {
        html += info[s.comida] ? renderSlotLleno(dia, s.comida, info[s.comida], false) : renderSlotVacio(dia, s.comida, false);
      } else if (info[s.comida]) {
        html += renderSlotLleno(dia, s.comida, info[s.comida], true);
      } else if (!colapsado) {
        html += renderSlotVacio(dia, s.comida, true);
      }
    });
    html += '</div>';
  });
  html += '</div>';
  grid.innerHTML = html;
}

var selectorVisible = false;
var selectorDia = '';
var selectorComida = '';

async function abrirSelector(dia, comida) {
  selectorDia = dia;
  selectorComida = comida;
  var recetas = await obtenerRecetas();
  var overlay = document.getElementById('selectorRecetas');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'selectorRecetas';
    overlay.className = 'modal';
    overlay.onclick = function (e) { if (e.target === this) cerrarSelector(); };
    document.body.appendChild(overlay);
  }
  var html = '<div class="modal-contenido modal-selector-recetas"><button class="modal-cerrar" onclick="cerrarSelector()">✕</button>';
  html += '<h3>Seleccionar receta para ' + dia + ' — ' + comida + '</h3>';
  html += '<div class="selector-lista">';
  recetas.forEach(function (r) {
    html += '<button class="selector-item" onclick="planificarReceta(\'' + dia + '\',\'' + comida + '\',\'' + r.titulo.replace(/'/g, "\\'") + '\',\'' + r.id + '\')">';
    html += '<span class="selector-item-nombre">' + r.titulo + '</span>';
    html += '<span class="selector-item-tipo">' + r.tipo + '</span>';
    html += '</button>';
  });
  html += '</div></div>';
  overlay.innerHTML = html;
  overlay.classList.remove('oculto');
  selectorVisible = true;
}

function cerrarSelector() {
  var overlay = document.getElementById('selectorRecetas');
  if (overlay) overlay.classList.add('oculto');
  selectorVisible = false;
}

document.addEventListener('DOMContentLoaded', async function () {
  await renderizarPlan();
  var btn = document.getElementById('btnLimpiarPlan');
  if (btn) btn.addEventListener('click', async function () { await limpiarPlan(); });
});
