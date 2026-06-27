var MAPA_EMOJIS = {
  'feliz': 'feliz.png',
  'cocina': 'cocina.png',
  'chef': 'chef.png',
  'fuego': 'fuego.png',
  'corazon': 'corazon.png',
  'ok': 'ok.png',
  'estrella': 'estrella.png'
};

var LISTA_EMOJIS = Object.keys(MAPA_EMOJIS);

function abrirEmojiPopup(textareaId) {
  cerrarEmojiPopup();
  var popup = document.createElement('div');
  popup.className = 'emoji-popup';
  popup.id = 'emojiPopup';
  popup.dataset.textarea = textareaId;
  popup.innerHTML = '<div style="display:flex;flex-wrap:wrap;gap:0.4rem;">' +
    LISTA_EMOJIS.map(function (c) {
      return '<button class="emoji-opcion" data-codigo="' + c + '" title=":' + c + ':">' +
        '<img src="Imagenes/Emojis/' + MAPA_EMOJIS[c] + '" alt=":' + c + ':" class="emoji-propio">' +
      '</button>';
    }).join('') +
  '</div>';
  document.body.appendChild(popup);
  popup.addEventListener('click', function (e) {
    var btn = e.target.closest('.emoji-opcion');
    if (!btn) return;
    insertarEmoji(textareaId, btn.dataset.codigo);
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

function insertarEmoji(textareaId, codigo) {
  var ta = document.getElementById(textareaId);
  if (!ta) return;
  formatearTexto(ta, ':' + codigo + ':', '');
  cerrarEmojiPopup();
}