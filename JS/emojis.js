var MAPA_EMOJIS = {
  'alimento': { src: 'alimento.png' },
  'flan': { src: 'flan.png' },
  'panadero': { src: 'panadero.png' },
  'unicornio': { src: 'unicornio.png' }
};

var LISTA_EMOJIS = [
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
  '🥢','🍽️','🍴','🥄','🔪','🫙',
  'alimento','flan','panadero','unicornio'
];

function abrirEmojiPopup(textareaId) {
  cerrarEmojiPopup();
  var popup = document.createElement('div');
  popup.className = 'emoji-popup';
  popup.id = 'emojiPopup';
  popup.dataset.textarea = textareaId;
  var html = '<div style="display:flex;flex-wrap:wrap;gap:2px;">';
  for (var i = 0; i < LISTA_EMOJIS.length; i++) {
    var item = LISTA_EMOJIS[i];
    if (MAPA_EMOJIS[item]) {
      html += '<button class="emoji-opcion" data-emoji="' + item + '">' +
        '<img src="Imagenes/Emojis/' + MAPA_EMOJIS[item].src + '" class="emoji-img">' +
      '</button>';
    } else {
      html += '<button class="emoji-opcion" data-emoji="' + item + '">' + item + '</button>';
    }
  }
  html += '</div>';
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