const auth0ClientPromise = createAuth0Client({
  domain: 'dev-gfo057i2wbpzipno.us.auth0.com',
  client_id: 'SqvyN9CZm22K6uZsuDT7C9rH5JHe59Mz',
  redirect_uri: window.location.origin
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
    logoutBtn.onclick = () => auth0.logout({ returnTo: window.location.origin });

    container.appendChild(avatar);
    container.appendChild(name);
    container.appendChild(logoutBtn);
  } else {
    const loginBtn = document.createElement("button");
    loginBtn.textContent = "Iniciar sesión";
    loginBtn.onclick = () => auth0.loginWithRedirect();
    container.appendChild(loginBtn);
  }
}

window.onload = async () => {
  const auth0 = await auth0ClientPromise;

  if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
    await auth0.handleRedirectCallback();
    window.history.replaceState({}, document.title, "/estado");
  }

  updateUI();
};
