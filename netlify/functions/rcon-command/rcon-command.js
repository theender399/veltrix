// netlify/functions/rcon-command.js
const { RCON } = require('minecraft-server-util');

exports.handler = async (event) => {
  // Verifica el método HTTP
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método no permitido. Usa POST' })
    };
  }

  // Parsea el cuerpo de la solicitud
  let data;
  try {
    data = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Cuerpo JSON inválido' })
    };
  }

  // Valida el comando
  if (!data.command) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'El campo "command" es requerido' })
    };
  }

  // Configuración RCON (usa variables de entorno de Netlify)
  const config = {
    host: process.env.RCON_HOST,
    port: parseInt(process.env.RCON_PORT),
    password: process.env.RCON_PASSWORD,
    timeout: 4000 // 4 segundos
  };

  // Ejecuta el comando
  const client = new RCON();
  try {
    await client.connect(config);
    const response = await client.execute(data.command);
    return {
      statusCode: 200,
      body: JSON.stringify({ response })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Error en RCON',
        message: error.message,
        config: { ...config, password: '***' } // Oculta la contraseña en logs
      })
    };
  } finally {
    await client.close();
  }
};
