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

var LISTA_EMOJIS_CLASICOS = [
  '😀','😂','🥰','😍','🥲','😋','😥','😢','😭','😱','😡',
  '🍇','🍈','🍉','🍊','🍋','🍋‍🟩','🍌','🍍','🥭','🍎','🍏','🍐','🍑','🍒','🍓','🫐','🥝',
  '🍅','🫒','🥥','🥑','🍆','🥔','🥕','🌽','🌶️','🫑','🥒',
  '🌭','🍕','🍟','🍔','🥓','🥩','🍗','🍖','🧀','🧇','🥞','🥯','🥨','🫓','🥖','🥐','🍞',
  '🫜','🍄‍🟫','🫛','🫚','🌰','🫘','🥜','🧅','🧄','🥦','🥬',
  '🥪','🌮','🌯','🫔','🥙','🧆','🥚','🍳','🥘','🍲','🫕','🥣','🥗','🍿','🧈','🧂','🥫',
  '🍱','🍘','🍙','🍚','🍛','🍜','🍝','🍠','🍢','🍣','🍤',
  '☕','🥛','🍼','🍯','🍮','🍭','🍬','🍫','🥧','🧁','🍰','🎂','🍪','🍩','🍨','🍧','🍦',
  '🦪','🦑','🦐','🦞','🦀','🥡','🥠','🥟','🍡','🥮','🍥',
  '🫖','🍵','🍾','🍶','🍷','🍸','🍹','🍺','🍻','🥂','🥃','🫗','🥤','🧋','🧃','🧉','🧊',
  '🥢','🍽️','🍴','🥄','🔪','🫙'
];

var LISTA_EMOJIS_MODERNOS = ['alimento','flan','panadero','unicornio','aceite','batidora','cafe','caserola','cubiertos','cuchillo','espatula','heladera','licuadora','microondas','pava','rayador','sarten','tabla','te','tostador'];

function abrirEmojiPopup(textareaId) {
  cerrarEmojiPopup();
  var popup = document.createElement('div');
  popup.className = 'emoji-popup';
  popup.id = 'emojiPopup';
  popup.dataset.textarea = textareaId;

  var html = '';
  html += '<div class="emoji-popup-seccion">';
  html += '<div class="emoji-popup-titulo">Clásicos</div>';
  html += '<div style="display:flex;flex-wrap:wrap;gap:2px;">';
  for (var i = 0; i < LISTA_EMOJIS_CLASICOS.length; i++) {
    html += '<button class="emoji-opcion" data-emoji="' + LISTA_EMOJIS_CLASICOS[i] + '">' + LISTA_EMOJIS_CLASICOS[i] + '</button>';
  }
  html += '</div></div>';

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
    var btn = e.target.closest('.emoji-opcion');
    if (!btn) return;
    insertarEmoji(textareaId, btn.dataset.emoji);
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