// Configuración RCON
const RCON_CONFIG = {
  host: '172.93.110.246',
  port: 25575, // Puerto RCON
  password: '11241112412434532112324345321123', // Se obtendrá del backend seguro
  timeout: 5000
};

// Elementos del DOM
const consola = document.getElementById('consola-rcon');
const form = document.getElementById('rcon-form');
const comandoInput = document.getElementById('rcon-comando');
const submitBtn = document.getElementById('rcon-submit');
const estadoPanel = document.getElementById('estado-panel');
const estadoTexto = document.getElementById('estado-texto');
const jugadoresContador = document.getElementById('jugadores-contador');

// Variables de estado
let rconConnection = null;
let isAuthenticated = false;

// Función para agregar mensajes a la consola
function logConsola(mensaje, tipo = 'salida') {
  const ahora = new Date();
  const hora = ahora.toLocaleTimeString();
  const elemento = document.createElement('div');
  elemento.className = `mensaje-${tipo}`;
  elemento.innerHTML = `[${hora}] ${mensaje}`;
  consola.appendChild(elemento);
  consola.scrollTop = consola.scrollHeight;
}

// Conexión RCON (usando un backend seguro)
async function conectarRCON() {
  try {
    logConsola('Conectando al servidor RCON...', 'sistema');
    
    const auth0 = await auth0ClientPromise;
    isAuthenticated = await auth0.isAuthenticated();
    
    if (!isAuthenticated) {
      throw new Error('Debes iniciar sesión para usar RCON');
    }
    
    const respuesta = await fetch('/.netlify/functions/rcon-connect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await auth0.getTokenSilently()}`
      },
      body: JSON.stringify({ server: 'lobby' })
    });
    
    if (!respuesta.ok) {
      throw new Error('Error al conectar con RCON');
    }
    
    const data = await respuesta.json();
    RCON_CONFIG.password = data.tempPassword;
    
    logConsola('Conexión RCON establecida', 'sistema');
    estadoPanel.className = 'estado-panel online';
    estadoTexto.textContent = 'Conectado al servidor';
    
    // Habilitar interfaz
    comandoInput.disabled = false;
    submitBtn.disabled = false;
    comandoInput.focus();
    
    // Obtener estado inicial
    obtenerEstadoServidor();
    
  } catch (error) {
    logConsola(`Error: ${error.message}`, 'error');
    estadoPanel.className = 'estado-panel offline';
    estadoTexto.textContent = 'Error de conexión';
  }
}

// Enviar comando RCON
async function enviarComando(comando) {
  if (!comando.trim()) return;
  
  logConsola(comando, 'entrada');
  
  try {
    const respuesta = await fetch('/.netlify/functions/rcon-command', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await auth0.getTokenSilently()}`
      },
      body: JSON.stringify({
        server: 'lobby',
        command: comando
      })
    });
    
    if (!respuesta.ok) {
      throw new Error('Error al ejecutar comando');
    }
    
    const data = await respuesta.json();
    logConsola(data.response, 'salida');
    
    // Si es un comando de jugadores, actualizar contador
    if (comando.startsWith('list') || comando.startsWith('players')) {
      actualizarContadorJugadores(data.response);
    }
    
  } catch (error) {
    logConsola(`Error: ${error.message}`, 'error');
  }
}

// Analizar respuesta de jugadores
function actualizarContadorJugadores(respuesta) {
  const match = respuesta.match(/There are (\d+) of a max of (\d+) players online/);
  if (match) {
    jugadoresContador.textContent = `${match[1]}/${match[2]} jugadores`;
  }
}

// Obtener estado periódico del servidor
async function obtenerEstadoServidor() {
  try {
    await enviarComando('list');
    setTimeout(obtenerEstadoServidor, 30000); // Actualizar cada 30s
  } catch (error) {
    logConsola('Error obteniendo estado del servidor', 'error');
  }
}

// Event Listeners
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const comando = comandoInput.value;
  comandoInput.value = '';
  await enviarComando(comando);
});

// Historial de comandos con flechas
const historialComandos = [];
let indiceHistorial = -1;

comandoInput.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' && historialComandos.length > 0) {
    e.preventDefault();
    if (indiceHistorial < historialComandos.length - 1) {
      indiceHistorial++;
    }
    comandoInput.value = historialComandos[historialComandos.length - 1 - indiceHistorial];
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (indiceHistorial > 0) {
      indiceHistorial--;
      comandoInput.value = historialComandos[historialComandos.length - 1 - indiceHistorial];
    } else {
      indiceHistorial = -1;
      comandoInput.value = '';
    }
  }
});

// Iniciar conexión al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  // Verificar autenticación primero
  (async () => {
    try {
      const auth0 = await auth0ClientPromise;
      isAuthenticated = await auth0.isAuthenticated();
      
      if (isAuthenticated) {
        await conectarRCON();
      } else {
        logConsola('Por favor inicia sesión para acceder a RCON', 'error');
        estadoTexto.textContent = 'No autenticado';
      }
    } catch (error) {
      logConsola(`Error de autenticación: ${error.message}`, 'error');
    }
  })();
});

// Función para limpiar la consola
function limpiarConsola() {
  consola.innerHTML = '';
  logConsola('Consola limpiada', 'sistema');
}
