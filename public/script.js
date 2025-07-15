async function cargarEstado() {
  try {
    const auth0 = await auth0ClientPromise;
    const isAuthenticated = await auth0.isAuthenticated();

    const res = await fetch('/.netlify/functions/estado');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();

    for (const id of ['proxy', 'lobby', 'fastfarm']) {
      const srv = data[id];
      const container = document.getElementById(id);
      if (!container) continue;

      container.innerHTML = '';
      container.classList.remove('online', 'offline');
      container.classList.add(srv && srv.online ? 'online' : 'offline');

      const nombreHTML = `<span class="nombre" style="font-weight:bold; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 1.2rem;">${srv?.name || id}</span>`;
      const estadoHTML = `<span class="estado ${srv && srv.online ? 'online' : 'offline'}" style="font-family: monospace;">${srv && srv.online ? '🟢 Online' : '🔴 Offline'}</span>`;
      const jugadoresHTML = `<span class="jugadores" style="font-family: monospace;">${srv && srv.online ? `Jugadores: ${srv.players}/${srv.max}` : ''}</span>`;

      let consolaHTML = '';
      if (isAuthenticated && srv && srv.online) {
        consolaHTML = ` <a href="${id}.html" class="consola-link" style="color:#007bff; text-decoration:none; font-weight:bold; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">[Console]</a>`;
      }

      container.innerHTML = `
        ${nombreHTML} <br>
        ${estadoHTML} <br>
        ${jugadoresHTML}
        ${consolaHTML}
      `;
    }
  } catch (error) {
    console.error('Error cargando estado:', error);
    const contenedor = document.getElementById('estado');
    contenedor.innerHTML = `<p style="color:red;">No se pudo cargar el estado. Intenta recargar la página.</p>`;
  }
}

cargarEstado();
setInterval(cargarEstado, 60000);
