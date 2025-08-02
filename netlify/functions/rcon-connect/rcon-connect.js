const { RCON } = require('minecraft-server-util');

exports.handler = async (event, context) => {
  // Verifica autenticación con Netlify Identity
  if (!context.clientContext.user) {
    return { statusCode: 401, body: 'Acceso no autorizado' };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ 
      message: "RCON ready",
      timestamp: Date.now() 
    })
  };
};
