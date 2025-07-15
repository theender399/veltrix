require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const SERVIDORES_FILE = './servidores.json';

// Función para leer y escribir servidores.json
function leerServidores() {
  try {
    const data = fs.readFileSync(SERVIDORES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function escribirServidores(data) {
  fs.writeFileSync(SERVIDORES_FILE, JSON.stringify(data, null, 2));
}

// Aquí poné el ID del canal donde DiscordSRV manda los mensajes
const DISCORDSRV_CHANNEL_ID = 'TU_CANAL_ID_AQUI';

client.once('ready', () => {
  console.log(`Bot listo como ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
  // Ignorar mensajes de bots y de otros canales
  if (message.author.bot) return;
  if (message.channel.id !== DISCORDSRV_CHANNEL_ID) return;

  // Ejemplo simple de parseo:  
  // Mensaje: "Servidor proxy está online con 10 jugadores"
  // Lo vamos a buscar con regex y actualizar el JSON

  const regex = /Servidor (\w+) está (online|offline) con (\d+) jugadores/i;
  const match = message.content.match(regex);

  if (match) {
    const [, id, estado, jugadoresStr] = match;
    const online = estado.toLowerCase() === 'online';
    const jugadores = parseInt(jugadoresStr, 10);

    const servidores = leerServidores();

    const index = servidores.findIndex(s => s.id === id);
    if (index !== -1) {
      servidores[index].online = online;
      servidores[index].players = jugadores;
    } else {
      // Si no existe, agregarlo (nombre igual al id por defecto)
      servidores.push({
        id,
        nombre: id,
        host: '',
        puerto: 25565,
        online,
        players: jugadores
      });
    }

    escribirServidores(servidores);

    console.log(`Actualizado servidor ${id}: ${online ? 'online' : 'offline'}, jugadores: ${jugadores}`);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
