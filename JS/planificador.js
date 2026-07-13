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

async function obtenerPlan() {
  var sesion = obtenerSesion();
  if (sesion) {
    try {
      var res = await fetch(SUPABASE_URL + '/rest/v1/' + TABLA_PLAN + '?select=plan_data&id=eq.' + encodeURIComponent(sesion.userId), {
        headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + SUPABASE_ANON_KEY }
      });
      if (!res.ok) {
        var texto = await res.text();
        console.warn('obtenerPlan error ' + res.status + ': ' + texto.slice(0, 200));
        return {};
      }
      var data = await res.json();
      return (data && data[0]) ? data[0].plan_data : {};
    } catch (e) {
      console.warn('obtenerPlan exception', e);
      return {};
    }
  }
  try {
    var raw = localStorage.getItem(CLAVE_PLAN);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

async function guardarPlan(plan) {
  var sesion = obtenerSesion();
  if (sesion) {
    try {
      var res = await fetch(SUPABASE_URL + '/rest/v1/' + TABLA_PLAN, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({ id: sesion.userId, plan_data: plan, updated_at: new Date().toISOString() })
      });
      if (!res.ok) {
        var texto = await res.text();
        console.warn('guardarPlan error ' + res.status + ': ' + texto.slice(0, 200));
      }
    } catch (e) {
      console.warn('guardarPlan exception', e);
    }
  } else {
    try {
      localStorage.setItem(CLAVE_PLAN, JSON.stringify(plan));
    } catch (e) {
      console.warn('guardarPlan local exception', e);
    }
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
  plan[dia].colapsado = plan[dia].colapsado === undefined ? false : !plan[dia].colapsado;
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
    var colapsado = info.colapsado === undefined ? true : info.colapsado;
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
  window._selectorRecetas = await obtenerRecetas();
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
  html += '<div class="selector-filtros">';
  html += '<input type="text" id="selectorBusqueda" class="selector-input" placeholder="Buscar receta...">';
  html += '<select id="selectorFiltroTipo" class="selector-select"><option value="Todos">Todos los momentos</option><option value="Desayuno">Desayuno</option><option value="Almuerzo">Almuerzo</option><option value="Cena">Cena</option><option value="Media Tarde">Media Tarde</option><option value="Indefinido">Indefinido</option></select>';
  html += '<select id="selectorFiltroDieta" class="selector-select"><option value="Todas">Todas las dietas</option><option value="">Ninguna</option><option value="Diabéticos">Diabéticos</option><option value="Celíacos">Celíacos</option><option value="Veganos">Veganos</option><option value="Vegetarianos">Vegetarianos</option></select>';
  html += '</div>';
  html += '<div class="selector-lista" id="selectorListaRecetas"></div></div>';
  overlay.innerHTML = html;
  overlay.classList.remove('oculto');
  selectorVisible = true;
  document.getElementById('selectorBusqueda').addEventListener('input', renderizarSelectorLista);
  document.getElementById('selectorFiltroTipo').addEventListener('change', renderizarSelectorLista);
  document.getElementById('selectorFiltroDieta').addEventListener('change', renderizarSelectorLista);
  renderizarSelectorLista();
}

function renderizarSelectorLista() {
  var recetas = window._selectorRecetas || [];
  var busqueda = (document.getElementById('selectorBusqueda').value || '').toLowerCase();
  var filtroTipo = document.getElementById('selectorFiltroTipo').value;
  var filtroDieta = document.getElementById('selectorFiltroDieta').value;
  var filtradas = recetas.filter(function (r) {
    var porBusqueda = !busqueda || r.titulo.toLowerCase().indexOf(busqueda) !== -1;
    var porTipo = filtroTipo === 'Todos' || r.tipo === filtroTipo;
    var porDieta = filtroDieta === 'Todas' || (filtroDieta === '' ? !r.dieta : r.dieta === filtroDieta);
    return porBusqueda && porTipo && porDieta;
  });
  var contenedor = document.getElementById('selectorListaRecetas');
  if (!contenedor) return;
  if (!filtradas.length) {
    contenedor.innerHTML = '<p style="text-align:center;padding:2rem;color:var(--texto-suave);">No hay recetas que coincidan.</p>';
    return;
  }
  contenedor.innerHTML = filtradas.map(function (r) {
    return '<button class="selector-item" data-dia="' + selectorDia + '" data-comida="' + selectorComida + '" data-id="' + r.id + '" data-titulo="' + r.titulo.replace(/"/g, '&quot;') + '">' +
      '<span class="selector-item-nombre">' + r.titulo + '</span>' +
      '<span class="selector-item-tipo">' + r.tipo + '</span>' +
      '</button>';
  }).join('');
}

document.addEventListener('click', async function (e) {
  var btn = e.target.closest('.selector-item');
  if (!btn) return;
  var dia = btn.dataset.dia;
  var comida = btn.dataset.comida;
  var nombre = btn.dataset.titulo;
  var id = btn.dataset.id;
  if (dia && comida && nombre && id) {
    await planificarReceta(dia, comida, nombre, id);
    cerrarSelector();
  }
});

function cerrarSelector() {
  var overlay = document.getElementById('selectorRecetas');
  if (overlay) overlay.classList.add('oculto');
  selectorVisible = false;
}

function actualizarCalendario() {
  var hoy = new Date();
  var meses = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
  var badge = document.getElementById('calendarioBadge');
  if (badge) {
    badge.querySelector('.cal-mes').textContent = meses[hoy.getMonth()];
    badge.querySelector('.cal-dia').textContent = hoy.getDate();
  }
  var maniana = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);
  setTimeout(actualizarCalendario, maniana - hoy);
}

function abrirListaCompras() {
  var modal = document.getElementById('modalListaCompras');
  if (!modal) return;
  modal.classList.remove('oculto');
  var resultado = document.getElementById('listaComprasResultado');
  resultado.innerHTML = '<p class="ayuda">Cargando...</p>';
  obtenerPlan().then(function (plan) {
    var idsEnPlan = [];
    Object.keys(plan).forEach(function (dia) {
      Object.keys(plan[dia]).forEach(function (comida) {
        if (comida !== 'colapsado' && plan[dia][comida] && plan[dia][comida].id) {
          idsEnPlan.push(plan[dia][comida].id);
        }
      });
    });
    if (!idsEnPlan.length) {
      resultado.innerHTML = '<p class="ayuda" style="text-align:center;padding:1rem 0;">No hay recetas en el planificador. Agregá algunas primero.</p>';
      return;
    }
    obtenerRecetas().then(function (recetas) {
      var recetasPlan = recetas.filter(function (r) { return idsEnPlan.indexOf(r.id) !== -1; });
      if (!recetasPlan.length) {
        resultado.innerHTML = '<p class="ayuda" style="text-align:center;padding:1rem 0;">No se encontraron las recetas del plan.</p>';
        return;
      }
      var grupos = {};
      function normFrac(s) {
        return s.replace(/½/g,'1/2').replace(/¼/g,'1/4').replace(/¾/g,'3/4');
      }
      recetasPlan.forEach(function (r) {
        (r.preparaciones || []).forEach(function (p) {
          (p.ingredientes || []).forEach(function (ing) {
            var t = ing.trim();
            if (!t) return;
            var partes = t.split(',').map(function(s){return s.trim();}).filter(Boolean);
            partes.forEach(function(parte) {
              var s = normFrac(parte);
              s = s.replace(/([a-zA-Záéíóúñ])\.(?=\s|$)/g, '$1');
              var cantidad = 0;
              var resto = s;
              var m = s.match(/^(\d+)\s+(\d+)\s*\/\s*(\d+)/);
              if (m) { cantidad = parseInt(m[1]) + parseInt(m[2])/parseInt(m[3]); resto = s.slice(m[0].length); }
              else { m = s.match(/^(\d+)\s*\/\s*(\d+)/); if (m) { cantidad = parseInt(m[1])/parseInt(m[2]); resto = s.slice(m[0].length); } }
              resto = resto.trim();
              var uMatch = resto.match(/^([a-zA-Záéíóúñ]+)\s+/);
              var unidad = '';
              if (uMatch && ['g','gr','kg','ml','cc','l','cda','cdita','cdta','taza','tazas','pizca','puñado','cucharada','cucharadita','vaso','diente','dientes'].indexOf(uMatch[1].toLowerCase()) !== -1) {
                unidad = uMatch[1]; resto = resto.slice(uMatch[0].length).trim();
              }
              var nombreDisplay = resto.trim();
              var key = resto.replace(/^de\s+(la\s+|los\s+|las\s+)?/i, '').trim().toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/[.,;!?]+$/g, '').trim().replace(/s$/, '');
              if (!key) return;
              if (!grupos[key]) grupos[key] = { total: 0, unidad: unidad, nombre: nombreDisplay };
              grupos[key].total += cantidad;
              if (!grupos[key].unidad && unidad) grupos[key].unidad = unidad;
            });
          });
        });
      });
      var lineas = [];
      Object.keys(grupos).sort().forEach(function (key) {
        var g = grupos[key];
        if (g.total > 0) {
          var totalStr = Number.isInteger(g.total) ? g.total.toString() : g.total.toFixed(2).replace(/\.?0+$/,'');
          var arr = [totalStr];
          if (g.unidad) arr.push(g.unidad);
          arr.push(g.nombre);
          lineas.push(arr.join(' '));
        } else {
          lineas.push(g.nombre);
        }
      });
      var html = '<h4>🧾 Ingredientes</h4><ul>';
      html += lineas.map(function (i) { return '<li>' + i + '</li>'; }).join('');
      html += '</ul>';
      resultado.innerHTML = html;
    });
  });
}

function cerrarListaCompras() {
  var modal = document.getElementById('modalListaCompras');
  if (modal) modal.classList.add('oculto');
}

document.addEventListener('DOMContentLoaded', async function () {
  actualizarCalendario();
  await renderizarPlan();
  var btn = document.getElementById('btnLimpiarPlan');
  if (btn) btn.addEventListener('click', async function () { await limpiarPlan(); });
  var btnLista = document.getElementById('btnListaCompras');
  if (btnLista) btnLista.addEventListener('click', abrirListaCompras);

});
