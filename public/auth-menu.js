// auth-menu.js - Menú hamburguesa con Auth0

let auth0 = null;

const config = {
  domain: "dev-gfo057i2wbpzipno.us.auth0.com",
  clientId: "SqvyN9CZm22K6uZsuDT7C9rH5JHe59Mz"
};

async function initAuth() {
  auth0 = await createAuth0Client({
    domain: config.domain,
    client_id: config.clientId,
    cacheLocation: 'localstorage'
  });

  updateUI();

  // Opcional: detectar si hay callback de login
  if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
    await auth0.handleRedirectCallback();
    window.history.replaceState({}, document.title, "/");
    updateUI();
  }
}

async function updateUI() {
  const isAuthenticated = await auth0.isAuthenticated();
  const menuContainer = document.getElementById('menu-superior');

  if (isAuthenticated) {
    const user = await auth0.getUser();
    menuContainer.innerHTML = `
      <div class="menu-item" onclick="location.href='/inicio'">Inicio<div class="descripcion">Volver a la página principal</div></div>
      <div class="menu-item" onclick="location.href='/estado'">Estado<div class="descripcion">Estado de los servidores</div></div>
      <div class="menu-item" onclick="window.open('https://discord.gg/tu-servidor', '_blank')">Discord<div class="descripcion">Únete a nuestra comunidad</div></div>
      <div class="menu-item tienda" onclick="alert('La tienda estará disponible pronto!')">Tienda<div class="descripcion proximamente">Próximamente</div></div>

      <div class="menu-item user-menu">
        <img src="${user.picture}" alt="${user.name}" class="user-pic" />
        ${user.name}
        <div class="descripcion">Usuario logueado</div>
        <div class="submenu">
          <div class="submenu-item" onclick="logout()">Cerrar sesión</div>
        </div>
      </div>
    `;

    // Agregar eventos para mostrar submenu al hacer hover
    const userMenu = menuContainer.querySelector('.user-menu');
    userMenu.addEventListener('mouseenter', () => {
      userMenu.querySelector('.submenu').style.display = 'block';
    });
    userMenu.addEventListener('mouseleave', () => {
      userMenu.querySelector('.submenu').style.display = 'none';
    });

  } else {
    menuContainer.innerHTML = `
      <div class="menu-item" onclick="location.href='/inicio'">Inicio<div class="descripcion">Volver a la página principal</div></div>
      <div class="menu-item" onclick="login()">Estado<div class="descripcion">Estado de los servidores (Requiere login)</div></div>
      <div class="menu-item" onclick="window.open('https://discord.gg/tu-servidor', '_blank')">Discord<div class="descripcion">Únete a nuestra comunidad</div></div>
      <div class="menu-item tienda" onclick="alert('La tienda estará disponible pronto!')">Tienda<div class="descripcion proximamente">Próximamente</div></div>
      <div class="menu-item login-btn" onclick="login()">Login</div>
    `;
  }
}

async function login() {
  await auth0.loginWithRedirect({
    redirect_uri: window.location.origin
  });
}

function logout() {
  auth0.logout({
    returnTo: window.location.origin
  });
}

window.onload = () => {
  initAuth();
};
