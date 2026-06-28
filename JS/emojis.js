var MAPA_EMOJIS = {
  'alimento': { src: 'alimento.png' },
  'flan': { src: 'flan.png' },
  'panadero': { src: 'panadero.png' },
  'unicornio': { src: 'unicornio.png' },
  'aceite': { src: 'Aceite.png' },
  'batidora': { src: 'Batidora.png' },
  'cafe': { src: 'Cafe.png' },
  'caserola': { src: 'Caserola.png' },
  'cubiertos': { src: 'Cubiertos.png' },
  'cuchillo': { src: 'Cuchillo.png' },
  'espatula': { src: 'Espatula.png' },
  'heladera': { src: 'Heladera.png' },
  'licuadora': { src: 'Licuadora.png' },
  'microondas': { src: 'Microondas.png' },
  'pava': { src: 'Pava.png' },
  'rayador': { src: 'Rayador.png' },
  'sarten': { src: 'Sarten.png' },
  'tabla': { src: 'Tabla.png' },
  'te': { src: 'Te.png' },
  'tostador': { src: 'Tostador.png' }
};

var CATEGORIAS_EMOJIS = [
  { icono: '😀', nombre: 'Caras', emojis: ['😀','😂','🥰','😍','🥲','😋','😥','😢','😭','😱','😡','👨‍🍳','👩‍🍳','🧑‍🍳','👌','✨'] },
  { icono: '🍎', nombre: 'Frutas', emojis: ['🍇','🍈','🍉','🍊','🍋','🍌','🍍','🥭','🍎','🍏','🍐','🍑','🍒','🍓','🫐','🥝','🥥'] },
  { icono: '🥕', nombre: 'Verduras', emojis: ['🍅','🫒','🥑','🍆','🥔','🥕','🌽','🌶️','🫑','🥒','🫜','🍄','🫛','🫚','🌰','🫘','🥜','🧅','🧄','🥦','🥬'] },
  { icono: '🍕', nombre: 'Comidas', emojis: ['🌭','🍕','🍟','🍔','🥓','🥩','🍗','🍖','🧀','🧇','🥞','🥯','🥨','🫓','🥖','🥐','🍞','🥪','🌮','🌯','🫔','🥙','🧆','🥚','🍳','🥘','🍲','🫕','🥣','🥗','🍿','🧈','🧂','🥫','🍱','🍘','🍙','🍚','🍛','🍜','🍝','🍠','🍢','🍣','🍤','🍡','🥟','🥠','🥮','🍥','🦪','🦑','🦐','🦞','🦀','🦴'] },
  { icono: '🧁', nombre: 'Postres', emojis: ['🍧','🍨','🍦','🍯','🍮','🍭','🍬','🍫','🥧','🧁','🍰','🎂','🍪','🍩'] },
  { icono: '☕', nombre: 'Bebidas', emojis: ['☕','🫖','🍵','🍾','🍶','🍷','🍸','🍹','🍺','🍻','🥂','🥃','🫗','🥤','🧋','🧃','🧉','🧊','🥛','🍼'] },
  { icono: '🔪', nombre: 'Cocina', emojis: ['🥄','🍴','🍽️','🔪','🥢','🫙','🔥','💧','❄️','🌡️','⏲️','⌛','⏳','⚖️','🛒','🛍️'] }
];

var LISTA_EMOJIS_MODERNOS = ['alimento','flan','panadero','unicornio','aceite','batidora','cafe','caserola','cubiertos','cuchillo','espatula','heladera','licuadora','microondas','pava','rayador','sarten','tabla','te','tostador'];

function abrirEmojiPopup(textareaId) {
  cerrarEmojiPopup();
  var popup = document.createElement('div');
  popup.className = 'emoji-popup';
  popup.id = 'emojiPopup';
  popup.dataset.textarea = textareaId;

  var html = '<div class="emoji-popup-seccion">';
  html += '<div class="emoji-popup-titulo">Clásicos</div>';
  html += '<div class="emoji-tabs">';
  for (var t = 0; t < CATEGORIAS_EMOJIS.length; t++) {
    var cat = CATEGORIAS_EMOJIS[t];
    html += '<button class="emoji-tab' + (t === 0 ? ' activo' : '') + '" data-tab="' + t + '">' + cat.icono + ' ' + cat.nombre + '</button>';
  }
  html += '</div>';

  for (var t2 = 0; t2 < CATEGORIAS_EMOJIS.length; t2++) {
    var cat2 = CATEGORIAS_EMOJIS[t2];
    html += '<div class="emoji-grid' + (t2 === 0 ? ' activo' : '') + '" data-grid="' + t2 + '">';
    for (var e = 0; e < cat2.emojis.length; e++) {
      html += '<button class="emoji-opcion" data-emoji="' + cat2.emojis[e] + '">' + cat2.emojis[e] + '</button>';
    }
    html += '</div>';
  }
  html += '</div>';

  html += '<div class="emoji-popup-seccion">';
  html += '<div class="emoji-popup-titulo">Modernos</div>';
  html += '<div style="display:flex;flex-wrap:wrap;gap:2px;">';
  for (var j = 0; j < LISTA_EMOJIS_MODERNOS.length; j++) {
    var cod = LISTA_EMOJIS_MODERNOS[j];
    html += '<button class="emoji-opcion" data-emoji="' + cod + '">' +
      '<img src="Imagenes/Emojis/' + MAPA_EMOJIS[cod].src + '" class="emoji-img">' +
    '</button>';
  }
  html += '</div></div>';

  popup.innerHTML = html;
  document.body.appendChild(popup);

  popup.addEventListener('click', function (e) {
    var btn = e.target.closest('.emoji-tab');
    if (btn) {
      var idx = btn.dataset.tab;
      var tabs = popup.querySelectorAll('.emoji-tab');
      for (var ti = 0; ti < tabs.length; ti++) tabs[ti].classList.remove('activo');
      btn.classList.add('activo');
      var grids = popup.querySelectorAll('.emoji-grid');
      for (var gi = 0; gi < grids.length; gi++) grids[gi].classList.remove('activo');
      var target = popup.querySelector('.emoji-grid[data-grid="' + idx + '"]');
      if (target) target.classList.add('activo');
      return;
    }
    var op = e.target.closest('.emoji-opcion');
    if (!op) return;
    insertarEmoji(textareaId, op.dataset.emoji);
  });

  setTimeout(function () {
    document.addEventListener('click', cerrarEmojiPopup);
  }, 0);
}

function cerrarEmojiPopup() {
  var popup = document.getElementById('emojiPopup');
  if (popup) popup.remove();
  document.removeEventListener('click', cerrarEmojiPopup);
}

function insertarEmoji(textareaId, valor) {
  var ta = document.getElementById(textareaId);
  if (!ta) return;
  if (MAPA_EMOJIS[valor]) {
    formatearTexto(ta, ':' + valor + ':', '');
  } else {
    formatearTexto(ta, valor, '');
  }
  cerrarEmojiPopup();
}