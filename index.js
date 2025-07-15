const express = require('express');
const path = require('path');
const fs = require('fs');
const { status } = require('minecraft-server-util');

require('./keep_alive.js'); // Activa el servidor keep-alive para Replit

const app = express();
const PORT = process.env.PORT || 3000;

// Sirve archivos estáticos desde la carpeta /public
app.use(express.static(path.join(__dirname, 'public')));

app.get('/estado', async (req, res) => {
  try {
    const servers = JSON.parse(fs.readFileSync('servidores.json', 'utf-8'));
    const resultados = {};

    await Promise.all(
      servers.map(async (srv) => {
        try {
          const respuesta = await status(srv.host, srv.puerto, { timeout: 3000 });
          resultados[srv.id] = {
            nombre: srv.nombre,
            online: true,
            players: respuesta.players.online,
            max: respuesta.players.max
          };
        } catch {
          resultados[srv.id] = {
            nombre: srv.nombre,
            online: false,
            players: 0,
            max: 0
          };
        }
      })
    );

    res.json(resultados);
  } catch (error) {
    console.error('Error leyendo servidores.json:', error);
    res.status(500).json({ error: 'Error al consultar el estado de los servidores' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
