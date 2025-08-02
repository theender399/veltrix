const { RCON } = require('minecraft-server-util');

exports.handler = async (event) => {
  const { command } = JSON.parse(event.body);
  
  try {
    const client = new RCON();
    await client.connect({
      host: process.env.RCON_HOST,
      port: parseInt(process.env.RCON_PORT),
      password: process.env.RCON_PASSWORD
    });

    const response = await client.execute(command);
    await client.close();

    return {
      statusCode: 200,
      body: JSON.stringify({ response })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: error.message,
        details: "Verifica que el servidor RCON esté activo y las credenciales sean correctas"
      })
    };
  }
};
