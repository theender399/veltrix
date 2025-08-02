const { RCON } = require('minecraft-server-util');

exports.handler = async (event) => {
  // 1. Verifica si hay body
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "No se recibieron datos" })
    };
  }

  // 2. Parsea el JSON con manejo de errores
  let commandData;
  try {
    commandData = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ 
        error: "Formato JSON inválido",
        details: e.message
      })
    };
  }

  // 3. Verifica que venga el comando
  if (!commandData.command) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Falta el campo 'command'" })
    };
  }

  // 4. Ejecución RCON (con timeout)
  const client = new RCON();
  try {
    await client.connect({
      host: process.env.RCON_HOST,
      port: parseInt(process.env.RCON_PORT),
      password: process.env.RCON_PASSWORD,
      timeout: 4000 // 4 segundos
    });

    const response = await client.execute(commandData.command);
    return {
      statusCode: 200,
      body: JSON.stringify({ response })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Error en RCON",
        message: error.message,
        stack: error.stack
      })
    };
  } finally {
    await client.close();
  }
};
