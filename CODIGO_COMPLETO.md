# Código Completo — Recetario Local

## `E:\Tomy\Webs\Libro de recetas\package.json`

```json
{
  "name": "recetario-local",
  "private": true,
  "version": "1.0.0"
}
```

---

## `E:\Tomy\Webs\Libro de recetas\CSS\estilo.css` (2419 líneas)

Ver archivo original: `CSS/estilo.css`

---

## `E:\Tomy\Webs\Libro de recetas\JS\supabase.js`

```javascript
const SUPABASE_URL = 'https://dlxvomaccobalfmtaahs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRseHZvbWFjY29iYWxmbXRhYWhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyOTgxMDgsImV4cCI6MjA5Njg3NDEwOH0.Mc1Dtglso81XhByb2Tx1NV04oiIZ-G4_NEh9DOVDiv0';
```

---

## `E:\Tomy\Webs\Libro de recetas\JS\datos.js`

```javascript
const CLAVE_STORAGE = 'recetario_local_recipes_v2';

const recetasPorDefecto = [
  {
    id: '7',
    titulo: 'Pizza Casera de Pepperoni',
    tipo: 'Cena',
    dificultad: 'Media',
    tiempo: '2 horas',
    porciones: 8,
    favorito: false,
    autor: 'Chef Tomi',
    imagen: 'https://images.unsplash.com/photo-1664309688303-ec6625cf4296?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lbWFkZSUyMHBpenphJTIwZG91Z2glMjBzYXVjZXxlbnwxfHx8fDE3ODEyMjUxMjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    descripcion: 'Una pizza clásica y deliciosa. Hacerla desde cero toma tiempo pero el resultado de la masa fresca y la salsa casera vale totalmente la pena.',
    puntuacion: 5.0,
    videoUrl: '',
    resenas: [
      { id: 'r4', usuario: 'Laura M.', puntuacion: 5, comentario: 'La masa queda espectacular, super crujiente por fuera.', fecha: '2024-02-15' }
    ],
    notasPersonales: [],
    preparaciones: [
      {
        nombre: 'La Masa',
        ingredientes: ['500g de harina de fuerza (tipo 00)', '300ml de agua tibia', '7g de levadura seca de panadero', '10g de sal', '20ml de aceite de oliva virgen extra'],
        pasos: ['Mezcla el agua tibia con la levadura y deja reposar 5 minutos.', 'En un bol grande, pon la harina y haz un hueco en el centro. Vierte la mezcla de agua y levadura.', 'Añade el aceite y empieza a mezclar. Cuando empiece a formar una masa, añade la sal.', 'Amasa sobre una superficie enharinada durante unos 10-15 minutos hasta que esté lisa y elástica.', 'Forma una bola, ponla en un bol engrasado, cubre con un paño y deja levar hasta que doble su tamaño (aprox. 1 hora).']
      },
      {
        nombre: 'La Salsa de Tomate',
        ingredientes: ['400g de tomate triturado (o pelati)', '1 diente de ajo muy picado', '1 cucharada de aceite de oliva', '1 cucharadita de orégano seco', 'Sal y una pizca de azúcar (para la acidez)'],
        pasos: ['En un bol, mezcla el tomate triturado con el ajo picado.', 'Añade el aceite de oliva, el orégano, la sal y la pizca de azúcar.', 'Mezcla bien en frío (no hace falta cocinarla, se cocinará en el horno).']
      },
      {
        nombre: 'Montaje y Horneado',
        ingredientes: ['250g de queso mozzarella rallado (o fresca escurrida)', '100g de pepperoni en rodajas', 'Hojas de albahaca fresca (opcional)'],
        pasos: ['Precalienta el horno al máximo que permita (250-300°C), con la bandeja dentro.', 'Divide la masa en dos o tres porciones y estírala con las manos.', 'Esparce una capa fina de salsa de tomate sobre la masa.', 'Añade una capa generosa de mozzarella y distribuye el pepperoni.', 'Hornea 8-12 minutos hasta que los bordes estén dorados.', 'Saca del horno, añade albahaca fresca si lo deseas, y corta en porciones.']
      }
    ]
  },
  {
    id: '1',
    titulo: 'Tostada de Aguacate y Huevo',
    tipo: 'Desayuno',
    dificultad: 'Fácil',
    tiempo: '15 min',
    porciones: 2,
    favorito: false,
    imagen: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVha2Zhc3QlMjBhdm9jYWRvJTIwdG9hc3R8ZW58MXx8fHwxNzgxMjI0ODA5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    descripcion: 'Una deliciosa y saludable opción para empezar el día con energía.',
    puntuacion: 4.8,
    videoUrl: '',
    resenas: [],
    notasPersonales: [],
    preparaciones: [{
      nombre: 'Principal',
      ingredientes: ['2 rebanadas de pan integral', '1 aguacate maduro', '2 huevos', 'Sal y pimienta al gusto', 'Chorrito de aceite de oliva'],
      pasos: ['Tuesta las rebanadas de pan.', 'Abre el aguacate, retira el hueso y machaca la pulpa.', 'Prepara los huevos al gusto.', 'Unta el aguacate sobre las tostadas y coloca los huevos encima.']
    }]
  },
  {
    id: '2',
    titulo: 'Pasta al Pesto Casero',
    tipo: 'Almuerzo',
    dificultad: 'Media',
    tiempo: '30 min',
    porciones: 4,
    favorito: false,
    imagen: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGx1bmNofGVufDF8fHx8MTc4MTIyNDgwOXww&ixlib=rb-4.1.0&q=80&w=1080',
    descripcion: 'Clásica pasta italiana con una salsa pesto fresca hecha en casa.',
    puntuacion: 4.6,
    videoUrl: '',
    resenas: [],
    notasPersonales: [],
    preparaciones: [
      {
        nombre: 'Salsa Pesto',
        ingredientes: ['2 tazas de hojas de albahaca fresca', '1/2 taza de queso parmesano rallado', '1/3 taza de piñones o nueces', '2 dientes de ajo', '1/2 taza de aceite de oliva virgen extra'],
        pasos: ['Tuesta ligeramente los piñones en un sartén sin aceite.', 'En un procesador, añade la albahaca, piñones, ajo y parmesano. Tritura.', 'Añade lentamente el aceite de oliva hasta conseguir una emulsión.']
      },
      {
        nombre: 'La Pasta',
        ingredientes: ['400g de tu pasta favorita', 'Sal para el agua', 'Queso extra para decorar'],
        pasos: ['Hierve agua con abundante sal y cocina la pasta según el paquete.', 'Escurre la pasta guardando un poco del agua de cocción.', 'Mezcla la pasta con el pesto, añadiendo agua de cocción si es necesario.']
      }
    ]
  }
];
```

---

## `E:\Tomy\Webs\Libro de recetas\JS\db.js`

```javascript
const TABLA_RECETAS = 'recipes';
const TABLA_PLAN = 'meal_plans';

function normalizarReceta(r) {
  return { ...r, videoUrl: r.videoUrl || r.videourl || '', notasPersonales: r.notasPersonales || r.notaspersonales || [] };
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
  try {
    var data = await peticion(SUPABASE_URL + '/rest/v1/' + TABLA_RECETAS + '?select=*&order=created_at.asc');
    if (data && data.length > 0) {
      var norm = data.map(normalizarReceta);
      try { localStorage.setItem(CLAVE_STORAGE, JSON.stringify(norm)); } catch (e) {}
      return norm;
    }
  } catch (e) { console.warn('Supabase no disponible, usando respaldo local'); }
  try {
    var localData = localStorage.getItem(CLAVE_STORAGE);
    if (localData) { var recetas = JSON.parse(localData); if (recetas && recetas.length) return recetas; }
  } catch (e) {}
  try { localStorage.setItem(CLAVE_STORAGE, JSON.stringify(recetasPorDefecto)); } catch (e) {}
  return recetasPorDefecto;
}

async function guardarReceta(receta) {
  var db = paraDb(receta); delete db.updated_at;
  try { await peticion(SUPABASE_URL + '/rest/v1/' + TABLA_RECETAS, { method: 'POST', body: JSON.stringify(db) }); }
  catch (e) { console.warn('No se pudo guardar en Supabase, dato solo local'); }
  try { var todas = JSON.parse(localStorage.getItem(CLAVE_STORAGE) || '[]'); todas.push(receta); localStorage.setItem(CLAVE_STORAGE, JSON.stringify(todas)); } catch (e) {}
}

async function actualizarReceta(recetaActualizada) {
  try { await peticion(SUPABASE_URL + '/rest/v1/' + TABLA_RECETAS + '?id=eq.' + encodeURIComponent(recetaActualizada.id), { method: 'PATCH', body: JSON.stringify(paraDb(recetaActualizada)) }); }
  catch (e) { console.warn('No se pudo actualizar en Supabase, dato solo local'); }
  try {
    var todas = JSON.parse(localStorage.getItem(CLAVE_STORAGE) || '[]');
    var idx = todas.findIndex(function(r) { return r.id === recetaActualizada.id; });
    if (idx !== -1) todas[idx] = recetaActualizada;
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(todas));
  } catch (e) {}
}

async function eliminarReceta(id) {
  try { await peticion(SUPABASE_URL + '/rest/v1/' + TABLA_RECETAS + '?id=eq.' + encodeURIComponent(id), { method: 'DELETE' }); }
  catch (e) { console.warn('No se pudo eliminar en Supabase, dato solo local'); }
  try {
    var todas = JSON.parse(localStorage.getItem(CLAVE_STORAGE) || '[]');
    var filtradas = todas.filter(function(r) { return r.id !== id; });
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(filtradas));
  } catch (e) {}
}

async function obtenerPlan() {
  try { var data = await peticion(SUPABASE_URL + '/rest/v1/' + TABLA_PLAN + '?select=plan_data&id=eq.1'); return (data && data[0]) ? data[0].plan_data : {}; }
  catch (e) { return {}; }
}

async function guardarPlan(plan) {
  await peticion(SUPABASE_URL + '/rest/v1/' + TABLA_PLAN + '?id=eq.1', { method: 'PATCH', body: JSON.stringify({ plan_data: plan, updated_at: new Date().toISOString() }) });
}
```

---

## `E:\Tomy\Webs\Libro de recetas\JS\timer.js`

```javascript
var timerInterval = null;
var timerSegundos = 0;
var timerTotal = 0;
var timerCorriendo = false;

function formatTimer(s) {
  var m = Math.floor(s / 60);
  var seg = s % 60;
  return (m < 10 ? '0' : '') + m + ':' + (seg < 10 ? '0' : '') + seg;
}

function abrirTimer(tiempoPreset) {
  cerrarTimer();
  var modal = document.getElementById('modalTimer');
  if (!modal) return;
  modal.classList.remove('oculto');
  var partes = tiempoPreset ? tiempoPreset.match(/(\d+)/) : null;
  timerSegundos = partes ? parseInt(partes[1], 10) * 60 : 600;
  timerTotal = timerSegundos;
  timerCorriendo = false;
  actualizarTimerUI();
}

function cerrarTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  var modal = document.getElementById('modalTimer');
  if (modal) modal.classList.add('oculto');
  timerCorriendo = false;
}

function toggleTimer() { timerCorriendo ? pausarTimer() : iniciarTimer(); }

function iniciarTimer() {
  if (timerSegundos <= 0) return;
  timerCorriendo = true;
  document.getElementById('timerBoton').textContent = '⏸';
  timerInterval = setInterval(function () {
    timerSegundos--;
    if (timerSegundos <= 0) { timerSegundos = 0; pausarTimer(); document.getElementById('timerAlarma').style.display = 'block'; }
    actualizarTimerUI();
  }, 1000);
}

function pausarTimer() {
  timerCorriendo = false;
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  document.getElementById('timerBoton').textContent = '▶';
}

function reiniciarTimer() { pausarTimer(); timerSegundos = timerTotal; document.getElementById('timerAlarma').style.display = 'none'; actualizarTimerUI(); }

function actualizarTimerUI() {
  var display = document.getElementById('timerDisplay');
  if (display) display.textContent = formatTimer(timerSegundos);
  var barra = document.getElementById('timerBarra');
  if (barra && timerTotal > 0) barra.style.width = ((timerSegundos / timerTotal) * 100) + '%';
}
```

---

## `E:\Tomy\Webs\Libro de recetas\JS\recetas.js`

```javascript
const tipos = ['Todos', 'Desayuno', 'Almuerzo', 'Cena', 'Postre', 'Snack', 'Media Tarde'];
const dificultades = ['Todas', 'Fácil', 'Media', 'Difícil'];
const tiempos = ['Cualquiera', '≤ 15 min', '≤ 30 min', '≤ 60 min', '> 60 min'];
const porcionesOpts = ['Cualquiera', '1', '2', '4', '6', '8+'];
const puntuaciones = ['Cualquiera', '4+ ★', '3+ ★', '2+ ★', '1+ ★'];
const favoritosOpts = ['Todos', 'Favoritos'];

let recetas = [];
let filtroTipo = 'Todos';
let filtroDificultad = 'Todas';
let filtroTiempo = 'Cualquiera';
let filtroPorciones = 'Cualquiera';
let filtroPuntuacion = 'Cualquiera';
let filtroFavorito = 'Todos';
let filtroAutor = 'Todos';
let busqueda = '';
let filtroCategoria = 'Todas';

function parseTiempoAMinutos(str) {
  if (!str) return Infinity;
  let total = 0;
  const h = str.match(/(\d+)\s*hora/i);
  if (h) total += parseInt(h[1]) * 60;
  const m = str.match(/(\d+)\s*min/i);
  if (m) total += parseInt(m[1]);
  return total || Infinity;
}

async function init() {
  try { recetas = await obtenerRecetas(); } catch (e) { console.error('Error al cargar recetas:', e); recetas = []; }
  const params = new URLSearchParams(window.location.search);
  filtroTipo = params.get('tipo') || 'Todos';
  const buscador = document.getElementById('buscador');
  const panelFiltros = document.getElementById('panelFiltros');
  const btnFiltros = document.getElementById('btnFiltros');
  const btnCerrarFiltros = document.getElementById('btnCerrarFiltros');
  if (buscador) {
    var timeoutBusqueda;
    buscador.addEventListener('input', function () {
      clearTimeout(timeoutBusqueda);
      var self = this;
      timeoutBusqueda = setTimeout(function () { busqueda = self.value.trim(); renderizar(); }, 200);
    });
  }
  if (btnFiltros) { btnFiltros.addEventListener('click', function () { panelFiltros.classList.toggle('visible'); btnFiltros.classList.toggle('activo'); }); }
  if (btnCerrarFiltros) { btnCerrarFiltros.addEventListener('click', function () { panelFiltros.classList.remove('visible'); btnFiltros.classList.remove('activo'); }); }
  panelFiltros.addEventListener('click', function (e) { var header = e.target.closest('.filtro-header'); if (header) header.parentElement.classList.toggle('plegado'); });
  renderizarFiltrosTipo(); renderizarFiltrosDificultad(); renderizarFiltrosTiempo();
  renderizarFiltrosPorciones(); renderizarFiltrosPuntuacion(); renderizarFiltrosFavorito();
  renderizarFiltrosAutor(); renderizarFiltrosCategorias(); renderizar();
}

function renderizarFiltrosTipo() { /* tipos buttons */ }
function renderizarFiltrosDificultad() { /* dificultad buttons */ }
function renderizarFiltrosTiempo() { /* tiempo buttons */ }
function renderizarFiltrosPorciones() { /* porciones buttons */ }
function renderizarFiltrosPuntuacion() { /* puntuacion buttons */ }
function renderizarFiltrosFavorito() { /* favorito buttons */ }
function renderizarFiltrosCategorias() { /* categorias buttons */ }
function renderizarFiltrosAutor() { /* autor buttons */ }

function recetasFiltradas() {
  return recetas.filter(r => {
    const porTipo = filtroTipo === 'Todos' || r.tipo === filtroTipo;
    const porDificultad = filtroDificultad === 'Todas' || r.dificultad === filtroDificultad;
    const minutos = parseTiempoAMinutos(r.tiempo);
    const porTiempo = filtroTiempo === 'Cualquiera' || (filtroTiempo === '≤ 15 min' && minutos <= 15) || (filtroTiempo === '≤ 30 min' && minutos <= 30) || (filtroTiempo === '≤ 60 min' && minutos <= 60) || (filtroTiempo === '> 60 min' && minutos > 60);
    const p = r.porciones || 0;
    const porPorciones = filtroPorciones === 'Cualquiera' || (filtroPorciones === '8+' && p >= 8) || (filtroPorciones !== '8+' && p === parseInt(filtroPorciones));
    const punt = r.puntuacion || 0;
    const porPuntuacion = filtroPuntuacion === 'Cualquiera' || (filtroPuntuacion === '4+ ★' && punt >= 4) || (filtroPuntuacion === '3+ ★' && punt >= 3) || (filtroPuntuacion === '2+ ★' && punt >= 2) || (filtroPuntuacion === '1+ ★' && punt >= 1);
    const porFavorito = filtroFavorito === 'Todos' || (filtroFavorito === 'Favoritos' && r.favorito);
    var categoriasReceta = r.categorias ? r.categorias.split(',').map(function(c) { return c.trim(); }) : [];
    const porCategoria = filtroCategoria === 'Todas' || categoriasReceta.indexOf(filtroCategoria) !== -1;
    const porAutor = filtroAutor === 'Todos' || (r.autor || 'Anónimo') === filtroAutor;
    const porBusqueda = busqueda === '' || r.titulo.toLowerCase().includes(busqueda.toLowerCase()) || r.preparaciones.some(p => p.ingredientes.some(i => i.toLowerCase().includes(busqueda.toLowerCase())));
    return porTipo && porDificultad && porTiempo && porPorciones && porPuntuacion && porFavorito && porCategoria && porAutor && porBusqueda;
  });
}

function renderizar() {
  const grid = document.getElementById('gridRecetas');
  const sinResultados = document.getElementById('sinResultados');
  if (!grid) return;
  const filtradas = recetasFiltradas();
  if (filtradas.length === 0) { grid.innerHTML = ''; sinResultados.classList.remove('oculto'); return; }
  sinResultados.classList.add('oculto');
  grid.innerHTML = filtradas.map(r => crearTarjeta(r)).join('');
}

document.addEventListener('click', async function (e) {
  var btn = e.target.closest('.card-fav-btn');
  if (btn) { e.preventDefault(); await toggleFavorito(btn.dataset.id); return; }
});

async function toggleFavorito(id) {
  var todas = await obtenerRecetas();
  var r = todas.find(function (r) { return r.id === id; });
  if (!r) return;
  r.favorito = !r.favorito;
  await actualizarReceta(r);
  recetas = await obtenerRecetas();
  renderizar();
}

function crearTarjeta(r) {
  const estrellas = '★'.repeat(Math.round(r.puntuacion));
  const estrellaVacia = '☆'.repeat(5 - Math.round(r.puntuacion));
  const favClase = r.favorito ? ' card-fav-activo' : '';
  return '<div class="tarjeta"><button class="card-fav-btn' + favClase + '" data-id="' + r.id + '" title="' + (r.favorito ? 'Quitar de favoritos' : 'Añadir a favoritos') + '">' + (r.favorito ? '❤️' : '🤍') + '</button><a href="receta.html?id=' + r.id + '"><div class="tarjeta-imagen" style="background-image:url(\'' + r.imagen + '\')"><span class="tarjeta-tipo">' + r.tipo + '</span></div><div class="tarjeta-info"><div class="tarjeta-puntuacion"><span class="estrella">' + estrellas + estrellaVacia + '</span><span>' + r.puntuacion + '</span><span class="resenas-count">(' + r.resenas.length + ' reseñas)</span></div><h3 class="tarjeta-titulo">' + r.titulo + '</h3><p class="tarjeta-descripcion">' + r.descripcion + '</p><div class="tarjeta-autor">✍️ ' + (r.autor || 'Anónimo') + '</div><div class="tarjeta-footer"><span><span class="icono">🕐</span> ' + r.tiempo + '</span><span><span class="icono">📊</span> ' + r.dificultad + '</span><span><span class="icono">👥</span> ' + (r.personas || r.porciones || '—') + ' pers.</span></div></div></a></div>';
}

function limpiarFiltros() { /* resetea filtros y renderiza */ }

function recetaAleatoria() {
  var disponibles = recetasFiltradas();
  if (!disponibles.length) return;
  var elegida = disponibles[Math.floor(Math.random() * disponibles.length)];
  var sugerencia = document.getElementById('sugerenciaAleatoria');
  var link = document.getElementById('sugerenciaLink');
  if (sugerencia && link) { link.textContent = elegida.titulo; link.href = 'receta.html?id=' + elegida.id; sugerencia.classList.remove('oculto'); }
}

document.addEventListener('click', function (e) {
  if (e.target.closest('#btnAleatorio')) { e.preventDefault(); recetaAleatoria(); }
  if (e.target.closest('#sugerenciaCerrar')) { e.preventDefault(); document.getElementById('sugerenciaAleatoria').classList.add('oculto'); }
});

document.addEventListener('DOMContentLoaded', init);
```

---

## `E:\Tomy\Webs\Libro de recetas\JS\detalle-receta.js` (883 líneas)

```javascript
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
let nombreUsuario = localStorage.getItem('recetario-nombre-usuario') || '';

function generarVideoHtml(url) {
  if (!url) return '';
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url) || url.startsWith('./') || url.startsWith('../')) {
    return '<div class="detalle-video"><video src="' + url + '" controls style="width:100%;border-radius:0.75rem;"></video></div>';
  }
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (ytMatch) {
    return '<div class="detalle-video"><iframe src="https://www.youtube.com/embed/' + ytMatch[1] + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%;aspect-ratio:16/9;border-radius:0.75rem;"></iframe></div>';
  }
  // redes sociales: instagram, tiktok, facebook, x/twitter
  let icono = '🔗', nombre = 'Ver video', color = '#6b7280', colorBtn = '#4b5563';
  if (url.includes('instagram.com')) { icono='📸'; nombre='Ver en Instagram'; color='#e1306c'; colorBtn='#c13584'; }
  else if (url.includes('tiktok.com')) { icono='🎵'; nombre='Ver en TikTok'; color='#010101'; colorBtn='#fe2c55'; }
  else if (url.includes('facebook.com')||url.includes('fb.watch')) { icono='📘'; nombre='Ver en Facebook'; color='#1877f2'; colorBtn='#0d6efd'; }
  else if (url.includes('x.com')||url.includes('twitter.com')) { icono='🐦'; nombre='Ver en X / Twitter'; color='#000000'; colorBtn='#333'; }
  return '<div class="detalle-video-externo" style="display:flex;align-items:center;gap:1rem;background:var(--fondo-tarjeta,#f9fafb);border:2px solid ' + color + '33;border-radius:0.75rem;padding:1rem 1.25rem;margin:1rem 0;"><span style="font-size:2rem;">' + icono + '</span><div style="flex:1;"><p style="margin:0;font-size:0.875rem;color:var(--texto-suave,#6b7280);">Video de la receta</p><p style="margin:0.2rem 0 0;font-size:0.8rem;color:var(--texto-suave,#9ca3af);word-break:break-all;">' + (url.length > 50 ? url.slice(0,50)+'…' : url) + '</p></div><a href="' + url + '" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:0.4rem;background:' + colorBtn + ';color:#fff;padding:0.5rem 1rem;border-radius:0.5rem;font-size:0.875rem;font-weight:600;text-decoration:none;white-space:nowrap;">' + nombre + ' ↗</a></div>';
}

async function init() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) { document.getElementById('detalleContenido').innerHTML = '<p style="text-align:center;padding:3rem;color:#6b7280;">Receta no encontrada.</p>'; return; }
  try { var todas = await obtenerRecetas(); receta = todas.find(function (r) { return r.id === id; }); }
  catch (e) { document.getElementById('detalleContenido').innerHTML = '<p style="text-align:center;padding:3rem;color:#6b7280;">Error al cargar la receta.</p>'; return; }
  if (!receta) { document.getElementById('detalleContenido').innerHTML = '<p style="text-align:center;padding:3rem;color:#6b7280;">Receta no encontrada.</p>'; return; }
  renderizarDetalle(); configurarTabs(); configurarNotas(); configurarResenas();
}

function renderizarDetalle() { /* render completo de detalle: datos, tabs, ingredientes por defecto */ }

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
  contenedor.style.opacity = '0';
  setTimeout(function () {
    if (tab === 'ingredientes') renderizarIngredientes(contenedor);
    else if (tab === 'notas') renderizarNotas(contenedor);
    else if (tab === 'resenas') renderizarResenas(contenedor);
    contenedor.style.opacity = '1';
  }, 60);
}

function escalarIngrediente(ing, factor) {
  if (factor === 1) return ing;
  var fracMap = { '½': 0.5, '¼': 0.25, '⅓': 1/3, '⅔': 2/3, '¾': 0.75 };
  var u = '[½¼⅓⅔¾]';
  var re = new RegExp('^(\\d+)\\s*(' + u + ')|^(' + u + ')|^(\\d+)(?:\\s*\\/\\s*(\\d+))?');
  return ing.replace(re, function (match, ent1, uni1, uni2, dig, den) {
    var num;
    if (ent1 !== undefined) num = parseInt(ent1, 10) + fracMap[uni1];
    else if (uni2 !== undefined) num = fracMap[uni2];
    else if (den !== undefined) num = parseInt(dig, 10) / parseInt(den, 10);
    else num = parseInt(dig, 10);
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
  var actual = parseInt(document.getElementById('porcionesValor').textContent, 10) || base;
  var nueva = Math.max(1, actual + delta);
  porcionesEscala = nueva / base;
  document.getElementById('porcionesValor').textContent = nueva;
  renderizarTab(tabActivo);
}

function renderizarIngredientes(contenedor) { /* renderiza ingredientes con secciones */ }
function renderizarNotas(contenedor) { /* notas personales con nombre */ }
function renderizarResenas(contenedor) { /* opiniones con estrellas */ }

// funciones de configuracion de eventos (configurarNotasInput, configurarNotasAcciones, configurarResenasInteractivo, etc.)
// funcion de modo cocina (abrirModoCocina, cerrarModoCocina, renderizarCocinaPaso)
// funciones de compartir, favorito, eliminar

document.addEventListener('DOMContentLoaded', init);
```

---

## `E:\Tomy\Webs\Libro de recetas\JS\agregar-receta.js`

```javascript
let contadorSecciones = 0;
let editandoId = null;

async function init() {
  const params = new URLSearchParams(window.location.search);
  editandoId = params.get('id');
  if (editandoId) {
    try {
      var todas = await obtenerRecetas();
      var receta = todas.find(function (r) { return r.id === editandoId; });
      if (receta) {
        document.querySelector('.form-header h1').textContent = 'Editar Receta';
        document.querySelector('.form-header p').textContent = 'Modifica los datos de tu receta.';
        document.querySelector('.btn-guardar').innerHTML = '✏️ Actualizar Receta';
        cargarReceta(receta);
        return;
      }
    } catch (e) {}
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
  document.getElementById('campoPersonas').value = r.personas || '';
  document.getElementById('campoImagen').value = r.imagen || '';
  document.getElementById('campoVideo').value = r.videoUrl || '';
  document.getElementById('campoCategorias').value = r.categorias || '';
  document.getElementById('campoAutor').value = r.autor || '';
  r.preparaciones.forEach(prep => { agregarSeccion(prep.nombre, prep.ingredientes.join('\n'), prep.pasos.join('\n')); });
}

document.getElementById('btnAgregarSeccion').addEventListener('click', function () { agregarSeccion('', '', ''); });
document.getElementById('formReceta').addEventListener('submit', function (e) { e.preventDefault(); enviarFormulario(); });

function agregarSeccion(nombre, ingredientesTexto, pasosTexto) {
  const contenedor = document.getElementById('seccionesContainer');
  const index = contadorSecciones++;
  const div = document.createElement('div');
  div.className = 'prep-seccion-card';
  div.dataset.index = index;
  let btnEliminarHtml = (contadorSecciones > 1 || editandoId) ? '<button type="button" class="btn-eliminar-seccion" title="Eliminar esta sección">🗑️</button>' : '';
  div.innerHTML = '<div class="prep-seccion-header"><div style="flex:1;margin-right:2rem;"><label style="display:block;font-size:0.875rem;font-weight:500;color:#374151;margin-bottom:0.25rem;">Nombre de la sección</label><input type="text" class="seccion-nombre" value="' + (nombre||'') + '" placeholder="Ej: La Masa, La Salsa..." style="width:100%;padding:0.5rem 1rem;border:1px solid #e5e7eb;border-radius:0.75rem;font-size:0.875rem;outline:none;background:#fff;"></div>' + btnEliminarHtml + '</div><div class="prep-columnas"><div><label>Ingredientes</label><p class="ayuda">Escribe un ingrediente por línea.</p><textarea class="seccion-ingredientes" placeholder="Ej:&#10;500g harina&#10;1 pizca de sal">' + (ingredientesTexto||'') + '</textarea></div><div><label>Pasos de Preparación</label><p class="ayuda">Escribe un paso por línea.</p><textarea class="seccion-pasos" placeholder="Ej:&#10;Mezclar ingredientes.&#10;Amasar.">' + (pasosTexto||'') + '</textarea></div></div>';
  const btnEliminar = div.querySelector('.btn-eliminar-seccion');
  if (btnEliminar) btnEliminar.addEventListener('click', function () { div.remove(); });
  contenedor.appendChild(div);
}

async function enviarFormulario() {
  const titulo = document.getElementById('campoTitulo').value.trim();
  const descripcion = document.getElementById('campoDescripcion').value.trim();
  const tipo = document.getElementById('campoTipo').value;
  const dificultad = document.getElementById('campoDificultad').value;
  const tiempo = document.getElementById('campoTiempo').value.trim();
  const porciones = parseInt(document.getElementById('campoPorciones').value) || 1;
  const personas = parseInt(document.getElementById('campoPersonas').value) || 1;
  let imagen = document.getElementById('campoImagen').value.trim();
  if (!imagen) { imagen = './Imagenes/Recetas/sin-imagen.jpg'; }
  else if (!imagen.startsWith('http://') && !imagen.startsWith('https://') && !imagen.startsWith('./') && !imagen.startsWith('../')) { imagen = './Imagenes/Recetas/' + imagen; }
  const videoUrl = document.getElementById('campoVideo').value.trim();
  const categorias = document.getElementById('campoCategorias').value.trim();
  const autor = document.getElementById('campoAutor').value.trim();
  const errorTitulo = document.getElementById('errorTitulo');
  const errorTiempo = document.getElementById('errorTiempo');
  errorTitulo.textContent = ''; errorTiempo.textContent = '';
  let valido = true;
  if (!titulo) { errorTitulo.textContent = 'El nombre es obligatorio'; valido = false; }
  if (!tiempo) { errorTiempo.textContent = 'Especifica el tiempo'; valido = false; }
  if (!valido) return;
  const secciones = document.querySelectorAll('.prep-seccion-card');
  const preparaciones = [];
  secciones.forEach(sec => {
    const nombre = sec.querySelector('.seccion-nombre').value.trim();
    const ingTexto = sec.querySelector('.seccion-ingredientes').value;
    const pasosTexto = sec.querySelector('.seccion-pasos').value;
    const ingredientes = ingTexto.split('\n').map(i => i.trim()).filter(i => i.length > 0);
    const pasos = pasosTexto.split('\n').map(p => p.trim()).filter(p => p.length > 0);
    preparaciones.push({ nombre: nombre || 'Principal', ingredientes: ingredientes.length ? ingredientes : ['Sin ingredientes'], pasos: pasos.length ? pasos : ['Sin pasos'] });
  });
  if (editandoId) {
    var todas = await obtenerRecetas();
    var existente = todas.find(function (r) { return r.id === editandoId; });
    if (existente) { await actualizarReceta({ ...existente, titulo, descripcion, tipo, dificultad, tiempo, porciones, personas, imagen, videoUrl, categorias, autor, preparaciones }); }
  } else {
    await guardarReceta({ id: Date.now().toString(), titulo, descripcion, tipo, dificultad, tiempo, porciones, personas, imagen, videoUrl, autor, categorias, puntuacion: 0, favorito: false, resenas: [], notasPersonales: [], preparaciones });
  }
  window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', init);
```

---

## `E:\Tomy\Webs\Libro de recetas\JS\consejos.js`

```javascript
var TABLA_TIPS = 'tips';
var editandoTipId = null;

async function peticionTips(url, opts) {
  var res = await fetch(url, {
    headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + SUPABASE_ANON_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
    ...opts
  });
  if (!res.ok) { var texto = await res.text(); throw new Error('Supabase error ' + res.status + ': ' + texto); }
  if (opts && opts.method === 'DELETE') return null;
  return res.json();
}

async function obtenerTips() { try { return await peticionTips(SUPABASE_URL + '/rest/v1/' + TABLA_TIPS + '?select=*&order=created_at.asc'); } catch (e) { return []; } }
async function guardarTip(tip) { await peticionTips(SUPABASE_URL + '/rest/v1/' + TABLA_TIPS, { method: 'POST', body: JSON.stringify(tip) }); }
async function actualizarTip(tip) { await peticionTips(SUPABASE_URL + '/rest/v1/' + TABLA_TIPS + '?id=eq.' + encodeURIComponent(tip.id), { method: 'PATCH', body: JSON.stringify({ titulo: tip.titulo, contenido: tip.contenido, autor: tip.autor }) }); }
async function eliminarTip(id) { await peticionTips(SUPABASE_URL + '/rest/v1/' + TABLA_TIPS + '?id=eq.' + encodeURIComponent(id), { method: 'DELETE' }); }

function mostrarFormularioConsejo(mostrar) { document.getElementById('consejosForm').classList.toggle('oculto', !mostrar); document.getElementById('btnAgregarConsejo').classList.toggle('oculto', mostrar); }
function ocultarFormularioConsejo() {
  mostrarFormularioConsejo(false); editandoTipId = null;
  document.getElementById('campoTituloConsejo').value = '';
  document.getElementById('campoContenidoConsejo').value = '';
  document.getElementById('btnGuardarConsejo').textContent = '💾 Guardar consejo';
  document.getElementById('btnCancelarConsejo').classList.add('oculto');
}

async function initConsejos() {
  var tips = await obtenerTips();
  renderizarConsejos(tips);
  var nombreGuardado = localStorage.getItem('recetario-nombre-usuario') || '';
  var nombreInput = document.getElementById('campoNombreConsejo');
  if (nombreInput) nombreInput.value = nombreGuardado;
  document.getElementById('btnAgregarConsejo').addEventListener('click', function () { document.getElementById('campoNombreConsejo').value = localStorage.getItem('recetario-nombre-usuario') || ''; mostrarFormularioConsejo(true); });
  document.getElementById('btnGuardarConsejo').addEventListener('click', async function () { /* guardar/editar tip */ });
  document.getElementById('btnCancelarConsejo').addEventListener('click', ocultarFormularioConsejo);
  document.getElementById('btnCerrarConsejo').addEventListener('click', ocultarFormularioConsejo);
}

function renderizarConsejos(tips) { /* renderiza grid de consejos */ }
async function editarTip(id) { /* carga datos del tip en el formulario */ }
async function eliminarTipClick(id) { /* confirma y elimina tip */ }

document.addEventListener('DOMContentLoaded', initConsejos);
```

---

## `E:\Tomy\Webs\Libro de recetas\JS\planificador.js`

```javascript
var DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
var SLOTS = [
  { comida: 'Desayuno', fija: true },
  { comida: 'Snack', fija: false },
  { comida: 'Almuerzo', fija: true },
  { comida: 'Snack 2', fija: false },
  { comida: 'Media tarde', fija: true },
  { comida: 'Cena', fija: true },
  { comida: 'Postre', fija: false }
];
var CLAVE_PLAN = 'recetario-plan-semanal';

async function obtenerPlan() { /* fetch plan desde Supabase o {} */ }
async function guardarPlan(plan) { /* PATCH a Supabase */ }
async function planificarReceta(dia, comida, nombreReceta, idReceta) { /* guarda slot */ }
async function eliminarSlot(dia, comida) { /* borra slot */ }
async function toggleOpcionales(dia) { /* colapsa slots opcionales de un dia */ }
async function limpiarPlan() { /* confirma y borra todo */ }
function renderSlotLleno(dia, comida, item, estrella) { /* html slot lleno */ }
function renderSlotVacio(dia, comida, estrella) { /* html slot vacio */ }
async function renderizarPlan() { /* renderiza grid semanal */ }
async function abrirSelector(dia, comida) { /* modal selector de recetas */ }
function cerrarSelector() { /* cierra modal */ }

document.addEventListener('DOMContentLoaded', async function () { await renderizarPlan(); document.getElementById('btnLimpiarPlan').addEventListener('click', async function () { await limpiarPlan(); }); });
```

---

## Archivos HTML

### `index.html` (337 líneas)
- Nav con logo, botones escritorio, dropdown Comidas, hamburger + menú móvil
- Encabezado: título, buscador, botones "¿Qué cocino hoy?" y Filtros
- Sugerencia aleatoria, panel de filtros avanzados, grid de recetas, sin-resultados
- Modal timer, footer, scroll-top button
- Inline scripts: modo noche, hamburger menú

### `receta.html` (319 líneas)
- Nav similar, detalle-contenedor con placeholder de carga
- Timer modal, modo cocina overlay
- Nav flotante de receta (🔍) con menú dinámico de secciones
- Footer, scroll-top
- Inline scripts: nav flotante, modo noche, hamburger menú

### `agregar.html` (330 líneas)
- Nav similar, formulario de receta con secciones dinámicas
- Footer, scroll-top
- Inline scripts: modo noche, hamburger menú

### `consejos.html` (267 líneas)
- Nav similar, encabezado, botón agregar, formulario oculto con botón "✕"
- Grid de consejos, sin-consejos, timer modal
- Footer, scroll-top, inline scripts

### `planificador.html` (220 líneas)
- Nav similar (con bug: double `<a class="nav-logo">`), grid semanal
- Timer modal, footer, scroll-top, inline scripts

## Notas

- Supabase: `supabase.js` expone `SUPABASE_URL` y `SUPABASE_ANON_KEY`
- `defer` en todos los `<script>` de JS
- Cache-busting `?v=2` en todos los scripts
- Sin autenticación (RLS anónimo en Supabase)
- Fallback: Supabase → localStorage → datos por defecto en memoria
- Clave localStorage para recetas: `recetario_local_recipes_v2`
- Clave modo noche: `recetario-modo-noche`
- Clave nombre usuario: `recetario-nombre-usuario`
