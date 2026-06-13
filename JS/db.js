const TABLA_RECETAS = 'recipes';
const TABLA_PLAN = 'meal_plans';

function normalizarReceta(r) {
  return {
    ...r,
    videoUrl: r.videoUrl || r.videourl || '',
    notasPersonales: r.notasPersonales || r.notaspersonales || []
  };
}

function paraDb(r) {
  if (!r) return r;
  var db = {};
  for (var k in r) {
    if (k === 'videoUrl') db.videourl = r.videoUrl || '';
    else if (k === 'notasPersonales') db.notaspersonales = r.notasPersonales || [];
    else if (k !== 'created_at' && k !== 'updated_at') db[k] = r[k];
  }
  db.updated_at = new Date().toISOString();
  return db;
}

async function peticion(url, opts) {
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
    console.warn('Supabase error ' + res.status + ': ' + texto.slice(0, 80));
    throw new Error('Supabase error ' + res.status);
  }
  if (opts && opts.method === 'DELETE') return null;
  return res.json();
}

async function obtenerRecetas() {
  // 1) Intentar Supabase
  try {
    var data = await peticion(SUPABASE_URL + '/rest/v1/' + TABLA_RECETAS + '?select=*&order=created_at.asc');
    if (data && data.length > 0) {
      var norm = data.map(normalizarReceta);
      try { localStorage.setItem(CLAVE_STORAGE, JSON.stringify(norm)); } catch (e) {}
      return norm;
    }
  } catch (e) {
    console.warn('Supabase no disponible, usando respaldo local');
  }

  // 2) Fallback a localStorage
  try {
    var localData = localStorage.getItem(CLAVE_STORAGE);
    if (localData) {
      var recetas = JSON.parse(localData);
      if (recetas && recetas.length) return recetas;
    }
  } catch (e) {}

  // 3) Último recurso: datos por defecto en memoria
  try {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(recetasPorDefecto));
  } catch (e) {}
  return recetasPorDefecto;
}

async function guardarReceta(receta) {
  var db = paraDb(receta);
  delete db.updated_at;
  try {
    await peticion(SUPABASE_URL + '/rest/v1/' + TABLA_RECETAS, {
      method: 'POST',
      body: JSON.stringify(db)
    });
  } catch (e) {
    console.warn('No se pudo guardar en Supabase, dato solo local');
  }
  try {
    var todas = JSON.parse(localStorage.getItem(CLAVE_STORAGE) || '[]');
    todas.push(receta);
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(todas));
  } catch (e) {}
}

async function actualizarReceta(recetaActualizada) {
  try {
    await peticion(SUPABASE_URL + '/rest/v1/' + TABLA_RECETAS + '?id=eq.' + encodeURIComponent(recetaActualizada.id), {
      method: 'PATCH',
      body: JSON.stringify(paraDb(recetaActualizada))
    });
  } catch (e) {
    console.warn('No se pudo actualizar en Supabase, dato solo local');
  }
  try {
    var todas = JSON.parse(localStorage.getItem(CLAVE_STORAGE) || '[]');
    var idx = todas.findIndex(function(r) { return r.id === recetaActualizada.id; });
    if (idx !== -1) todas[idx] = recetaActualizada;
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(todas));
  } catch (e) {}
}

async function eliminarReceta(id) {
  try {
    await peticion(SUPABASE_URL + '/rest/v1/' + TABLA_RECETAS + '?id=eq.' + encodeURIComponent(id), {
      method: 'DELETE'
    });
  } catch (e) {
    console.warn('No se pudo eliminar en Supabase, dato solo local');
  }
  try {
    var todas = JSON.parse(localStorage.getItem(CLAVE_STORAGE) || '[]');
    var filtradas = todas.filter(function(r) { return r.id !== id; });
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(filtradas));
  } catch (e) {}
}

async function obtenerPlan() {
  try {
    var data = await peticion(SUPABASE_URL + '/rest/v1/' + TABLA_PLAN + '?select=plan_data&id=eq.1');
    return (data && data[0]) ? data[0].plan_data : {};
  } catch (e) {
    return {};
  }
}

async function guardarPlan(plan) {
  await peticion(SUPABASE_URL + '/rest/v1/' + TABLA_PLAN + '?id=eq.1', {
    method: 'PATCH',
    body: JSON.stringify({ plan_data: plan, updated_at: new Date().toISOString() })
  });
}
