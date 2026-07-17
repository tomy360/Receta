const TABLA_RECETAS = 'recipes';

function convertirMarkdown(texto) {
  if (!texto) return '';
  var escapado = texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  var conFormato = escapado.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/__(.+?)__/g, '<u>$1</u>');
  if (typeof MAPA_EMOJIS !== 'undefined') {
    conFormato = conFormato.replace(/:(\w+):/g, function (match, codigo) {
      if (MAPA_EMOJIS[codigo]) {
        return '<img src="Imagenes/Emojis/' + MAPA_EMOJIS[codigo].src + '" class="emoji-img" alt=":' + codigo + ':" title=":' + codigo + ':">';
      }
      return match;
    });
  }
  return conFormato.replace(/\n/g, '<br>');
}

function formatearTexto(textarea, antes, despues) {
  var inicio = textarea.selectionStart;
  var fin = textarea.selectionEnd;
  var val = textarea.value;
  var sel = val.substring(inicio, fin);
  textarea.value = val.substring(0, inicio) + antes + sel + despues + val.substring(fin);
  if (sel.length === 0) {
    textarea.selectionStart = inicio + antes.length;
    textarea.selectionEnd = inicio + antes.length;
  } else {
    textarea.selectionStart = inicio;
    textarea.selectionEnd = fin + antes.length + despues.length;
  }
  textarea.focus();
}

const TABLA_PLAN = 'meal_plans';

function normalizarReceta(r) {
  return {
    ...r,
    videoUrl: r.videoUrl || r.videourl || '',
    socialUrl: r.socialUrl || r.socialurl || '',
    dieta: r.dieta || '',
    etiquetas: r.etiquetas || '',
    notasPersonales: r.notasPersonales || r.notaspersonales || []
  };
}

function paraDb(r) {
  if (!r) return r;
  var db = {};
  for (var k in r) {
    if (k === 'videourl' || k === 'socialurl' || k === 'notaspersonales') continue;
    if (k === 'videoUrl') db.videourl = r.videoUrl || '';
    else if (k === 'socialUrl') db.socialurl = r.socialUrl || '';
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

const COLUMNAS_LIVIANAS = 'id,titulo,tipo,imagen,dificultad,tiempo,autor,categorias,dieta,puntuacion,created_at,favorito,descripcion,personas,resenas,etiquetas,porciones';

async function obtenerRecetasLivianas() {
  try {
    var data = await peticion(SUPABASE_URL + '/rest/v1/' + TABLA_RECETAS + '?select=' + encodeURIComponent(COLUMNAS_LIVIANAS) + '&order=created_at.asc');
    if (data && data.length > 0) {
      var norm = data.map(normalizarReceta);
      try { localStorage.setItem(CLAVE_STORAGE + '_livianas', JSON.stringify(norm)); } catch (e) {}
      return norm;
    }
  } catch (e) {
    console.warn('Supabase no disponible, usando respaldo local liviano');
  }
  try {
    var localData = localStorage.getItem(CLAVE_STORAGE + '_livianas');
    if (localData) {
      var recetas = JSON.parse(localData);
      if (recetas && recetas.length) return recetas;
    }
  } catch (e) {}
  return [];
}

async function obtenerRecetaCompleta(id) {
  try {
    var data = await peticion(SUPABASE_URL + '/rest/v1/' + TABLA_RECETAS + '?select=*&id=eq.' + encodeURIComponent(id));
    if (data && data.length > 0) return normalizarReceta(data[0]);
  } catch (e) {
    console.warn('Supabase no disponible para obtener receta completa');
  }
  return null;
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

async function obtenerFavoritos(userId) {
  try {
    var data = await peticion(SUPABASE_URL + '/rest/v1/' + 'favoritos' + '?select=recipe_id&user_id=eq.' + encodeURIComponent(userId));
    return data ? data.map(function (f) { return f.recipe_id; }) : [];
  } catch (e) {
    return [];
  }
}

async function agregarFavorito(userId, recipeId) {
  var id = userId + '-' + recipeId;
  try {
    await peticion(SUPABASE_URL + '/rest/v1/' + 'favoritos', {
      method: 'POST',
      body: JSON.stringify({ id: id, user_id: userId, recipe_id: recipeId })
    });
  } catch (e) {
    if (e.message.indexOf('409') === -1) console.warn('Error al agregar favorito', e);
  }
}

async function quitarFavorito(userId, recipeId) {
  try {
    await peticion(SUPABASE_URL + '/rest/v1/' + 'favoritos' + '?user_id=eq.' + encodeURIComponent(userId) + '&recipe_id=eq.' + encodeURIComponent(recipeId), {
      method: 'DELETE'
    });
  } catch (e) {
    console.warn('Error al quitar favorito', e);
  }
}

async function obtenerPendientes(userId) {
  try {
    var data = await peticion(SUPABASE_URL + '/rest/v1/' + 'recetas_pendientes' + '?select=recipe_id&user_id=eq.' + encodeURIComponent(userId));
    return data ? data.map(function (f) { return f.recipe_id; }) : [];
  } catch (e) {
    return [];
  }
}

async function agregarPendiente(userId, recipeId) {
  var id = userId + '-' + recipeId;
  try {
    await peticion(SUPABASE_URL + '/rest/v1/' + 'recetas_pendientes', {
      method: 'POST',
      body: JSON.stringify({ id: id, user_id: userId, recipe_id: recipeId })
    });
  } catch (e) {
    if (e.message.indexOf('409') === -1) console.warn('Error al agregar pendiente', e);
  }
}

async function quitarPendiente(userId, recipeId) {
  try {
    await peticion(SUPABASE_URL + '/rest/v1/' + 'recetas_pendientes' + '?user_id=eq.' + encodeURIComponent(userId) + '&recipe_id=eq.' + encodeURIComponent(recipeId), {
      method: 'DELETE'
    });
  } catch (e) {
    console.warn('Error al quitar pendiente', e);
  }
}

const CLAVE_FAV_LOCAL = 'recetario-fav-visitante';
const CLAVE_PEND_LOCAL = 'recetario-pend-visitante';

function obtenerFavoritosLocal() {
  try { return JSON.parse(localStorage.getItem(CLAVE_FAV_LOCAL)) || []; } catch (e) { return []; }
}
function agregarFavoritoLocal(id) {
  var favs = obtenerFavoritosLocal();
  if (favs.indexOf(id) === -1) { favs.push(id); localStorage.setItem(CLAVE_FAV_LOCAL, JSON.stringify(favs)); }
}
function quitarFavoritoLocal(id) {
  var favs = obtenerFavoritosLocal();
  var i = favs.indexOf(id);
  if (i !== -1) { favs.splice(i, 1); localStorage.setItem(CLAVE_FAV_LOCAL, JSON.stringify(favs)); }
}
function obtenerPendientesLocal() {
  try { return JSON.parse(localStorage.getItem(CLAVE_PEND_LOCAL)) || []; } catch (e) { return []; }
}
function agregarPendienteLocal(id) {
  var pends = obtenerPendientesLocal();
  if (pends.indexOf(id) === -1) { pends.push(id); localStorage.setItem(CLAVE_PEND_LOCAL, JSON.stringify(pends)); }
}
function quitarPendienteLocal(id) {
  var pends = obtenerPendientesLocal();
  var i = pends.indexOf(id);
  if (i !== -1) { pends.splice(i, 1); localStorage.setItem(CLAVE_PEND_LOCAL, JSON.stringify(pends)); }
}

const CLAVE_FAV_TIPS_LOCAL = 'recetario-fav-tips-visitante';

async function obtenerFavoritosTips(userId) {
  try {
    var data = await peticion(SUPABASE_URL + '/rest/v1/tips_favoritos?select=tip_id&user_id=eq.' + encodeURIComponent(userId));
    return data ? data.map(function (f) { return f.tip_id; }) : [];
  } catch (e) { return []; }
}
async function agregarFavoritoTip(userId, tipId) {
  try {
    await peticion(SUPABASE_URL + '/rest/v1/tips_favoritos', {
      method: 'POST',
      body: JSON.stringify({ id: userId + '-' + tipId, user_id: userId, tip_id: tipId })
    });
  } catch (e) { if (e.message.indexOf('409') === -1) console.warn('Error al agregar favorito tip', e); }
}
async function quitarFavoritoTip(userId, tipId) {
  try {
    await peticion(SUPABASE_URL + '/rest/v1/tips_favoritos?user_id=eq.' + encodeURIComponent(userId) + '&tip_id=eq.' + encodeURIComponent(tipId), { method: 'DELETE' });
  } catch (e) { console.warn('Error al quitar favorito tip', e); }
}
function obtenerFavoritosTipsLocal() {
  try { return JSON.parse(localStorage.getItem(CLAVE_FAV_TIPS_LOCAL)) || []; } catch (e) { return []; }
}
function agregarFavoritoTipLocal(id) {
  var favs = obtenerFavoritosTipsLocal();
  if (favs.indexOf(id) === -1) { favs.push(id); localStorage.setItem(CLAVE_FAV_TIPS_LOCAL, JSON.stringify(favs)); }
}
function quitarFavoritoTipLocal(id) {
  var favs = obtenerFavoritosTipsLocal();
  var i = favs.indexOf(id);
  if (i !== -1) { favs.splice(i, 1); localStorage.setItem(CLAVE_FAV_TIPS_LOCAL, JSON.stringify(favs)); }
}
