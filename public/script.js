async function cargarEstado() {
  try {
    const auth0 = await auth0ClientPromise;
    const isAuthenticated = await auth0.isAuthenticated();

    const res = await fetch('/.netlify/functions/estado');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();

    for (const id in data) {
      const srv = data[id];
      const container = document.getElementById(id);
      if (!container) continue;

      container.innerHTML = '';
      container.classList.remove('online', 'offline');
      container.classList.add(srv.online ? 'online' : 'offline');

      const contenidoBase = `
        <span class="nombre">${srv.name || id}</span><br>
        <span class="estado ${srv.online ? 'online' : 'offline'}">
          ${srv.online ? '🟢 Online' : '🔴 Offline'}
        </span><br>
        <span class="jugadores">${srv.online ? `Jugadores: ${srv.players}/${srv.max}` : ''}</span>
      `;

      if (isAuthenticated) {
        // Usuario autenticado: la tarjeta es un enlace clickeable que lleva a la consola
        const link = document.createElement('a');
        link.href = `${id}.html`;
        link.style.textDecoration = 'none';
        link.className = 'server-card-link';
        link.innerHTML = contenidoBase;
        container.appendChild(link);
      } else {
        // Usuario NO autenticado: mostrar solo la info sin enlace
        const card = document.createElement('div');
        card.className = 'server-card';
        card.innerHTML = contenidoBase;
        container.appendChild(card);
      }
    }
  } catch (error) {
    console.error('Error cargando estado:', error);
    const contenedor = document.getElementById('estado');
    contenedor.innerHTML = `<p style="color:red;">No se pudo cargar el estado. Intenta recargar la página.</p>`;
  }
}

cargarEstado();
setInterval(cargarEstado, 60000);
