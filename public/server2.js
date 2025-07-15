// server2.js

document.addEventListener('DOMContentLoaded', () => {
  const logOutput = document.getElementById('log-output');

  if (!logOutput) return;

  // Texto inicial de carga
  logOutput.textContent = 'Cargando registros del servidor FastFarm...';

  // Simulación de logs que llegan en tiempo real
  let contador = 1;

  const intervalId = setInterval(() => {
    const online = Math.random() > 0.2;
    const estado = online ? 'ONLINE ✅' : 'OFFLINE ❌';
    const timestamp = new Date().toLocaleTimeString();

    logOutput.textContent += `\n[${timestamp}] FastFarm está ${estado} - Log #${contador++}`;

    // Auto scroll hacia abajo
    logOutput.scrollTop = logOutput.scrollHeight;

    // Opcional: para no llenar infinitamente, para después de 20 logs
    if (contador > 20) {
      clearInterval(intervalId);
      logOutput.textContent += '\n--- Fin de los registros simulados ---';
    }
  }, 1500);
});
