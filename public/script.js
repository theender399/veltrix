async function cargarEstado() {
  try {
    const res = await fetch('/.netlify/functions/estado');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();

    for (const id in data) {
      const srv = data[id];
      const card = document.getElementById(id);
      if (!card) continue;

      // Remover clases previas y poner la correcta
      card.classList.remove('online', 'offline');
      card.classList.add(srv.online ? 'online' : 'offline');

      // Buscar o crear elementos internos
      let nombreSpan = card.querySelector('.nombre');
      if (!nombreSpan) {
        nombreSpan = document.createElement('span');
        nombreSpan.className = 'nombre';
        card.prepend(nombreSpan);
      }

      let estadoSpan = card.querySelector('.estado');
      if (!estadoSpan) {
        estadoSpan = document.createElement('span');
        estadoSpan.className = 'estado';
        nombreSpan.after(document.createElement('br'));
        nombreSpan.after(estadoSpan);
      }
      estadoSpan.className = `estado ${srv.online ? 'online' : 'offline'}`;
      estadoSpan.textContent = srv.online ? '🟢 Online' : '🔴 Offline';

      let jugadoresSpan = card.querySelector('.jugadores');
      if (!jugadoresSpan) {
        jugadoresSpan = document.createElement('span');
        jugadoresSpan.className = 'jugadores';
        estadoSpan.after(document.createElement('br'));
        estadoSpan.after(jugadoresSpan);
      }
      jugadoresSpan.textContent = srv.online ? `Jugadores: ${srv.players}/${srv.max}` : '';
    }
  } catch (error) {
    console.error('Error cargando estado:', error);
    const contenedor = document.getElementById('estado');
    contenedor.innerHTML = `<p style="color:red;">No se pudo cargar el estado. Intenta recargar la página.</p>`;
  }
}

cargarEstado();
setInterval(cargarEstado, 60000);
