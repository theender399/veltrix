const fs = require('fs');
const path = require('path');
const { status } = require('minecraft-server-util');

exports.handler = async function () {
  const jsonPath = path.join(__dirname, 'servidores.json');
  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const servidores = JSON.parse(raw);

  const resultado = {};

  // Ping a cada servidor
  await Promise.all(servidores.map(async ({ id, nombre, host, puerto }) => {
    try {
      const res = await status(host, parseInt(puerto), { timeout: 2000 });
      resultado[id] = {
        nombre,
        online: true,
        players: res.players.online,
        max: res.players.max
      };
    } catch (err) {
      resultado[id] = {
        nombre,
        online: false,
        players: 0,
        max: 0
      };
    }
  }));

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resultado)
  };
};
