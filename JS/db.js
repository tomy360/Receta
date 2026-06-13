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
    throw new Error('Supabase error ' + res.status + ': ' + texto);
  }
  if (opts && opts.method === 'DELETE') return null;
  return res.json();
}

async function obtenerRecetas() {
  var data = await peticion(SUPABASE_URL + '/rest/v1/' + TABLA_RECETAS + '?select=*&order=created_at.asc');
  if (data && data.length > 0) return data.map(normalizarReceta);

  try {
    var localData = localStorage.getItem(CLAVE_STORAGE);
    if (localData) {
      var recetas = JSON.parse(localData);
      await peticion(SUPABASE_URL + '/rest/v1/' + TABLA_RECETAS, {
        method: 'POST',
        body: JSON.stringify(recetas.map(paraDb))
      });
      localStorage.removeItem(CLAVE_STORAGE);
      return recetas;
    }
  } catch (e) {}

  var seedData = recetasPorDefecto.map(paraDb);
  await peticion(SUPABASE_URL + '/rest/v1/' + TABLA_RECETAS, {
    method: 'POST',
    body: JSON.stringify(seedData)
  });
  return recetasPorDefecto;
}

async function guardarReceta(receta) {
  var db = paraDb(receta);
  delete db.updated_at;
  await peticion(SUPABASE_URL + '/rest/v1/' + TABLA_RECETAS, {
    method: 'POST',
    body: JSON.stringify(db)
  });
}

async function actualizarReceta(recetaActualizada) {
  await peticion(SUPABASE_URL + '/rest/v1/' + TABLA_RECETAS + '?id=eq.' + encodeURIComponent(recetaActualizada.id), {
    method: 'PATCH',
    body: JSON.stringify(paraDb(recetaActualizada))
  });
}

async function eliminarReceta(id) {
  await peticion(SUPABASE_URL + '/rest/v1/' + TABLA_RECETAS + '?id=eq.' + encodeURIComponent(id), {
    method: 'DELETE'
  });
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
