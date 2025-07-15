// auth.js

// Asegúrate de cargar antes el SDK:
// <script src="https://cdn.auth0.com/js/auth0-spa-js/1.26/auth0-spa-js.production.js"></script>

let auth0 = null;

window.onload = async () => {
  auth0 = await createAuth0Client({
    domain: "dev-gfo057i2wbpzipno.us.auth0.com",
    client_id: "SqvyN9CZm22K6uZsuDT7C9rH5JHe59Mz",
    redirect_uri: window.location.origin
  });

  // Procesar el callback de login si existe
  if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
    await auth0.handleRedirectCallback();
    window.history.replaceState({}, document.title, "/");
  }

  await updateUI();

  // Asignar eventos a botones si existen
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");

  if (loginBtn) loginBtn.addEventListener("click", login);
  if (logoutBtn) logoutBtn.addEventListener("click", logout);
};

async function login() {
  await auth0.loginWithRedirect();
}

function logout() {
  auth0.logout({
    returnTo: window.location.origin
  });
}

async function updateUI() {
  const isAuthenticated = await auth0.isAuthenticated();

  if (isAuthenticated) {
    const user = await auth0.getUser();

    // Mostrar datos usuario y botones
    document.getElementById("login-btn").style.display = "none";
    document.getElementById("logout-btn").style.display = "inline-block";
    document.getElementById("user-name").textContent = user.name || "";
    document.getElementById("user-pic").src = user.picture || "";
    document.getElementById("user-info").style.display = "flex";
  } else {
    // Mostrar login solo
    document.getElementById("login-btn").style.display = "inline-block";
    document.getElementById("logout-btn").style.display = "none";
    document.getElementById("user-name").textContent = "";
    document.getElementById("user-pic").src = "";
    document.getElementById("user-info").style.display = "none";
  }
}
