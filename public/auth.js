const auth0ClientPromise = createAuth0Client({
  domain: 'veltrixcraft.us.auth0.com',
  client_id: 'CHg3x5kXLUpe5rcI81JO926bv8lpDbn1',
  // Importante: que sea EXACTAMENTE tu dominio Netlify
  redirect_uri: 'https://veltrixcraft.netlify.app/estado' 
});

async function updateUI() {
  const auth0 = await auth0ClientPromise;
  const isAuthenticated = await auth0.isAuthenticated();

  const container = document.getElementById("auth-menu-container");
  if (!container) return;

  container.innerHTML = "";

  if (isAuthenticated) {
    const user = await auth0.getUser();
    const avatar = document.createElement("img");
    avatar.src = user.picture;
    avatar.alt = "Avatar";
    avatar.className = "user-avatar";

    const name = document.createElement("span");
    name.textContent = user.name;
    name.className = "user-name";

    const logoutBtn = document.createElement("button");
    logoutBtn.textContent = "Cerrar sesión";
    logoutBtn.onclick = () => auth0.logout({ returnTo: 'https://veltrixstatus.netlify.app' });

    container.appendChild(avatar);
    container.appendChild(name);
    container.appendChild(logoutBtn);
  } else {
    const loginBtn = document.createElement("button");
    loginBtn.textContent = "Iniciar sesión";
    loginBtn.onclick = () => auth0.loginWithRedirect();
    container.appendChild(loginBtn);
  }

  return isAuthenticated;
}

window.onload = async () => {
  const auth0 = await auth0ClientPromise;

  // Maneja el callback solo en /estado (tu redirect_uri)
  if (window.location.pathname === "/estado" && window.location.search.includes("code=") && window.location.search.includes("state=")) {
    await auth0.handleRedirectCallback();
    // Limpia URL para evitar que se repita el callback
    window.history.replaceState({}, document.title, "/estado");
  }

  await updateUI();
};
