// netlify/functions/test-rcon.js
const { RCON } = require('minecraft-server-util');

exports.handler = async () => {
  try {
    const client = new RCON();
    await client.connect({
      host: process.env.RCON_HOST,
      port: parseInt(process.env.RCON_PORT),
      password: process.env.RCON_PASSWORD,
      timeout: 5000
    });
    
    const response = await client.execute('list');
    await client.close();
    
    return {
      statusCode: 200,
      body: `✅ RCON funciona! Respuesta: ${response}`
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `❌ Error: ${error.message}\n\nVariables usadas:\nHost: ${process.env.RCON_HOST}\nPort: ${process.env.RCON_PORT}`
    };
  }
};
