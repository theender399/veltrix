exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      receivedBody: event.body,
      parsedBody: JSON.parse(event.body || '{}')
    })
  };
};
