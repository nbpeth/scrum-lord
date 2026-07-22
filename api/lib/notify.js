const notifyCaller = (ws, message) => {
  ws.send(JSON.stringify(message));
};

const createClientNotifier = (websocketServer) => {
  return ({ message, communityId }) => {
    const data = JSON.stringify(message);
    const isTargeted = communityId !== undefined;

    websocketServer.clients.forEach((client) => {
      const shouldReceive = isTargeted
        ? String(communityId) === String(client.targetCommunityId)
        : !client.targetCommunityId;

      if (shouldReceive) {
        client.send(data);
      }
    });
  };
};

module.exports = { createClientNotifier, notifyCaller };
