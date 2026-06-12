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

function toggleTimer() {
  if (timerCorriendo) {
    pausarTimer();
  } else {
    iniciarTimer();
  }
}

function iniciarTimer() {
  if (timerSegundos <= 0) return;
  timerCorriendo = true;
  document.getElementById('timerBoton').textContent = '⏸';
  timerInterval = setInterval(function () {
    timerSegundos--;
    if (timerSegundos <= 0) {
      timerSegundos = 0;
      pausarTimer();
      document.getElementById('timerAlarma').style.display = 'block';
    }
    actualizarTimerUI();
  }, 1000);
}

function pausarTimer() {
  timerCorriendo = false;
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  document.getElementById('timerBoton').textContent = '▶';
}

function reiniciarTimer() {
  pausarTimer();
  timerSegundos = timerTotal;
  document.getElementById('timerAlarma').style.display = 'none';
  actualizarTimerUI();
}

function actualizarTimerUI() {
  var display = document.getElementById('timerDisplay');
  if (display) display.textContent = formatTimer(timerSegundos);
  var barra = document.getElementById('timerBarra');
  if (barra && timerTotal > 0) barra.style.width = ((timerSegundos / timerTotal) * 100) + '%';
}
