var CLAVE_SESION = 'recetario-sesion';

async function sha256(texto) {
  var encoder = new TextEncoder();
  var data = encoder.encode(texto);
  var hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
}

async function peticionAuth(url, opts) {
  var res = await fetch(url, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    ...opts
  });
  if (!res.ok) throw new Error('Error ' + res.status);
  if (opts && opts.method === 'DELETE') return null;
  return res.json();
}

function obtenerSesion() {
  try { return JSON.parse(localStorage.getItem(CLAVE_SESION)); } catch (e) { return null; }
}

function estaLogueado() {
  return obtenerSesion() !== null;
}

function guardarSesion(usuario) {
  localStorage.setItem(CLAVE_SESION, JSON.stringify({
    userId: usuario.id,
    username: usuario.username,
    avatarUrl: usuario.avatar_url || ''
  }));
}

function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
  actualizarUI();
}

async function iniciarSesion(username, password) {
  var hash = await sha256(password);
  var data = await peticionAuth(SUPABASE_URL + '/rest/v1/usuarios?select=*&username=eq.' + encodeURIComponent(username));
  if (data && data[0] && data[0].password === hash) {
    guardarSesion(data[0]);
    actualizarUI();
    return true;
  }
  return false;
}

async function crearUsuario(username, password, avatarUrl) {
  var hash = await sha256(password);
  var nuevo = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    username: username,
    password: hash,
    avatar_url: avatarUrl || ''
  };
  await peticionAuth(SUPABASE_URL + '/rest/v1/usuarios', {
    method: 'POST',
    body: JSON.stringify(nuevo)
  });
  return nuevo;
}

var sesionActual = obtenerSesion();

function avatarHtml(size) {
  size = size || 32;
  var sesion = obtenerSesion();
  if (!sesion) return '';
  var url = sesion.avatarUrl;
  var inicial = sesion.username.charAt(0).toUpperCase();
  if (url) {
    return '<img src="' + url + '" class="avatar-img" style="width:' + size + 'px;height:' + size + 'px;border-radius:50%;object-fit:cover;" alt="Avatar" onerror="this.remove()">';
  }
  return '<span class="avatar-inicial" style="width:' + size + 'px;height:' + size + 'px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;background:var(--verde);color:#fff;font-weight:600;font-size:' + (size * 0.45) + 'px;flex-shrink:0;">' + inicial + '</span>';
}

function avatarHtmlFor(username, avatarUrl, size) {
  size = size || 32;
  var inicial = (username || '?').charAt(0).toUpperCase();
  if (avatarUrl) {
    return '<img src="' + avatarUrl + '" class="avatar-img" style="width:' + size + 'px;height:' + size + 'px;border-radius:50%;object-fit:cover;" alt="Avatar" onerror="this.remove()">';
  }
  return '<span class="avatar-inicial" style="width:' + size + 'px;height:' + size + 'px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;background:var(--verde);color:#fff;font-weight:600;font-size:' + (size * 0.45) + 'px;flex-shrink:0;">' + inicial + '</span>';
}

function actualizarUI() {
  var logueado = estaLogueado();
  var sesion = obtenerSesion();

  // Nav CTA - botón añadir receta
  document.querySelectorAll('.nav-cta').forEach(function (el) {
    el.style.display = logueado ? '' : 'none';
  });
  document.querySelectorAll('.nav-mobile-cta').forEach(function (el) {
    el.style.display = logueado ? '' : 'none';
  });

  // Botón de login/logout en nav
  document.querySelectorAll('.nav-auth').forEach(function (el) { el.remove(); });

  var navInner = document.querySelector('.nav-inner');
  var menuBotones = document.querySelector('.menu-botones');
  if (navInner && menuBotones) {
    var authBtn = document.createElement('div');
    authBtn.className = 'nav-auth';
    if (logueado) {
      authBtn.innerHTML = '<div class="nav-auth-usuario">' +
        avatarHtml(28) +
        '<span class="nav-auth-username">' + sesion.username + '</span>' +
        '<button class="nav-auth-logout" onclick="cerrarSesion()" title="Cerrar sesión">🚪</button>' +
        '</div>';
    } else {
      authBtn.innerHTML = '<button class="nav-auth-login" onclick="abrirModalLogin()">🔑 Iniciar sesión</button>';
    }
    menuBotones.appendChild(authBtn);
  }

  // Mobile auth
  document.querySelectorAll('.nav-mobile-auth').forEach(function (el) { el.remove(); });
  var mobileMenu = document.getElementById('navMobileMenu');
  if (mobileMenu) {
    var divider = mobileMenu.querySelector('.nav-mobile-divider');
    if (divider) {
      var mobileAuth = document.createElement('div');
      mobileAuth.className = 'nav-mobile-auth';
      if (logueado) {
        mobileAuth.innerHTML = '<div style="display:flex;align-items:center;gap:0.5rem;padding:0.75rem 1rem;">' +
          avatarHtml(28) +
          '<span style="flex:1;font-size:0.875rem;">' + sesion.username + '</span>' +
          '<button class="nav-auth-logout" onclick="cerrarSesion()" title="Cerrar sesión">🚪 Cerrar sesión</button>' +
          '</div>';
      } else {
        mobileAuth.innerHTML = '<div style="padding:0.75rem 1rem;"><button class="nav-auth-login" onclick="abrirModalLogin()" style="width:100%;padding:0.5rem;background:var(--verde);color:#fff;border:none;border-radius:0.5rem;cursor:pointer;">🔑 Iniciar sesión</button></div>';
      }
      divider.parentNode.insertBefore(mobileAuth, divider);
    }
  }

  // Planificador: redirigir si no logueado
  if (window.location.pathname.indexOf('planificador') !== -1 && !logueado) {
    window.location.href = 'index.html';
  }
}

var modalLoginAbierto = false;
var modalLoginElement = null;

function abrirModalLogin() {
  if (modalLoginElement) cerrarModalLogin();
  var overlay = document.createElement('div');
  overlay.className = 'modal-login-overlay';
  overlay.id = 'modalLoginOverlay';
  overlay.onclick = function (e) { if (e.target === this) cerrarModalLogin(); };
  overlay.innerHTML = '<div class="modal-login">' +
    '<button class="modal-login-cerrar" onclick="cerrarModalLogin()">✕</button>' +
    '<h2>🔑 Iniciar sesión</h2>' +
    '<div class="login-form">' +
      '<div class="login-campo">' +
        '<label for="loginUsername">Usuario</label>' +
        '<input type="text" id="loginUsername" placeholder="Nombre de usuario">' +
      '</div>' +
      '<div class="login-campo">' +
        '<label for="loginPassword">Contraseña</label>' +
        '<input type="password" id="loginPassword" placeholder="Contraseña">' +
      '</div>' +
      '<div class="login-error" id="loginError"></div>' +
      '<button class="login-btn" id="loginBtn">Iniciar sesión</button>' +
      '<p class="login-admin-link"><a href="admin.html">🔧 Administrar usuarios</a></p>' +
    '</div>' +
  '</div>';
  document.body.appendChild(overlay);
  modalLoginElement = overlay;
  modalLoginAbierto = true;

  document.getElementById('loginBtn').addEventListener('click', async function () {
    var username = document.getElementById('loginUsername').value.trim();
    var password = document.getElementById('loginPassword').value.trim();
    var errorEl = document.getElementById('loginError');
    if (!username || !password) {
      errorEl.textContent = 'Completa ambos campos';
      return;
    }
    try {
      var ok = await iniciarSesion(username, password);
      if (ok) {
        cerrarModalLogin();
        if (window.location.pathname.indexOf('agregar') !== -1 || window.location.pathname.indexOf('planificador') !== -1) {
          window.location.reload();
        }
      } else {
        errorEl.textContent = 'Usuario o contraseña incorrectos';
      }
    } catch (e) {
      errorEl.textContent = 'Error al conectar con el servidor';
    }
  });

  document.getElementById('loginPassword').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') document.getElementById('loginBtn').click();
  });
}

function cerrarModalLogin() {
  if (modalLoginElement) {
    modalLoginElement.remove();
    modalLoginElement = null;
  }
  modalLoginAbierto = false;
}

document.addEventListener('DOMContentLoaded', function () {
  actualizarUI();
});
