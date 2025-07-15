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

      // Limpiar contenido para regenerar
      container.innerHTML = '';
      container.classList.remove('online', 'offline');
      container.classList.add(srv.online ? 'online' : 'offline');

      // Crear contenido de la tarjeta
      const contenido = `
        <span class="nombre">${srv.name || id}</span><br>
        <span class="estado ${srv.online ? 'online' : 'offline'}">
          ${srv.online ? '🟢 Online' : '🔴 Offline'}
        </span><br>
        <span class="jugadores">${srv.online ? `Jugadores: ${srv.players}/${srv.max}` : ''}</span>
      `;

      if (isAuthenticated) {
        // Si está logeado, el container es un enlace clickeable
        const link = document.createElement('a');
        link.href = `${id}.html`;
        link.style.textDecoration = 'none';
        link.className = 'server-card-link';
        link.innerHTML = contenido;
        container.appendChild(link);
      } else {
        // Si no está logeado, mostrar tarjeta pero sin enlace
        container.innerHTML = contenido + 
          '<br><span style="color:red; font-style: italic;">Inicie sesión para acceder</span>';
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
