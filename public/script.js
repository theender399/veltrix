// Configuración centralizada de servidores
const serverConfig = {
  proxy: { 
    name: 'Proxy', 
    path: '/proxy/',
    style: 'border-color: #00ff88;' 
  },
  server1: { 
    name: 'Lobby', 
    path: '/server1/',
    style: 'border-color: #0099ff;'
  },
  server2: { 
    name: 'Fastfarm', 
    path: '/server2/',
    style: 'border-color: #ff9900;'
  }
};

// Estilos reutilizables
const styles = {
  nombre: 'font-weight: bold; font-size: 1.2rem;',
  estado: 'font-family: monospace; margin: 5px 0;',
  error: 'color: #ff5555; font-family: monospace;',
  jugadores: 'font-family: monospace; color: #aaaaaa;',
  consolaLink: 'color: #00ffaa; text-decoration: none; margin-top: 8px; display: inline-block;'
};

// Cache de elementos DOM
const containers = {};
Object.keys(serverConfig).forEach(id => {
  containers[id] = document.getElementById(id);
});

/**
 * Actualiza la UI con el estado de los servidores
 * @param {Object} data - Datos de respuesta de la API
 * @param {boolean} isAuthenticated - Si el usuario está autenticado
 */
function actualizarUI(data, isAuthenticated) {
  Object.entries(serverConfig).forEach(([id, config]) => {
    const container = containers[id];
    if (!container) return;

    const srv = data[id];
    container.className = 'card';
    container.style.cssText = srv?.online ? config.style : 'border-color: #ff5555;';

    if (!srv) {
      container.innerHTML = `<span style="${styles.error}">⚠️ Servidor no disponible</span>`;
      return;
    }

    container.innerHTML = `
      <span style="${styles.nombre}">${config.name}</span>
      <span class="estado" style="${styles.estado}">
        ${srv.online ? '🟢 Online' : '🔴 Offline'}
      </span>
      ${srv.online ? `
        <span style="${styles.jugadores}">
          👥 ${srv.players}/${srv.max} jugadores
        </span>
      ` : ''}
      ${isAuthenticated && srv.online ? `
        <a href="${config.path}" style="${styles.consolaLink}">
          [Acceder a consola]
        </a>
      ` : ''}
    `;
  });
}

/**
 * Carga el estado de los servidores desde la API
 */
async function cargarEstado() {
  try {
    const [auth0, res] = await Promise.all([
      auth0ClientPromise,
      fetch('/.netlify/functions/estado', {
        headers: { 'Cache-Control': 'no-cache' }
      })
    ]);
    
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
    
    const data = await res.json();
    const isAuthenticated = await auth0?.isAuthenticated() || false;
    
    actualizarUI(data, isAuthenticated);

  } catch (error) {
    console.error('Error al cargar estado:', error);
    document.getElementById('estado')?.insertAdjacentHTML('beforeend', `
      <p style="${styles.error}">
        ⚠️ Error: ${error.message || 'No se pudo cargar el estado'}
      </p>
    `);
  }
}

// Sistema de actualización automática
let refreshInterval;
function iniciarMonitor() {
  cargarEstado(); // Carga inmediata
  refreshInterval = setInterval(cargarEstado, 60000); // Actualizar cada minuto
  
  // Opcional: Actualizar al volver a la pestaña
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) cargarEstado();
  });
}

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', iniciarMonitor);
} else {
  iniciarMonitor();
}

// Limpiar al salir
window.addEventListener('beforeunload', () => {
  clearInterval(refreshInterval);
});
