// netlify/functions/rcon-command.js
const { RCON } = require('minecraft-server-util');

exports.handler = async (event) => {
  const { command } = JSON.parse(event.body);
  
  const client = new RCON();
  try {
    // Versión CORRECTA (host como string)
    await client.connect(
      process.env.RCON_HOST, // ← String directo
      parseInt(process.env.RCON_PORT),
      { 
        password: process.env.RCON_PASSWORD,
        timeout: 5000
      }
    );
    
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
        stack: error.stack // ← Para debug
      })
    };
  }
};
