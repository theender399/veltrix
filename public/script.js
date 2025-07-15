async function cargarEstado() {
  try {
    const res = await fetch('/estado'); // Tu endpoint que devuelve JSON
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();

    // Para cada id de servidor actualizamos la tarjeta existente
    for (const id in data) {
      const srv = data[id];
      const card = document.getElementById(id);
      if (!card) continue;

      // Limpiamos clases previas y asignamos según estado
      card.classList.remove('online', 'offline');
      card.classList.add(srv.online ? 'online' : 'offline');

      // Actualizamos contenido HTML, respetando estructura
      card.innerHTML = `
        ${srv.nombre}<br>
        <span class="estado ${srv.online ? 'online' : 'offline'}">
          ${srv.online ? '🟢 Online' : '🔴 Offline'}
        </span><br>
        <span class="jugadores">${srv.online ? `Jugadores: ${srv.players}/${srv.max}` : ''}</span>
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
