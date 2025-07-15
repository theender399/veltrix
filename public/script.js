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
      // Consola será un link o texto segun autenticacion
      const consolaHTML = isAuthenticated
        ? `<a href="${id}.html" class="consola-link" style="color:#007bff; text-decoration:none;">Acceder</a>`
        : `<span style="color:red; font-style: italic;">Inicie sesión para acceder</span>`;

      const contenido = `
        <span class="nombre">${srv.name || id}</span><br>
        <span class="estado ${srv.online ? 'online' : 'offline'}">
          ${srv.online ? '🟢 Online' : '🔴 Offline'}
        </span><br>
        <span class="jugadores">${srv.online ? `Jugadores: ${srv.players}/${srv.max}` : ''}</span><br>
        <span class="consola">Consola: ${srv.online ? consolaHTML : ''}</span>
      `;

      if (isAuthenticated) {
        // Si está logeado, el container es un enlace clickeable pero solo el contenido, no el link entero
        const card = document.createElement('div');
        card.className = 'server-card';
        card.innerHTML = contenido;
        container.appendChild(card);
      } else {
        // Si no está logeado, mostrar tarjeta con aviso
        container.innerHTML = contenido;
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
